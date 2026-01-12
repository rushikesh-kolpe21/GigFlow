import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../../../utils";
import axios from "axios";


export const Signup = () => {

     const navigate = useNavigate();
  // Redirect away if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/menu", { replace: true });
    }
  }, [navigate]);

  const [signupInfo, setSignupInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const { firstName, lastName, email, password } = signupInfo;

  // onchange handler
  const handleChange = (event) => {
    setSignupInfo({
      ...signupInfo,
      [event.target.name]: event.target.value,
    });
  };

  // form submit handler
  const handleFormSubmitSignup = async (event) => {
    event.preventDefault();

    // Validation
    const { firstName, lastName, email, password } = signupInfo;
    if (!firstName || !lastName || !email || !password) {
      return handleError("First name, last name, email and password are required");
    }

    // If validation passes then
   try {
  const response = await axios.post(
    "http://localhost:5000/api/auth/signup",
    signupInfo
  );

  const result = response.data;
  const { user, message, success, token, jwtToken } = result;

  if (success) {
    handleSuccess(message);

    const authToken = token || jwtToken;
    if (authToken) {
      localStorage.setItem("token", authToken);
    }

    localStorage.setItem("loggedInUser", user.name);
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userId", user.id);

    // clear form ONLY on success
    setSignupInfo({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });

    setTimeout(() => {
      navigate("/menu");
    }, 1000);

    setIsAuthenticated(true);
  }
} catch (error) {
  handleError(
    error.response?.data?.message || "Signup failed"
  );
}


    console.log("Signup form submitted:", signupInfo);
  };


 return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Create Account
        </h1>
        
        {/* <GoogleLogin setIsAuthenticated={setIsAuthenticated}
         onSuccess={(res) => {
    console.log(res.credential); // ✅ ID TOKEN
  }} /> */}

        <form onSubmit={handleFormSubmitSignup} className="space-y-5 text-left">
          <div className="flex flex-col items-start">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              FirstName
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoFocus
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col items-start">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              LastName
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col items-start">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col items-start">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Sign Up
          </button>

          <p className="text-center text-sm text-gray-600 mt-3">
            Already have an account?{" "}
            {/* <Link to="/login" className="text-blue-600 font-medium hover:underline">Login</Link> */}
          </p>
        </form>

        <ToastContainer position="top-center" />
      </div>
    </div>
  );
};

