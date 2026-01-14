import React from 'react'
import { useGoogleLogin } from '@react-oauth/google';
import { handleSuccess, handleError } from '../../../utils';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const GoogleLogin = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const responseGoogle = async (authResult) => {
    try {
      console.log('Google Auth Result:', authResult);

      if (authResult.error) {
        handleError("Google login cancelled or failed");
        return;
      }

      const idToken = authResult.credential;
      const accessToken = authResult.access_token;

      if (!idToken && !accessToken) {
        handleError("No credential received from Google");
        return;
      }

      console.log("Sending token to backend...");
      
      //  Send token to backend (prefer idToken, fallback to accessToken)
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
        idToken,
        accessToken,
      }, { withCredentials: true });  //  CRITICAL: Allow cookies to be set!

      console.log('Backend Response:', response.data);

      const { success, token, user, message } = response.data;

      if (success && token) {
        // 🔹 Store user data in localStorage (token is in HTTP-Only cookie)
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        handleSuccess(message || "Google login successful!");
        setIsAuthenticated(true);

        // 🔹 Redirect to gigs after brief delay
        setTimeout(() => {
          navigate("/gigs");
        }, 600);
      } else {
        handleError(message || "Google login failed");
      }

    } catch (error) {
      const errorMsg = error?.response?.data?.message || error.message || "Google login failed";
      const errorDetails = error?.response?.data?.error;
      console.error(" Google login error:", error.message);
      console.error("Backend error details:", errorDetails);
      handleError(errorMsg);
    }
  };

  // Initialize Google Login hook
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: 'implicit'
  });

 return (
  <button
    onClick={handleGoogleLogin}
    type="button"
    className="
      w-full
      py-2.5
      mb-4
      bg-white
      border border-gray-300
      rounded-xl
      hover:bg-gray-50
      transition
      flex
      items-center
      justify-center
      gap-3
      text-gray-700
      font-medium
    "
  >
    {/* Google Logo */}
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>

    <span>Continue with Google</span>
  </button>
);

};
