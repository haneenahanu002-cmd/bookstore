
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faBook,
  faBriefcase,
  faScrewdriverWrench,
  faHouse,
  faPen,
} from "@fortawesome/free-solid-svg-icons";

function Settings() {
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imageUrl, setImageUrl] = useState(
    localStorage.getItem("profileImage") || ""
  );

  const handleReset = () => {
    setUsername(localStorage.getItem("username") || "");
    setImageUrl(localStorage.getItem("profileImage") || "");
    setPassword("");
    setConfirmPassword("");
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    localStorage.setItem("username", username);
    localStorage.setItem("profileImage", imageUrl);

    alert("Settings updated successfully!");

    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="flex min-h-screen w-full bg-white text-gray-800">

      {/* SIDEBAR */}
      <aside className="hidden w-[230px] shrink-0 bg-blue-50 px-5 py-8 md:block">
        <div className="flex flex-col items-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Profile"
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <FontAwesomeIcon
              icon={faUserCircle}
              className="text-[80px] text-gray-500"
            />
          )}

          <p className="mt-4 max-w-full break-words text-sm">
            {username || "Username"}
          </p>
        </div>

        <nav className="mt-8 space-y-2 text-sm">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-md px-3 py-3 text-gray-700 no-underline hover:bg-blue-100"
          >
            <FontAwesomeIcon icon={faHouse} className="w-4 text-blue-600" />
            Home
          </Link>

          <Link
            to="/allbooks"
            className="flex items-center gap-3 rounded-md px-3 py-3 text-gray-700 no-underline hover:bg-blue-100"
          >
            <FontAwesomeIcon icon={faBook} className="w-4 text-blue-600" />
            All Books
          </Link>

          <Link
            to="/careers"
            className="flex items-center gap-3 rounded-md px-3 py-3 text-gray-700 no-underline hover:bg-blue-100"
          >
            <FontAwesomeIcon icon={faBriefcase} className="w-4 text-blue-600" />
            Careers
          </Link>

          <Link
            to="/settings"
            className="flex items-center gap-3 rounded-md bg-blue-100 px-3 py-3 font-medium text-blue-700 no-underline"
          >
            <FontAwesomeIcon
              icon={faScrewdriverWrench}
              className="w-4"
            />
            Settings
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10">

        {/* PAGE HEADING */}
        <h1 className="mb-8 text-center text-3xl font-semibold tracking-tight sm:text-4xl">
          Settings
        </h1>

        {/* CONTENT GRID */}
        <div className="mx-auto grid max-w-[1250px] grid-cols-1 items-start gap-8 xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-12">

          {/* INFORMATION */}
          <section className="space-y-6 text-sm leading-6 text-gray-600 sm:text-base">
            <p>
              Manage your account details and personal information
              from this settings page. Keep your profile information
              up to date so that your account reflects your latest details.
            </p>

            <p>
              You can update your username and profile image whenever
              you need to. If you choose to change your password,
              enter your new password and confirm it before updating
              your settings. Make sure both password fields match.
            </p>
          </section>

          {/* SETTINGS CARD */}
          <section className="mx-auto w-full max-w-[400px] rounded-xl border border-blue-100 bg-blue-100 p-5 sm:p-6">

            <form onSubmit={handleUpdate} className="space-y-5">

              {/* PROFILE IMAGE */}
              <div className="flex flex-col items-center gap-3 pb-2">

                <div className="relative">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Profile preview"
                      className="h-20 w-20 rounded-full border-2 border-white bg-white object-cover"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faUserCircle}
                      className="text-[80px] text-gray-500"
                    />
                  )}

                  <label
                    htmlFor="profileImage"
                    className="absolute bottom-0 right-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm bg-yellow-400 text-xs text-gray-800"
                    title="Edit profile image URL"
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </label>
                </div>

                <input
                  id="profileImage"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Profile image URL"
                  className="block h-10 w-full min-w-0 rounded-md border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* USERNAME */}
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Username
                </label>

                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  className="block h-11 w-full min-w-0 rounded-md border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* NEW PASSWORD */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="block h-11 w-full min-w-0 rounded-md border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="block h-11 w-full min-w-0 rounded-md border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* ACTION BUTTONS */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="h-11 rounded-md bg-amber-400 px-3 text-sm font-semibold text-white transition hover:bg-amber-500"
                >
                  Reset
                </button>

                <button
                  type="submit"
                  className="h-11 rounded-md bg-green-700 px-3 text-sm font-semibold text-white transition hover:bg-green-800"
                >
                  Update
                </button>
              </div>

            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Settings;