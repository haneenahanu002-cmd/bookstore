
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faArrowLeft,
  faXmark,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";

import Header from "../components/Userheader";
import { getSingleBookAPI, paymentAPI } from "../../services/allApi";

function ViewBook() {
  const { id } = useParams();

  const [modelStatus, setModelStatus] = useState(false);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Fetch the selected book using its MongoDB ID
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError("");
        setBook(null);

        const response = await getSingleBookAPI(id);
        const bookData = response.data?.book || response.data;

        if (bookData && bookData._id) {
          setBook(bookData);
        } else {
          setError("Book not found.");
        }
      } catch (err) {
        console.error(
          "Book details error:",
          err.response?.data || err.message
        );

        setError(
          err.response?.data?.message ||
            "Unable to load book details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    } else {
      setError("Book ID is missing.");
      setLoading(false);
    }
  }, [id]);

  // Support image URLs, upload paths and string image arrays
  const getImageSrc = (image) => {
    if (!image) return "";

    if (typeof image === "string") {
      if (
        image.startsWith("http://") ||
        image.startsWith("https://")
      ) {
        return image;
      }

      if (image.startsWith("/")) {
        return `http://localhost:3000${image}`;
      }

      return `http://localhost:3000/uploads/${image}`;
    }

    const imagePath = image.url || image.path || image.filename;

    if (!imagePath) return "";

    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://")
    ) {
      return imagePath;
    }

    if (imagePath.startsWith("/")) {
      return `http://localhost:3000${imagePath}`;
    }

    return `http://localhost:3000/uploads/${imagePath}`;
  };

  // Payment function with checkout redirect
  
const makepayment = async () => {
  try {
    setPaymentLoading(true);

    const res = await paymentAPI(id);

    console.log("Payment response:", res.data);

    if (res.status === 200) {
      const { checkoutUrl } = res.data;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        alert("Checkout URL not found.");
        setPaymentLoading(false);
      }
    }
  } catch (error) {
    console.error("Payment Error:", error.response?.data || error.message);
    console.error("Status:", error.response?.status);

    alert(
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Payment failed. Please try again."
    );

    setPaymentLoading(false);
  }
};


  // Loading screen
  if (loading) {
    return (
      <>
        <Header />
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-lg font-semibold">
            Loading book details...
          </p>
        </div>
      </>
    );
  }

  // Error screen
  if (error || !book) {
    return (
      <>
        <Header />
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-5">
          <p className="text-center text-red-600">
            {error || "Book not found."}
          </p>

          <Link
            to="/all-books"
            className="rounded-md bg-[#6578ed] px-5 py-2 text-white no-underline hover:bg-[#5267df]"
          >
            Back to Books
          </Link>
        </div>
      </>
    );
  }

  // Combine available book images
  const bookImages = [
    ...(Array.isArray(book.images) ? book.images : []),
    ...(Array.isArray(book.uploadImage) ? book.uploadImage : []),
  ];

  const bookImage =
    getImageSrc(book.imageUrl) ||
    getImageSrc(bookImages[0]) ||
    "";

  const displayPrice = book.discountPrice ?? book.price ?? 0;

  return (
    <>
      <Header />

      <div className="min-h-screen w-full overflow-x-hidden bg-white p-3 sm:p-5 md:p-8">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col rounded-sm border border-gray-300 bg-white p-4 shadow-md sm:p-6 md:p-8 lg:min-h-[calc(100vh-4rem)] lg:flex-row lg:p-8 xl:p-10">

          {/* BOOK IMAGE */}
          <div className="flex w-full items-center justify-center lg:w-[30%] lg:shrink-0">
            {bookImage ? (
              <img
                src={bookImage}
                alt={book.title || "Book cover"}
                className="h-auto w-[180px] max-w-full object-contain sm:w-[220px] md:w-[250px] lg:w-[250px] xl:w-[280px]"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="flex h-64 w-48 items-center justify-center rounded border border-gray-200 text-center text-gray-400">
                No book image available
              </div>
            )}
          </div>

          {/* BOOK DETAILS */}
          <div className="mt-6 flex w-full min-w-0 flex-col lg:mt-0 lg:w-[70%] lg:pl-6 xl:pl-10">

            {/* VIEW IMAGES BUTTON */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setModelStatus(true)}
                title="View book images"
                aria-label="View book images"
                className="text-base text-gray-400 hover:text-gray-700 sm:text-lg"
              >
                <FontAwesomeIcon icon={faEye} />
              </button>
            </div>

            {/* TITLE */}
            <h1 className="mt-2 break-words text-center text-xl font-bold leading-tight sm:text-2xl md:text-3xl lg:text-2xl xl:text-3xl">
              {book.title || "Untitled Book"}
            </h1>

            {/* AUTHOR */}
            <p className="mt-2 text-center text-xs font-semibold text-blue-500 sm:text-sm">
              - {book.author || "Unknown author"}
            </p>

            {/* PRICE */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <span className="text-2xl font-bold text-green-700">
                ₹{displayPrice}
              </span>

              {book.discountPrice != null &&
                book.price != null &&
                Number(book.price) > Number(book.discountPrice) && (
                  <span className="text-lg text-gray-400 line-through">
                    ₹{book.price}
                  </span>
                )}
            </div>

            {/* BOOK INFORMATION */}
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-4 break-words text-xs font-semibold sm:grid-cols-2 sm:text-sm lg:mt-10 lg:grid-cols-3">

              <p>
                Publisher:
                <span className="ml-1 font-normal">
                  {book.publisher || "N/A"}
                </span>
              </p>

              <p>
                Language:
                <span className="ml-1 font-normal">
                  {book.language || "N/A"}
                </span>
              </p>

              <p>
                No. of pages:
                <span className="ml-1 font-normal">
                  {book.pages ?? "N/A"}
                </span>
              </p>

              <p className="break-all">
                Seller Mail:
                <span className="ml-1 font-normal">
                  {book.sellerEmail || "N/A"}
                </span>
              </p>

              <p>
                Real Price:
                <span className="ml-1 font-normal">
                  {book.price != null ? `₹${book.price}` : "N/A"}
                </span>
              </p>

              <p>
                ISBN:
                <span className="ml-1 font-normal">
                  {book.isbn || "N/A"}
                </span>
              </p>

              <p>
                Category:
                <span className="ml-1 font-normal">
                  {book.category || "N/A"}
                </span>
              </p>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-8 flex-1 sm:mt-10">
              <h3 className="mb-3 text-base font-bold sm:text-lg">
                About This Book
              </h3>

              <p className="break-words text-xs font-normal leading-relaxed text-gray-800 sm:text-sm">
                {book.abstract || "No description available."}
              </p>
            </div>

            {/* BUTTONS */}
            <div className="mt-8 flex w-full items-center justify-end gap-3 sm:mt-10">
              <Link
                to="/all-books"
                className="flex h-10 items-center justify-center gap-2 rounded-md bg-[#6578ed] px-5 text-sm font-semibold text-white no-underline hover:bg-[#5267df]"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                Back
              </Link>

              <button
                type="button"
                onClick={makepayment}
                disabled={paymentLoading}
                className="h-10 rounded-md bg-[#219653] px-5 text-sm font-semibold text-white hover:bg-[#187b43] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {paymentLoading
                  ? "Redirecting..."
                  : `Buy ₹${displayPrice}`}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOOK IMAGES MODAL */}
      {modelStatus && (
        <div className="relative z-50">
          <div
            className="fixed inset-0 bg-gray-500/75"
            onClick={() => setModelStatus(false)}
          >
            <div className="flex min-h-screen items-center justify-center">
              <div
                className="m-5 w-full max-w-4xl bg-white md:m-10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between bg-black p-3 text-white">
                  <h3>Book Images</h3>

                  <button
                    type="button"
                    onClick={() => setModelStatus(false)}
                    aria-label="Close images"
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>

                <div className="bg-white p-5">
                  <p className="text-blue-700">
                    <FontAwesomeIcon icon={faCamera} />{" "}
                    Images of the book
                  </p>

                  <div className="my-4 flex flex-wrap gap-4">
                    {bookImages
                      .map((image) => getImageSrc(image))
                      .filter(Boolean).length > 0 ? (
                      bookImages
                        .map((image) => getImageSrc(image))
                        .filter(Boolean)
                        .map((imageSrc, index) => (
                          <img
                            key={`${imageSrc}-${index}`}
                            src={imageSrc}
                            alt={`${book.title} ${index + 1}`}
                            className="h-[200px] w-[160px] rounded border border-gray-200 object-contain"
                          />
                        ))
                    ) : bookImage ? (
                      <img
                        src={bookImage}
                        alt={book.title}
                        className="h-[200px] w-[160px] rounded border border-gray-200 object-contain"
                      />
                    ) : (
                      <p className="text-gray-500">
                        No book images available.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ViewBook;
