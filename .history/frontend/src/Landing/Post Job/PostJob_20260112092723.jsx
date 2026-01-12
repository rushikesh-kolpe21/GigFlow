import { useState } from "react";
import axios from "axios";

function PostJob() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post("http://localhost:5000/api/gigs", form);
      setMessage(" Job posted successfully");

      // clear form
      setForm({ title: "", description: "", budget: "" });
    } catch (error) {
      console.log(error);
      setMessage(" Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px" }}>
      <h2>Post a Job</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Job Title"
          value={form.title}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <textarea
          name="description"
          placeholder="Job Description"
          value={form.description}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <input
          name="budget"
          type="number"
          placeholder="Budget"
          value={form.budget}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default PostJob;
