import axios from "axios";
import { useEffect, useState } from "react";

export const BrowseJobs = () => {
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/gigs")
      .then(res => setGigs(res.data));
  }, []);

  return (
    <div>
      <h2>Browse Jobs</h2>

      {gigs.map(gig => (
        <div key={gig._id}>
          <h3>{gig.title}</h3>
          <p>{gig.description}</p>
          <p>Budget: ₹{gig.budget}</p>

          <button>Apply</button>
        </div>
      ))}
    </div>
  );
}


