import axios from "axios";
import { useState } from "react";

export const PostJob = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: ""
  });

  const submitHandler = async (e) => {
    e.preventDefault();

    await axios.post(
      "http://localhost:5000/api/gigs",
      form,
      { withCredentials: true } // IMPORTANT
    );

    alert("Job posted successfully");
  };

  return (
    <form onSubmit={submitHandler}>
      <input
        placeholder="Title"
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <textarea
        placeholder="Description"
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <input
        type="number"
        placeholder="Budget"
        onChange={(e) => setForm({ ...form, budget: e.target.value })}
      />
      <button type="submit">Post Job</button>
    </form>
  );
}


