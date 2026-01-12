import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ViewBids() {
  const { gigId } = useParams();
  const [bids, setBids] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/bids/gig/${gigId}`, {
      withCredentials: true
    })
    .then(res => setBids(res.data))
    .catch(err => {
      alert(err.response?.data?.message || "Access denied");
    });
  }, [gigId]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Job Applications</h2>

      {bids.length === 0 && <p>No bids yet</p>}

      {bids.map(bid => (
        <div key={bid._id} style={{ border: "1px solid #ccc", marginBottom: "10px", padding: "10px" }}>
          <p><b>Name:</b> {bid.freelancerId ? `${bid.freelancerId.firstName || ''} ${bid.freelancerId.lastName || ''}`.trim() : 'Unknown'}</p>
          <p><b>Email:</b> {bid.freelancerId?.email}</p>
          <p><b>Message:</b> {bid.message}</p>
          <p><b>Price:</b> ₹{bid.price}</p>
          <p><b>Status:</b> {bid.status}</p>

          {/* Hire button yahin aayega */}
          <button onClick={() => hireFreelancer(bid._id)}>
  Hire
</button>

        </div>
      ))}
    </div>
  );
}

export default ViewBids;
