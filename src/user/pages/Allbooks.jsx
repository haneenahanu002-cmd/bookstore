
import React, { useEffect, useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faArrowRight,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

import Header from "../../user/components/Userheader";
import { useNavigate } from "react-router-dom";
import { getAllBooksAPI } from "../../services/allApi";
import { searchContext } from "../../context/SearchContext";

function AllBook() {
  // Shared search value from Home page
  const { searchKey, setSearchKey } = useContext(searchContext);

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  // Fetch books from backend API
  const fetchBooks = async () => {
    if (!sessionStorage.getItem("token")) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getAllBooksAPI();

      console.log("All books response:", response.data);

      if (response.status === 200) {
        const bookData = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.books)
          ? response.data.books
          : [];

        setBooks(bookData);
      } else {
        setError("Unable to load books.");
      }
    } catch (err) {
      console.error(
        "Fetch books error:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
          "Books load cheyyan pattiyilla. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Get unique categories
  useEffect(() => {
    const categories = [
      ...new Set(
        books
          .map((book) => book.category?.trim())
          .filter(Boolean)
      ),
    ];

    setCategoryList(categories);
  }, [books]);

  // Filter books using Home page search value and category
  const filteredBooks = books.filter((book) => {
    const searchText = (searchKey || "").trim().toLowerCase();

    const title = (book.title || "").toLowerCase();
    const author = (book.author || "").toLowerCase();

    const matchesSearch =
      title.includes(searchText) ||
      author.includes(searchText);

    const matchesCategory =
      selectedCategory === "All" ||
      (book.category || "").trim() === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Open book details
  const openBookDetails = (bookId) => {
    if (bookId) {
      navigate(`/view-book/${bookId}`);
    }
  };

  // Login required
  if (!token) {
    return (
      <>
        <Header />

        <div className="flex min-h-[80vh] flex-col items-center justify-center bg-white px-4 text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/8631/8631492.png"
            alt="Please Login"
            className="mb-5 h-36 w-36 object-contain"
          />

          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Please Login
          </h2>

          <p className="mb-5 text-sm text-gray-600">
            Please login to view all books.
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 rounded-md bg-[#3155e7] px-8 py-3 text-white hover:bg-[#2444c7]"
          >
            <FontAwesomeIcon icon={faUser} />
            Login
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-white text-black">
        <main className="mx-auto max-w-[1100px] px-4 sm:px-7">
          <h2 className="mt-8 text-center text-xl font-bold">
            Collections
          </h2>

          {/* Search */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mx-auto mt-4 flex max-w-[400px] gap-2"
          >
            <input
              type="text"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              placeholder="Search by Title or Author"
              className="h-10 min-w-0 flex-1 rounded border border-gray-300 px-3 text-sm outline-none focus:border-[#3155e7]"
            />

            <button
              type="submit"
              className="rounded bg-[#3155e7] px-4 py-2 text-white hover:bg-[#2444c7]"
            >
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="mr-2"
              />
              Search
            </button>
          </form>

          {/* Show current search */}
          {searchKey.trim() && (
            <div className="mt-3 text-center text-sm text-gray-600">
              Search results for:{" "}
              <span className="font-semibold text-black">
                {searchKey}
              </span>
              <button
                type="button"
                onClick={() => setSearchKey("")}
                className="ml-3 text-[#3155e7] underline"
              >
                Clear
              </button>
            </div>
          )}

          {/* Loading, Error and Books */}
          {loading ? (
            <p className="mt-10 text-center">
              Loading books...
            </p>
          ) : error ? (
            <div className="mt-10 text-center">
              <p className="text-red-600">{error}</p>

              <button
                type="button"
                onClick={fetchBooks}
                className="mt-4 rounded bg-[#3155e7] px-5 py-2 text-white"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="mt-8 flex gap-8">
              {/* Category Filter */}
              <aside className="hidden w-[180px] shrink-0 md:block">
                <h3 className="mb-3 text-sm font-semibold">
                  Categories
                </h3>

                <ul className="space-y-3">
                  <li>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory("All")}
                      className={`text-left text-sm ${
                        selectedCategory === "All"
                          ? "font-bold text-[#3155e7]"
                          : "text-gray-700 hover:text-[#3155e7]"
                      }`}
                    >
                      All Categories
                    </button>
                  </li>

                  {categoryList.map((category) => (
                    <li key={category}>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedCategory(category)
                        }
                        className={`text-left text-sm ${
                          selectedCategory === category
                            ? "font-bold text-[#3155e7]"
                            : "text-gray-700 hover:text-[#3155e7]"
                        }`}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </aside>

              {/* Books from Backend */}
              <section className="min-w-0 flex-1">
                <p className="mb-4 text-sm text-gray-600">
                  {filteredBooks.length} book(s) found
                </p>

                {filteredBooks.length === 0 ? (
                  <div className="mt-6 text-center text-gray-600">
                    <p>
                      {searchKey.trim()
                        ? "No matching books found."
                        : selectedCategory !== "All"
                        ? "No books found in this category."
                        : "No books available."}
                    </p>

                    {searchKey.trim() && (
                      <button
                        type="button"
                        onClick={() => setSearchKey("")}
                        className="mt-3 text-[#3155e7] underline"
                      >
                        Show all books
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {filteredBooks.map((book) => {
                      const image = book.uploadImages?.[0]
                        ? `http://localhost:3000/uploads/${book.uploadImages[0]}`
                        : book.imageUrl ||
                          (book.uploadImage?.[0]
                            ? `http://localhost:3000/uploads/${book.uploadImage[0]}`
                            : "");

                      return (
                        <div
                          key={book._id}
                          className="w-full border border-gray-200 bg-white p-2 shadow-md"
                        >
                          {/* Book Image */}
                          <button
                            type="button"
                            onClick={() =>
                              openBookDetails(book._id)
                            }
                            className="block h-[150px] w-full overflow-hidden"
                            aria-label={`View ${
                              book.title || "book"
                            } details`}
                          >
                            <img
                              src={
                                image ||
                                "https://cdn-icons-png.flaticon.com/512/2232/2232688.png"
                              }
                              alt={book.title || "Book"}
                              className="h-full w-full object-contain"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src =
                                  "https://cdn-icons-png.flaticon.com/512/2232/2232688.png";
                              }}
                            />
                          </button>

                          <p className="mt-2 text-center text-sm">
                            {book.author || "Unknown Author"}
                          </p>

                          <p className="text-center text-sm font-semibold">
                            {book.title || "Untitled Book"}
                          </p>

                          <p className="mt-1 text-center text-sm text-gray-700">
                            ₹{book.discountPrice || book.price || 0}
                          </p>

                          {book.discountPrice &&
                            book.price && (
                              <p className="text-center text-xs text-gray-500 line-through">
                                ₹{book.price}
                              </p>
                            )}

                          {book.category && (
                            <p className="mt-1 text-center text-xs text-gray-500">
                              {book.category}
                            </p>
                          )}

                          {/* View Details */}
                          <button
                            type="button"
                            onClick={() =>
                              openBookDetails(book._id)
                            }
                            className="mt-3 w-full bg-[#3155e7] py-2 text-sm text-white hover:bg-[#3049bd]"
                          >
                            View Details
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default AllBook;
