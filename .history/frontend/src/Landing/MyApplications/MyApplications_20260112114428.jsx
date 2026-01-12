import { useEffect, useState } from "react";
import axios from "axios";

function MyApplications() {
  const [bids, setBids] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/bids/my", {
      withCredentials: true
    })
    .then(res => setBids(res.data))
    .catch(() => setBids([]));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Applications</h2>

      {bids.length === 0 && <p>No applications yet</p>}

      {bids.map(bid => (
        <div
          key={bid._id}
          style={{ border: "1px solid #ccc", marginBottom: "10px", padding: "10px" }}
        >
          <h3>{bid.gigId?.title}</h3>
          <p><b>Budget:</b> ₹{bid.gigId?.budget}</p>
          <p><b>Your Price:</b> ₹{bid.price}</p>
          <p><b>Status:</b> {bid.status}</p>
        </div>
      ))}
    </div>
  );
}

export default MyApplications;
