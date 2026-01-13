import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function ApplyBid() {
  const { gigId } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [price, setPrice] = useState("");
  const [msg, setMsg] = useState("");

  const submitBid = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/bids",
        { gigId, message, price },
        { withCredentials: true }
      );

      setMsg("Bid submitted successfully");
      setMessage("");
      setPrice("");
      
      // Navigate to browse jobs after 1.5 seconds
      setTimeout(() => {
        navigate("/gigs");
      }, 1500);
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-6">

        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Apply for Job
        </h2>
        <p className="text-gray-600 mb-6">
          Submit your proposal and pricing to apply for this project.
        </p>

        {/* Form */}
        <form onSubmit={submitBid} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proposal Message
            </label>
            <textarea
              placeholder="Describe your experience and how you will complete this job"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="
                w-full
                px-4 py-2
                border border-gray-300
                rounded-lg
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                resize-none
              "
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Price (₹)
            </label>
            <input
              type="number"
              placeholder="Enter your bid amount"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="
                w-full
                px-4 py-2
                border border-gray-300
                rounded-lg
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />
          </div>

          <button
            type="submit"
            className="
              w-full
              bg-blue-600
              text-white
              py-2
              rounded-lg
              font-medium
              hover:bg-blue-700
              transition
            "
          >
            Submit Bid
          </button>
        </form>

        {/* Message */}
        {msg && (
          <p className="mt-4 text-sm text-center text-gray-700">
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}

export default ApplyBid;
