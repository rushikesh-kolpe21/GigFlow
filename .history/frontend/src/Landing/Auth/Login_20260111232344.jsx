import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleError, handleSuccess } from "../../../utils";
import axios from "axios";
// import { GoogleLogin } from "./GoogleLogin";


export const Login = ({ setIsAuthenticated = () => {} }) => {



  const [loginInfo, setloginInfo] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  // If already logged in, redirect away from login
  useEffect(() => {
    const userInfo = document.cookie.includes('userInfo');
    if (userInfo) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const copyloginInfo = { ...loginInfo };
    copyloginInfo[name] = value;
    setloginInfo(copyloginInfo);
  };
  // after submit
  const handleloginForm = async (event) => {
    event.preventDefault();

    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError("Email and password are required");
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", loginInfo, {
        withCredentials: true // Enable cookies
      });
      const result = response.data;
      console.log("Login API Response:", result);

      const { user, message, token, success } = result;

      if (success) {
        handleSuccess(message);
        // Cookies are automatically stored by the browser via Set-Cookie header
        // No need to manually store in localStorage
        setIsAuthenticated(true);
        setTimeout(() => {
          navigate("/");
        }, 600);
      } else {
        handleError(message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      const serverMsg = error?.response?.data?.message;
      handleError(serverMsg || error.message || "Login failed");
    }
  };

  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Login to Your Account
        </h1>

        {/* <GoogleLogin setIsAuthenticated={setIsAuthenticated}
         onSuccess={(res) => {
    console.log(res.credential); // ✅ ID TOKEN */}
  {/* }} /> */}

        <form onSubmit={handleloginForm} className="space-y-5 text-left">
          <div className="flex flex-col items-start">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              onChange={handleChange}
              name="email"
              value={loginInfo.email}
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col items-start">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              onChange={handleChange}
              name="password"
              value={loginInfo.password}
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>

          <p className="text-center text-sm text-gray-600 mt-3">
            Does't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Signup
            </Link>
          </p>
        </form>

        <ToastContainer position="top-center" />
      </div>
    </div>
  );
}
