import { useState } from "react";
import api from "../../api/axios";

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
      await api.post(
        '/api/gigs',
        form
      );

      setMessage("Job posted successfully");
      setForm({ title: "", description: "", budget: "" });
    } catch (error) {
      setMessage("Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white border border-gray-200 rounded-2xl shadow-sm p-8">

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Post a Job
          </h2>
          <p className="text-gray-600 mt-1">
            Create a new job and start receiving applications from freelancers.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title
            </label>
            <input
              name="title"
              placeholder="e.g. Build a React website"
              value={form.title}
              onChange={handleChange}
              required
              className="
                w-full
                px-4 py-2.5
                border border-gray-300
                rounded-xl
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description
            </label>
            <textarea
              name="description"
              placeholder="Describe the work, requirements, and expected outcome"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              className="
                w-full
                px-4 py-2.5
                border border-gray-300
                rounded-xl
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                resize-none
              "
            />
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget (₹)
            </label>
            <input
              name="budget"
              type="number"
              placeholder="Enter your budget"
              value={form.budget}
              onChange={handleChange}
              required
              className="
                w-full
                px-4 py-2.5
                border border-gray-300
                rounded-xl
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`
              w-full
              py-3
              rounded-xl
              font-semibold
              text-white
              transition
              ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }
            `}
          >
            {loading ? "Posting..." : "Post Job"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default PostJob;
