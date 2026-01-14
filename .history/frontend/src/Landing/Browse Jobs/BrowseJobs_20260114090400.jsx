import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export const BrowseJobs = () => {
  const [gigs, setGigs] = useState([]);
  const [search, setSearch] = useState("");
  const [myBids, setMyBids] = useState([]);
  const navigate = useNavigate();

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    const query = search ? `?search=${search}` : "";
    api
      .get(`/api/gigs${query}`)
      .then((res) => setGigs(res.data))
      .catch((err) => console.log(err));
  }, [search]);

  // Fetch user's bids to check which gigs they've already applied to
  useEffect(() => {
    if (currentUser) {
      api
        .get('/api/bids/my')
        .then((res) => setMyBids(res.data))
        .catch((err) => console.log(err));
    }
  }, []);

  // Check if user has already applied to a gig
  const hasApplied = (gigId) => {
    return myBids.some((bid) => bid.gigId?._id === gigId);
  };

  // Check if user owns the gig
  const isOwner = (gig) => {
    if (!currentUser || !currentUser.id) return false;
    // Convert both to string for comparison (gig.ownerId might be ObjectId)
    const ownerId = gig.ownerId?.toString() || gig.ownerId;
    const userId = currentUser.id?.toString() || currentUser.id;
    
    console.log('Ownership check:', {
      gigId: gig._id,
      gigTitle: gig.title,
      ownerId: ownerId,
      userId: userId,
      isOwner: ownerId === userId
    });
    
    return ownerId === userId;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex flex-col gap-4 mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Browse Jobs
          </h2>
          <p className="text-gray-600">
            Find projects that match your skills and start working today.
          </p>

          {/* Search */}
          <input
            type="text"
            placeholder="Search jobs by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full max-w-md
              px-4 py-2
              border border-gray-300
              rounded-lg
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />
        </div>

        {gigs.length === 0 && (
          <p className="text-gray-500">No jobs available</p>
        )}

        {/* Jobs Grid */}
        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          gap-6
        ">
          {gigs.map((gig) => (
            <div
              key={gig._id}
              className="
                bg-white
                border border-gray-200
                rounded-xl
                p-6
                flex flex-col
                justify-between
                hover:shadow-lg
                transition
              "
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {gig.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {gig.description}
                </p>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">
                    Budget
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    ₹{gig.budget}
                  </span>
                </div>

                <div className="flex gap-2">
                  {isOwner(gig) ? (
                    <button
                      onClick={() => navigate(`/gigs/${gig._id}/bids`)}
                      className="
                        flex-1
                        bg-gray-100
                        text-gray-800
                        py-2
                        rounded-lg
                        font-medium
                        hover:bg-gray-200
                        transition
                      "
                    >
                      View Applications
                    </button>
                  ) : currentUser && hasApplied(gig._id) ? (
                    <button
                      onClick={() => navigate("/my-applications")}
                      className="
                        flex-1
                        bg-green-600
                        text-white
                        py-2
                        rounded-lg
                        font-medium
                        hover:bg-green-700
                        transition
                      "
                    >
                      Check Status
                    </button>
                  ) : currentUser ? (
                    <button
                      onClick={() => navigate(`/apply/${gig._id}`)}
                      className="
                        flex-1
                        bg-blue-600
                        text-white
                        py-2
                        rounded-lg
                        font-medium
                        hover:bg-blue-700
                        transition
                      "
                    >
                      Apply
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate("/login")}
                      className="
                        flex-1
                        bg-blue-600
                        text-white
                        py-2
                        rounded-lg
                        font-medium
                        hover:bg-blue-700
                        transition
                      "
                    >
                      Login to Apply
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
