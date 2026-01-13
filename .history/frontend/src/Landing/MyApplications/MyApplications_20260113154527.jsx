import { useEffect, useState } from "react";
import axios from "axios";

function MyApplications() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBids = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bids/my", {
        withCredentials: true
      });
      setBids(res.data);
    } catch (err) {
      console.log(err);
      setBids([]);
    }
  };

  useEffect(() => {
    fetchBids();
  }, []);

  const deleteBid = async (bidId) => {
    if (!window.confirm("Are you sure you want to delete this application?")) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/bids/${bidId}`, {
        withCredentials: true
      });
      
      // Remove bid from state after successful deletion
      setBids(bids.filter(bid => bid._id !== bidId));
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting bid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            My Applications
          </h2>
          <p className="text-gray-600 mt-1">
            Track the status of jobs you’ve applied for.
          </p>
        </div>

        {bids.length === 0 && (
          <p className="text-gray-500">No applications yet</p>
        )}

        {/* Applications Grid */}
        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-6
        ">
          {bids.map(bid => (
            <div
              key={bid._id}
              className="
                bg-white
                border border-gray-200
                rounded-xl
                p-6
                shadow-sm
                hover:shadow-md
                transition
              "
            >
              {/* Job Info */}
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {bid.gigId?.title}
                </h3>
                <p className="text-sm text-gray-500">
                  Budget: ₹{bid.gigId?.budget}
                </p>
              </div>

              {/* Bid Info */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">
                  Your Bid
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  ₹{bid.price}
                </span>
              </div>

              {/* Status Button and Delete Button */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex justify-end flex-1">
                  {bid.status === "pending" && (
                    <span className="
                      px-4 py-1.5
                      text-sm font-medium
                      rounded-full
                      bg-yellow-100
                      text-yellow-700
                    ">
                      Pending
                    </span>
                  )}

                  {bid.status === "hired" && (
                    <span className="
                      px-4 py-1.5
                      text-sm font-medium
                      rounded-full
                      bg-green-100
                      text-green-700
                    ">
                      Hired
                    </span>
                  )}

                  {bid.status === "rejected" && (
                    <span className="
                      px-4 py-1.5
                      text-sm font-medium
                      rounded-full
                      bg-red-100
                      text-red-700
                    ">
                      Rejected
                    </span>
                  )}
                </div>

                {bid.status === "pending" && (
                  <button
                    onClick={() => deleteBid(bid._id)}
                    disabled={loading}
                    className="
                      px-3 py-1.5
                      text-sm font-medium
                      rounded-lg
                      bg-red-100
                      text-red-700
                      hover:bg-red-200
                      transition
                      disabled:opacity-50
                    "
                  >
                    {loading ? "..." : "Delete"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default MyApplications;
