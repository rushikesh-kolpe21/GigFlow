import React, { useState, useEffect } from 'react';
// import logo from "../../src/assets/logo.png";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Browse Jobs", path: "/gigs" },
    { label: "Post Job (Gig)", path: "/post-job" },
    { label: "My Jobs", path: "/my-jobs" },
    { label: "My Applications", path: "/my-applications" },
  ];

  const getLinkClass = (path) =>
    `text-black hover:text-gray-500 hover:underline hover:decoration-2 hover:underline-offset-2 hover:decoration-green-300 transition-all duration-400 ${
      location.pathname === path ? "text-black-900 underline decoration-green-300" : ""
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-[rgba(144,238,144,0.5)] shadow-md">
      <div className="flex items-center px-4 py-0 md:px-21 relative">
        {/* logo on left */}
        <div className="z-20">
          {/* <Link to="/" className="flex gap-3 items-center font-semibold text-7xl">
           
            <span className="hidden sm:inline">GigFlow</span>
          </Link> */}
        </div>

        {/* nav items centered on desktop */}
        <div className="hidden md:flex flex-1 justify-center z-10">
          <ul className="flex gap-9 text-lg font-medium">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} className={getLinkClass(item.path)}>
                {item.label}
              </Link>
            ))}
          </ul>
        </div>

        {/* download button */}
        <div className="hidden md:block z-20">
          {/* <button className="bg-[#32CD32] text-white px-3 py-1.5 rounded-lg hover:bg-[#28a745] text-xl">
            Download App
          </button> */}
        </div>

        {/* mobile menu toggle */}
        <div className="md:hidden absolute right-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md focus:outline-none focus:ring"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* mobile dropdown menu */}
      {isOpen && (
        <div className="md:hidden bg-[rgba(144,238,144,0.5)] px-4 pb-4 animate-slide-down">
          <ul className="flex flex-col gap-4 text-lg font-medium">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} className="block text-black ">
                {item.label}
              </Link>
            ))}
            {/* <button className="bg-[#32CD32] text-white px-3 py-1.5 rounded-lg hover:bg-[#28a745] text-xl w-full">
              Download App
            </button> */}
          </ul>
        </div>
      )}
    </nav>
  );
}