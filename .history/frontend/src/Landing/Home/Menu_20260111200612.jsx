import React from "react";
import { Link } from "react-router-dom";

export const Menu = () => {
  const name = localStorage.getItem("loggedInUser") || "User";
  const email = localStorage.getItem("userEmail") || "";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-lg space-y-4">
        <h1 className="text-3xl font-bold text-center text-blue-600">Welcome, {name}</h1>
        {email && <p className="text-center text-gray-600">{email}</p>}
        <div className="flex gap-3 justify-center mt-6">
          <Link
            to="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={() => localStorage.clear()}
          >
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
};
