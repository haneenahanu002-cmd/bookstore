
import React, { useState, useEffect, useContext
  
 } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faInstagram,
  faTwitter,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";

import {
  faUser,
  faUserCircle,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

import axiosInstance from "../../api/axiosinstance";
import { Link, useNavigate } from "react-router-dom";
import { routerContext } from "../../context/RouterGuardContext.jsx"; 


function Userheader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDp, setUserDp] = useState("");
  const [imgError, setImgError] = useState(false);
  const { setAuthorizedUser } = useContext(routerContext);

  const DEFAULT_PROFILE_IMAGE =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const navigate = useNavigate();

  // Check login status and load profile image
  useEffect(() => {
    const checkLoginStatus = () => {
      const userStr = sessionStorage.getItem("user");
      const token = sessionStorage.getItem("token");

      if (userStr && token) {
        try {
          const user = JSON.parse(userStr);

          console.log("User profile data:", user);

          setIsLoggedIn(true);

          setUserDp(
            user.profileImage ||
              user.picture ||
              user.photoURL ||
              user.image ||
              ""
          );

          setImgError(false);
        } catch (error) {
          console.error("Error reading user data:", error);
          setIsLoggedIn(false);
          setUserDp("");
          setImgError(false);
        }
      } else {
        setIsLoggedIn(false);
        setUserDp("");
        setImgError(false);
      }
    };

    checkLoginStatus();

    window.addEventListener("loginStatusChanged", checkLoginStatus);
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("loginStatusChanged", checkLoginStatus);
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const handleUserClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      setMenuOpen((previous) => !previous);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
 setAuthorizedUser(false);
    setIsLoggedIn(false);
    setUserDp("");
    setImgError(false);
    setMenuOpen(false);

    window.dispatchEvent(new Event("loginStatusChanged"));

    navigate("/login");
  };

  // Handle Google URLs and uploaded image filenames
  const getProfileImage = () => {
    if (!userDp || imgError) {
      return DEFAULT_PROFILE_IMAGE;
    }

    // Google or another complete image URL
    if (
      userDp.startsWith("https://") ||
      userDp.startsWith("http://") ||
      userDp.startsWith("data:")
    ) {
      return userDp;
    }

    // Uploaded image filename or relative image path
    const baseURL = axiosInstance.defaults.baseURL.replace(/\/+$/, "");
    const imagePath = userDp.replace(/^\/+/, "");

    if (imagePath.startsWith("uploads/")) {
      return `${baseURL}/${imagePath}`;
    }

    return `${baseURL}/uploads/${imagePath}`;
  };

  return (
    <header className="flex w-full items-center justify-between px-3 py-2 sm:px-5 md:px-8">
      {/* LOGO */}
      <Link to="/" className="flex min-w-0 items-center">
        <img
          src="https://png.pngtree.com/png-clipart/20230922/original/pngtree-book-logo-template-design-study-shape-vector-png-image_12526904.png"
          className="h-auto w-12 sm:w-14 md:w-[70px]"
          alt="Book Store Logo"
        />

        <h1 className="ml-2 whitespace-nowrap text-lg font-bold sm:ml-3 sm:text-xl md:text-3xl">
          BOOK STORE
        </h1>
      </Link>

      {/* SOCIAL ICONS + USER MENU */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3 md:gap-4">
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
        >
          <FontAwesomeIcon
            icon={faInstagram}
            className="text-lg sm:text-xl md:text-2xl"
          />
        </a>

        <a
          href="https://twitter.com/"
          target="_blank"
          rel="noreferrer"
          aria-label="Twitter"
        >
          <FontAwesomeIcon
            icon={faTwitter}
            className="text-lg sm:text-xl md:text-2xl"
          />
        </a>

        <a
          href="https://www.facebook.com/"
          target="_blank"
          rel="noreferrer"
          aria-label="Facebook"
        >
          <FontAwesomeIcon
            icon={faFacebook}
            className="text-lg sm:text-xl md:text-2xl"
          />
        </a>

        {/* USER ICON */}
        <div className="relative ml-1 sm:ml-2">
          <button
            type="button"
            onClick={handleUserClick}
            className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full text-white sm:h-9 sm:w-9"
            aria-label="User menu"
          >
            <img
              src={
                isLoggedIn
                  ? getProfileImage()
                  : DEFAULT_PROFILE_IMAGE
              }
              alt="User Profile"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="h-full w-full rounded-full object-cover"
            />
          </button>

          {/* DROPDOWN */}
          {isLoggedIn && menuOpen && (
            <div className="absolute right-0 top-11 z-50 w-44 rounded-md border border-gray-200 bg-white py-2 shadow-lg">
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FontAwesomeIcon icon={faUserCircle} />
                My Profile
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Userheader;
