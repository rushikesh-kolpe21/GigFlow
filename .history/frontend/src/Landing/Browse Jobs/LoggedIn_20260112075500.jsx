import React from "react";

export const LoggedIn = () => {
  const name = localStorage.getItem("loggedInUser") || "User";
  const email = localStorage.getItem("userEmail") || "";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-lg space-y-4">
        <h1 className="text-3xl font-bold text-center text-blue-600">Welcome, {name}</h1>
        {email && <p className="text-center text-gray-600">{email}</p>}
        <div className="flex gap-3 justify-center mt-6">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
