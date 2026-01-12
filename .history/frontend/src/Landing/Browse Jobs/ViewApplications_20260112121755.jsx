import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function ViewApplications() {
  const { gigId } = useParams();
  const [bids, setBids] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(`http://localhost:5000/api/bids/gig/${gigId}`,
            
          { withCredentials: true }
        );
        setBids(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    }
    load();
  }, [gigId]);

  if (error) {
    return <div style={{ padding: 20 }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Applications for this Job</h2>
      {bids.length === 0 && <p>No applications yet.</p>}
      {bids.map((b) => (
        <div key={b._id} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 10 }}>
          <p><b>Message:</b> {b.message}</p>
          <p><b>Price:</b> ₹{b.price}</p>
          {b.freelancerId && (
            <p><b>Freelancer:</b> {b.freelancerId.firstName} {b.freelancerId.lastName} ({b.freelancerId.email})</p>
          )}
        </div>
      ))}
    </div>
  );
}
