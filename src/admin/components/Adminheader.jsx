import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faUser,
  faUserCircle,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

import { Link, useNavigate } from "react-router-dom";
import { routerContext } from "../../context/RouterGuardContext.jsx";

function Adminheader() {
  const { setAuthorizedUser } = useContext(routerContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const navigate = useNavigate();

  useEffect(() => {
    const updateLoginStatus = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };

    window.addEventListener("loginStatusChanged", updateLoginStatus);
    window.addEventListener("storage", updateLoginStatus);

    return () => {
      window.removeEventListener("loginStatusChanged", updateLoginStatus);
      window.removeEventListener("storage", updateLoginStatus);
    };
  }, []);

  const handleUserClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      setMenuOpen((prev) => !prev);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    setIsLoggedIn(false);
    setMenuOpen(false);
    setAuthorizedUser(false);
    navigate("/login");
  };

  return (
    <header className="w-full bg-white shadow-sm">
      {/* Main Header */}
      <div className="flex w-full items-center justify-between px-5 py-3 sm:px-8 md:px-12">
        <Link
          to="/"
          className="flex items-center no-underline"
          style={{ textDecoration: "none" }}
        >
          <img
            src="https://png.pngtree.com/png-clipart/20230922/original/pngtree-book-logo-template-design-study-shape-vector-png-image_12526904.png"
            alt="Book Store Logo"
            className="h-12 w-12 object-contain sm:h-14 sm:w-14"
          />

          <h1 className="ml-3 whitespace-nowrap text-xl font-extrabold tracking-wide text-black no-underline sm:text-2xl md:text-3xl">
            BOOK STORE
          </h1>
        </Link>

        {/* Login / Account */}
        <div className="relative">
          <button
            onClick={handleUserClick}
            className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800 sm:px-5 sm:text-base"
          >
            <FontAwesomeIcon icon={faUser} />
            <span>{isLoggedIn ? "Account" : "Login"}</span>
          </button>

          {isLoggedIn && menuOpen && (
            <div className="absolute right-0 top-12 z-50 w-48 rounded-md border border-gray-200 bg-white py-2 shadow-lg">
              <Link
                to="/admin-dashboard"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-800 no-underline hover:bg-gray-100"
              >
                <FontAwesomeIcon icon={faUserCircle} />
                Admin Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-800 hover:bg-gray-100"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Marquee */}
      <div className="flex h-10 items-center overflow-hidden bg-black text-white">
        <div className="animate-marquee whitespace-nowrap text-sm font-medium">
          📚 Welcome to BOOK STORE!
          &nbsp;&nbsp;&nbsp;&nbsp; ✨ Discover Your Next Favourite Book!
          &nbsp;&nbsp;&nbsp;&nbsp; 📖 Explore Our Latest Collections!
          &nbsp;&nbsp;&nbsp;&nbsp; 🛍️ Find Books You Love!
        </div>
      </div>
    </header>
  );
}

export default Adminheader;

