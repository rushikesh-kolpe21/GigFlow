import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const BrowseJobs = () => {
  const [gigs, setGigs] = useState([]);
  const navigate = useNavigate();
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/gigs")
      .then((res) => setGigs(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Browse Jobs</h2>

      {gigs.length === 0 && <p>No jobs available</p>}

      {gigs.map((gig) => (
        <div
          key={gig._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px"
          }}
        >
          <h3>{gig.title}</h3>
          <p>{gig.description}</p>
          <p><b>Budget:</b> ₹{gig.budget}</p>

          <button onClick={() => navigate(`/apply/${gig._id}`)}>
            Apply
          </button>

          {currentUser && gig.ownerId === currentUser.id && (
            <button style={{ marginLeft: 8 }} onClick={() => navigate(`/gigs/${gig._id}/bids`)}>
              View Applications
            </button>
          )}

        </div>
      ))}
    </div>
  );
}


