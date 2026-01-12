import React from 'react'
import { useState } from 'react';
import { BrowserRouter, Routes, Route,Navigate  } from "react-router-dom";
import { Signup } from './Landing/Auth/Signup.jsx';
import { Login } from './Landing/Auth/Login.jsx';


export const App = () => {

   // Authentication state (example)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token'); // Check for token in localStorage on initial load hey ki nahi
  });

  // Private Route component for protected routes only for authenticated users
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

// public route component for login and signup pages
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/home" replace /> : children;
};


  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup setIsAuthenticated={setIsAuthenticated} />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login setIsAuthenticated={setIsAuthenticated} />
            </PublicRoute>
          }
        />
          
        </Routes>
      </BrowserRouter>
    </div>
  )
}
