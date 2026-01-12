import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ViewBids() {
  const { gigId } = useParams();
  const [bids, setBids] = useState([]);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/bids/gig/${gigId}`, {
        withCredentials: true
      })
      .then((res) => setBids(res.data))
      .catch((err) => {
        alert(err.response?.data?.message || "Access denied");
      });
  }, [gigId]);

  const hireBid = async (bidId) => {
    setBusyId(bidId);
    setError("");

    try {
      await axios.patch(
        `http://localhost:5000/api/bids/${bidId}/hire`,
        {},
        { withCredentials: true }
      );

      // Update local state to reflect server change
      setBids((prev) =>
        prev.map((bid) =>
          bid._id === bidId
            ? { ...bid, status: "hired" }
            : { ...bid, status: "rejected" }
        )
      );
    } catch (err) {
      const msg = err.response?.data?.message || "Hire failed";
      setError(msg);
      alert(msg);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Job Applications</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {bids.length === 0 && <p>No bids yet</p>}

      {bids.map((bid) => (
        <div
          key={bid._id}
          style={{ border: "1px solid #ccc", marginBottom: "10px", padding: "10px" }}
        >
          <p>
            <b>Name:</b> {bid.freelancerId ? `${bid.freelancerId.firstName || ""} ${bid.freelancerId.lastName || ""}`.trim() : "Unknown"}
          </p>
          <p>
            <b>Email:</b> {bid.freelancerId?.email}
          </p>
          <p>
            <b>Message:</b> {bid.message}
          </p>
          <p>
            <b>Price:</b> ₹{bid.price}
          </p>
          <p>
            <b>Status:</b> {bid.status}
          </p>

          <button
            onClick={() => hireBid(bid._id)}
            disabled={busyId === bid._id || bid.status === "hired"}
          >
            {busyId === bid._id ? "Hiring..." : bid.status === "hired" ? "Hired" : "Hire"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default ViewBids;
