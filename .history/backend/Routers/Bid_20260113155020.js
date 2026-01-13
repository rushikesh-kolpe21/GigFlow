// routes/bid.js
const express = require("express");
const router = express.Router();
const Bid = require("../Models/Bid");
const auth = require("../Middlewares/auth");
const Gig = require("../Models/Gig");

const mongoose = require("mongoose");

router.post("/", auth, async (req, res) => {
  try {
    const { gigId, message, price } = req.body;

    // console.log(" Bid submission attempt:");
    // console.log("   Freelancer ID:", req.user.id);
    // console.log("   Gig ID:", gigId);
    // console.log("   Price:", price);

    
    const alreadyBid = await Bid.findOne({
      gigId,
      freelancerId: req.user.id
    });

    if (alreadyBid) {
      return res.status(400).json({ message: "You already applied" });
    }

    const bid = await Bid.create({
      gigId,
      freelancerId: req.user.id, // from cookie (real user)
      message,
      price
    });

   
    res.status(201).json(bid);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// my applications
router.get("/my", auth, async (req, res) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user.id })
      .populate("gigId", "title budget status"); // gig details

    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// get bids for a gig (only owner can see)
router.get("/gig/:gigId", auth, async (req, res) => {
  try {
    const { gigId } = req.params;

    // Find gig
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // Owner check
    if (gig.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // All bids for this gig
    const bids = await Bid.find({ gigId })
      .populate("freelancerId", "firstName lastName email");

    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// Delete bid - MUST come before the /:bidId/hire route
router.delete("/:bidId", auth, async (req, res) => {
  try {
    const { bidId } = req.params;

    console.log("=== DELETE BID REQUEST ===");
    console.log("Bid ID:", bidId);
    console.log("User ID from auth:", req.user?.id);

    if (!req.user || !req.user.id) {
      console.log("Auth failed - no user in request");
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Find bid
    const bid = await Bid.findById(bidId);
    if (!bid) {
      console.log("Bid not found:", bidId);
      return res.status(404).json({ message: "Bid not found" });
    }

    console.log("Bid found - Freelancer ID:", bid.freelancerId.toString());

    // Only freelancer who created the bid can delete it
    if (bid.freelancerId.toString() !== req.user.id) {
      console.log("Access denied - User ID mismatch");
      console.log("Expected freelancer:", bid.freelancerId.toString());
      console.log("Current user:", req.user.id);
      return res.status(403).json({ message: "Access denied - You can only delete your own bids" });
    }

    // Delete bid
    const deletedBid = await Bid.findByIdAndDelete(bidId);
    console.log("Bid deleted successfully:", deletedBid);

    res.status(200).json({ message: "Bid deleted successfully" });
  } catch (err) {
    console.error("=== DELETE ERROR ===");
    console.error("Error:", err.message);
    console.error("Stack:", err.stack);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

router.patch("/:bidId/hire", auth, async (req, res) => {
  try {
    const { bidId } = req.params;

    //  Get the bid to know which gig it belongs to
    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    // Get gig and check ownership (before atomic operation)
    const gig = await Gig.findById(bid.gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    //  Owner check
    if (gig.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }


    const updatedGig = await Gig.findOneAndUpdate(
      { 
        _id: bid.gigId,
        status: "open"  
      },
      { status: "assigned" },
      { new: true }
    );

    // If updatedGig is null, it means another request already hired for this gig
    if (!updatedGig) {
      return res.status(400).json({ 
        message: "Gig already assigned by someone else" 
      });
    }

    //  Update selected bid - hired
    bid.status = "hired";
    await bid.save();

    //  Update other bids - rejected
    await Bid.updateMany(
      { gigId: gig._id, _id: { $ne: bid._id } },
      { status: "rejected" }
    );

    //  Emit socket notification to freelancer BEFORE response
    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");


      

      const freelancerSocketId = onlineUsers.get(
        bid.freelancerId.toString()
      );

      console.log("Freelancer Socket ID:", freelancerSocketId);

      if (freelancerSocketId) {
        io.to(freelancerSocketId).emit("hired", {
          message: `You have been hired for ${gig.title}`
        });
        console.log("Notification sent to freelancer");
      } else {
        console.log(" Freelancer not online");
      }
    res.status(200).json({ 
      message: "Freelancer hired successfully",
      gig: updatedGig,
      bid
    });

  } catch (error) {
    console.error("Hire error:", error);
    res.status(500).json({ message: error.message || "Hiring failed" });
  }
});

module.exports = router;
