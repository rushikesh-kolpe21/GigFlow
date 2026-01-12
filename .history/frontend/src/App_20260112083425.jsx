import React from 'react'
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Signup } from './Landing/Auth/Signup.jsx';
import { Login } from './Landing/Auth/Login.jsx';
import { LoggedIn } from './Landing/Browse Jobs/LoggedIn.jsx';
import Navbar from '../Navbar.jsx';
import { BrowseJobs } from './Landing/Browse Jobs/BrowseJobs.jsx';



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
  return token ? <Navigate to="/" replace /> : children;
};


  return (
    <div>
      <BrowserRouter>
     <Navbar/>
        <Routes>

           {/* Protected routes */}
        <Route
          path="/menu"
          element={
            <PrivateRoute>
             <BrowseJobs/>
            </PrivateRoute>
          }
        />
          <Route
            path="/register"
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

          <Route
            path="/"
            element={
              <PrivateRoute>
                <LoggedIn />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
