import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ApplyBid() {
  const { gigId } = useParams();

  const [message, setMessage] = useState("");
  const [price, setPrice] = useState("");
  const [msg, setMsg] = useState("");

  const submitBid = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/bids",
        { gigId, message, price },
        { withCredentials: true } // 🔥 cookie send hogi
      );

      setMsg("✅ Bid submitted successfully");
      setMessage("");
      setPrice("");
    } catch (err) {
      setMsg(err.response?.data?.message || "❌ Error");
    }
  };

  return (
    <div>
      <h2>Apply for Job</h2>

      <form onSubmit={submitBid}>
        <textarea
          placeholder="Your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Your price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <button type="submit">Submit Bid</button>
      </form>

      {msg && <p>{msg}</p>}
    </div>
  );
}

export default ApplyBid;
