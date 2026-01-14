import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useParams } from "react-router-dom";

export default function ViewApplications() {
  const { gigId } = useParams();
  const [bids, setBids] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/api/bids/gig/${gigId}`);
        setBids(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    }
    load();
  }, [gigId]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white border border-red-200 text-red-600 px-6 py-4 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Applications for this Job
          </h2>
          <p className="text-gray-600 mt-1">
            Review proposals submitted by freelancers.
          </p>
        </div>

        {bids.length === 0 && (
          <p className="text-gray-500">No applications yet.</p>
        )}

        {/* Applications Grid */}
        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-6
        ">
          {bids.map((b) => (
            <div
              key={b._id}
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
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Proposal
                </h3>
                <p className="text-gray-600 text-sm">
                  {b.message}
                </p>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Bid Amount</span>
                <span className="text-lg font-semibold text-gray-900">
                  ₹{b.price}
                </span>
              </div>

              {b.freelancerId && (
                <div className="border-t pt-4 text-sm text-gray-700">
                  <p className="font-medium text-gray-900">
                    {b.freelancerId.firstName} {b.freelancerId.lastName}
                  </p>
                  <p className="text-gray-500">
                    {b.freelancerId.email}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
