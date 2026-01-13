import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    async function loadMyJobs() {
      try {
        setLoading(true);
        // Fetch user's posted jobs from backend
        const res = await axios.get("http://localhost:5000/api/gigs/my-jobs", {
          withCredentials: true
        });
        setJobs(res.data);
      } catch (err) {
        setError(err.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    }

    if (currentUser?.id) {
      loadMyJobs();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (error) return <div style={{ padding: 20 }}>Error: {error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Posted Jobs</h2>

      {jobs.length === 0 && <p>You haven't posted any jobs yet. <a href="/post-job">Post one now</a></p>}

      {jobs.map((job) => (
        <div
          key={job._id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "5px"
          }}
        >
          <h3>{job.title}</h3>
          <p>{job.description}</p>
          <p><b>Budget:</b> ₹{job.budget}</p>
          <p><b>Status:</b> {job.status}</p>

          <button
            style={{
              marginRight: "10px",
              padding: "8px 15px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
            onClick={() => navigate(`/gigs/${job._id}/bids`)}
          >
            View Applications
          </button>

          <button
            style={{
              padding: "8px 15px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
            onClick={() => navigate(`/edit-job/${job._id}`)}
          >
            Edit
          </button>
        </div>
      ))}
    </div>
  );
}
