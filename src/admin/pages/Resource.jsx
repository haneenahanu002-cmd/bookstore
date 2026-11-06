
import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faUserCircle,
  faHouse,
  faBook,
  faBriefcase,
  faScrewdriverWrench,
  faLocationDot,
  faTrash,
  faXmark,
  faMagnifyingGlass,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";

import { BooksAPI } from "../../services/allApi";

function Resource() {
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") === "books" ? "books" : "jobs"
  );

  const [search, setSearch] = useState("");
  const [bookSearch, setBookSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [allBooks, setAllBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [bookError, setBookError] = useState("");

  const username = localStorage.getItem("username") || "Username";
  const profileImage = localStorage.getItem("profileImage");

  // UPDATE TAB FROM URL
  useEffect(() => {
    const tab = searchParams.get("tab");

    if (tab === "books" || tab === "jobs" || tab === "applicants") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // FETCH ALL USER-UPLOADED BOOKS
  const getBooks = async () => {
    try {
      setLoadingBooks(true);
      setBookError("");

      const res = await BooksAPI();

      console.log("Resources Books Response:", res.data);

      const booksData = Array.isArray(res.data)
        ? res.data
        : res.data?.books || res.data?.data?.books || [];

      setAllBooks(booksData);
    } catch (error) {
      console.error("Resources Books Error:", error);

      setBookError(
        error.response?.data?.message || "Failed to load books."
      );
    } finally {
      setLoadingBooks(false);
    }
  };

  useEffect(() => {
    getBooks();
  }, []);

  // JOB DATA
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Job Title",
      location: "Location",
      jobType: "Senior Level",
      salary: "10 lakhs",
      qualification: "M-Tech / B-Tech / BCA / MCA",
      experience: "5-7",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
  ]);

  const [newJob, setNewJob] = useState({
    title: "",
    location: "",
    jobType: "",
    salary: "",
    qualification: "",
    experience: "",
    description: "",
  });

  // ADD JOB
  const handleAddJob = (e) => {
    e.preventDefault();

    setJobs((prev) => [
      ...prev,
      {
        ...newJob,
        id: Date.now(),
      },
    ]);

    setNewJob({
      title: "",
      location: "",
      jobType: "",
      salary: "",
      qualification: "",
      experience: "",
      description: "",
    });

    setShowModal(false);
  };

  // DELETE JOB
  const handleDelete = (id) => {
    setJobs((prev) => prev.filter((job) => job.id !== id));
  };

  // FILTER JOBS
  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  // FILTER BOOKS
  const filteredBooks = allBooks.filter((book) => {
    const title = String(book.title || "").toLowerCase();
    const author = String(book.author || "").toLowerCase();
    const searchValue = bookSearch.toLowerCase();

    return (
      title.includes(searchValue) ||
      author.includes(searchValue)
    );
  });

  return (
    <div className="flex min-h-screen w-full bg-white text-gray-800">

      {/* SIDEBAR */}
      <aside className="hidden w-[205px] shrink-0 bg-blue-50 px-4 py-16 md:block">
        <div className="flex flex-col items-center">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="h-[72px] w-[72px] rounded-full object-cover"
            />
          ) : (
            <FontAwesomeIcon
              icon={faUserCircle}
              className="text-[72px] text-gray-500"
            />
          )}

          <p className="mt-4 text-xs">{username}</p>
        </div>

        <nav className="mt-10 space-y-1 text-xs">
          <Link
            to="/admin-dashboard"
            className="flex items-center gap-3 rounded-md px-3 py-3 text-gray-800 hover:bg-blue-100"
          >
            <FontAwesomeIcon icon={faHouse} className="w-4" />
            Home
          </Link>

          <Link
            to="/careers?tab=books"
            className="flex items-center gap-3 rounded-md bg-blue-100 px-3 py-3 font-medium text-gray-900"
          >
            <FontAwesomeIcon icon={faBook} className="w-4" />
            All Books
          </Link>

          <Link
            to="/careers"
            className="flex items-center gap-3 rounded-md px-3 py-3 text-gray-800 hover:bg-blue-100"
          >
            <FontAwesomeIcon icon={faBriefcase} className="w-4" />
            Careers / Resources
          </Link>

          <Link
            to="/settings"
            className="flex items-center gap-3 rounded-md px-3 py-3 text-gray-800 hover:bg-blue-100"
          >
            <FontAwesomeIcon icon={faScrewdriverWrench} className="w-4" />
            Settings
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="min-w-0 flex-1 px-5 py-8 sm:px-8">
        <h1 className="mb-6 text-center text-lg font-semibold">
          Resources
        </h1>

        {/* TABS */}
        <div className="mb-7 flex justify-center">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">

            <button
              onClick={() => setActiveTab("jobs")}
              className={`border-b px-3 py-2 ${
                activeTab === "jobs"
                  ? "border-gray-700 text-gray-900"
                  : "border-transparent text-gray-500"
              }`}
            >
              Job Post
            </button>

            <button
              onClick={() => setActiveTab("applicants")}
              className={`border-b px-3 py-2 ${
                activeTab === "applicants"
                  ? "border-gray-700 text-gray-900"
                  : "border-transparent text-gray-500"
              }`}
            >
              View Applicant
            </button>

            <button
              onClick={() => setActiveTab("books")}
              className={`border-b px-3 py-2 ${
                activeTab === "books"
                  ? "border-gray-700 text-gray-900"
                  : "border-transparent text-gray-500"
              }`}
            >
              All Books ({allBooks.length})
            </button>
          </div>
        </div>

        {/* JOB TAB */}
        {activeTab === "jobs" && (
          <>
            <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex w-full max-w-[225px]"
              >
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Job Title"
                  className="h-8 min-w-0 flex-1 border border-gray-200 px-2 text-[11px] outline-none focus:border-green-600"
                />

                <button
                  type="submit"
                  className="h-8 bg-green-800 px-3 text-[11px] text-white hover:bg-green-900"
                >
                  Search
                </button>
              </form>

              <button
                onClick={() => setShowModal(true)}
                className="border border-blue-500 px-4 py-1.5 text-[11px] text-blue-600 hover:bg-blue-50"
              >
                Add Job
              </button>
            </div>

            <div className="space-y-4">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <article
                    key={job.id}
                    className="border border-gray-200 bg-white px-4 py-4 shadow-sm"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3 border-b pb-2">
                      <h2 className="text-xs font-medium">
                        {job.title}
                      </h2>

                      <button
                        onClick={() => handleDelete(job.id)}
                        className="flex items-center gap-1 rounded bg-red-600 px-2 py-1.5 text-[10px] text-white hover:bg-red-700"
                      >
                        Delete
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>

                    <div className="space-y-1.5 text-[11px] text-gray-700">
                      <p className="flex items-center gap-1">
                        <FontAwesomeIcon
                          icon={faLocationDot}
                          className="text-blue-500"
                        />
                        {job.location}
                      </p>

                      <p>Job Type: {job.jobType}</p>
                      <p>Salary: {job.salary}</p>
                      <p>Qualification: {job.qualification}</p>
                      <p>Experience: {job.experience}</p>

                      <p>
                        <b>Description:</b> {job.description}
                      </p>
                    </div>
                  </article>
                ))
              ) : (
                <p className="py-10 text-center text-sm text-gray-500">
                  No jobs found.
                </p>
              )}
            </div>
          </>
        )}

        {/* APPLICANTS TAB */}
        {activeTab === "applicants" && (
          <div className="mt-5">
            <div className="mb-8 flex w-full max-w-[212px]">
              <input
                type="text"
                placeholder="Job Title"
                className="h-8 w-full border border-gray-200 px-2 text-[10px] outline-none"
              />

              <button className="h-8 bg-green-700 px-3 text-[10px] text-white hover:bg-green-800">
                Search
              </button>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse text-[10px]">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    {[
                      "SL:NO",
                      "Job Title",
                      "Name",
                      "Qualification",
                      "Email",
                      "Phone",
                      "Cover Letter",
                      "Resume",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="border border-blue-400 px-2 py-3 font-normal"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td
                      colSpan="8"
                      className="border border-gray-200 px-2 py-8 text-center text-gray-500"
                    >
                      No applicants available.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ALL BOOKS TAB */}
        {activeTab === "books" && (
          <div className="mt-5">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">
                  All User Uploaded Books
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Total Books: {allBooks.length}
                </p>
              </div>

              <button
                onClick={getBooks}
                disabled={loadingBooks}
                className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-xs text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faRotate} />
                {loadingBooks ? "Loading..." : "Refresh"}
              </button>
            </div>

            {/* SEARCH BOOKS */}
            <div className="mb-6 flex w-full max-w-sm">
              <input
                type="search"
                value={bookSearch}
                onChange={(e) => setBookSearch(e.target.value)}
                placeholder="Search book title or author"
                className="h-10 min-w-0 flex-1 rounded-l border border-gray-300 px-3 text-xs outline-none focus:border-blue-500"
              />

              <button
                type="button"
                className="rounded-r bg-green-700 px-4 text-white"
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </div>

            {/* LOADING */}
            {loadingBooks && (
              <p className="py-10 text-center text-sm text-blue-600">
                Loading books...
              </p>
            )}

            {/* ERROR */}
            {!loadingBooks && bookError && (
              <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                {bookError}

                <button
                  onClick={getBooks}
                  className="ml-3 underline"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* BOOK GRID */}
            {!loadingBooks && !bookError && (
              <>
                {filteredBooks.length > 0 ? (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredBooks.map((book) => {
                      const isApproved =
                        book.status?.toLowerCase() === "approved";

                      return (
                        <div
                          key={book._id}
                          className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                        >
                          <div className="flex h-48 items-center justify-center bg-gray-50 p-3">
                            {book.imageUrl ? (
                              <img
                                src={book.imageUrl}
                                alt={book.title}
                                className="h-full w-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <FontAwesomeIcon
                                icon={faBook}
                                className="text-5xl text-gray-300"
                              />
                            )}
                          </div>

                          <div className="space-y-2 p-4">
                            <h3 className="line-clamp-2 text-sm font-semibold">
                              {book.title}
                            </h3>

                            <p className="text-xs text-gray-500">
                              Author: {book.author}
                            </p>

                            <p className="text-sm font-semibold text-green-700">
                              ₹{book.discountPrice ?? book.price ?? "N/A"}
                            </p>

                            <p className="break-all text-[11px] text-gray-500">
                              Uploaded by: {book.sellerEmail}
                            </p>

                            <div className="flex items-center justify-between border-t pt-3 text-[11px]">
                              <span className="text-gray-500">
                                Book Status
                              </span>

                              <span
                                className={`rounded px-2 py-1 ${
                                  isApproved
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {isApproved
                                  ? "Approved"
                                  : book.status || "Pending"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-lg border border-gray-200 py-12 text-center">
                    <FontAwesomeIcon
                      icon={faBook}
                      className="mb-3 text-4xl text-gray-300"
                    />

                    <p className="text-sm font-medium text-gray-600">
                      No books found.
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      No books are uploaded yet, or no books match your search.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* ADD JOB MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-auto w-full max-w-lg rounded-lg bg-white p-5 shadow-xl sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Add New Job
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-red-600"
                aria-label="Close modal"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <form onSubmit={handleAddJob} className="space-y-3">
              {[
                ["title", "Job Title"],
                ["location", "Location"],
                ["jobType", "Job Type"],
                ["salary", "Salary"],
                ["qualification", "Qualification"],
                ["experience", "Experience"],
              ].map(([key, label]) => (
                <input
                  key={key}
                  type="text"
                  value={newJob[key]}
                  onChange={(e) =>
                    setNewJob({
                      ...newJob,
                      [key]: e.target.value,
                    })
                  }
                  placeholder={label}
                  required
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              ))}

              <textarea
                value={newJob.description}
                onChange={(e) =>
                  setNewJob({
                    ...newJob,
                    description: e.target.value,
                  })
                }
                placeholder="Job Description"
                rows={3}
                required
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded bg-green-700 px-4 py-2 text-sm text-white hover:bg-green-800"
                >
                  Add Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Resource;
