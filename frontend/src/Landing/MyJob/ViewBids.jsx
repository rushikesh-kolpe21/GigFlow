import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ViewBids() {
  const { gigId } = useParams();
  const [bids, setBids] = useState([]);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get( `${import.meta.env.VITE_API_URL}/api/bids/gig/${gigId}`, {
        withCredentials: true
      })
      .then((res) => setBids(res.data))
      .catch((err) => {
        alert(err.response?.data?.message || "Access denied");
      });
  }, [gigId]);

  const hireBid = async (bidId) => {
    setBusyId(bidId);
    setError("");

    try {
      await axios.patch(
         `${import.meta.env.VITE_API_URL}/api/bids/${bidId}/hire`,
        {},
        { withCredentials: true }
      );

      setBids((prev) =>
        prev.map((bid) =>
          bid._id === bidId
            ? { ...bid, status: "hired" }
            : { ...bid, status: "rejected" }
        )
      );
    } catch (err) {
      const msg = err.response?.data?.message || "Hire failed";
      setError(msg);
      alert(msg);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Job Applications
          </h2>
          <p className="text-gray-600 mt-1">
            Review bids and hire the best freelancer for this job.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {bids.length === 0 && (
          <p className="text-gray-500">No bids yet</p>
        )}

        {/* Bids Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bids.map((bid) => (
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
                flex
                flex-col
                justify-between
              "
            >
              {/* Freelancer Info */}
              <div className="mb-4">
                <p className="text-lg font-semibold text-gray-900">
                  {bid.freelancerId
                    ? (() => {
                        const firstName = bid.freelancerId.firstName || "";
                        const lastName = bid.freelancerId.lastName || "";
                        const fullName = `${firstName} ${lastName}`.trim();
                        return fullName || bid.freelancerId.email || "Unknown Freelancer";
                      })()
                    : "Unknown Freelancer"}
                </p>
                <p className="text-sm text-gray-500">
                  {bid.freelancerId?.email || "No email"}
                </p>
                {bid.freelancerId && !bid.freelancerId.firstName && (
                  <p className="text-xs text-orange-500 mt-1">
                    (Name not provided)
                  </p>
                )}
              </div>

              {/* Message */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Proposal
                </p>
                <p className="text-gray-600 text-sm">
                  {bid.message}
                </p>
              </div>

              {/* Price & Status */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Bid Amount</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ₹{bid.price}
                  </p>
                </div>

                <span
                  className={`
                    px-3 py-1 text-sm font-medium rounded-full
                    ${
                      bid.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : bid.status === "hired"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }
                  `}
                >
                  {bid.status}
                </span>
              </div>

              {/* Action */}
              <button
                onClick={() => hireBid(bid._id)}
                disabled={busyId === bid._id || bid.status === "hired"}
                className={`
                  w-full
                  py-2
                  rounded-lg
                  font-medium
                  transition
                  ${
                    bid.status === "hired"
                      ? "bg-green-600 text-white cursor-not-allowed"
                      : busyId === bid._id
                      ? "bg-blue-400 text-white cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }
                `}
              >
                {busyId === bid._id
                  ? "Hiring..."
                  : bid.status === "hired"
                  ? "Hired"
                  : "Hire"}
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default ViewBids;
