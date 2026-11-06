
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Userheader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faRotateRight,
  faBookOpen,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

function Payementfail() {
  const navigate = useNavigate();

  return (
    <>
      <Header />

      <div className="flex min-h-[85vh] items-center justify-center bg-gray-50 px-4 py-10">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg sm:p-12">

          {/* Failure Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
              <FontAwesomeIcon
                icon={faCircleXmark}
                className="text-6xl text-red-500"
              />
            </div>
          </div>

          {/* Failure Message */}
          <h1 className="text-3xl font-bold text-gray-800">
            Payment Failed!
          </h1>

          <p className="mt-4 text-gray-600">
            Sorry, we couldn't process your payment.
          </p>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Your payment was unsuccessful. This may happen
            because of insufficient balance, a network issue,
            or a declined transaction.
          </p>

          {/* Error Details */}
          <div className="mt-8 rounded-xl border border-red-100 bg-red-50 p-5">
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="mb-3 text-3xl text-red-500"
            />

            <h2 className="font-semibold text-gray-800">
              Don't Worry!
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Please check your payment details and try again.
              If money was deducted, verify your transaction
              status before making another payment.
            </p>
          </div>

          {/* Try Again Button */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-lg bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-600"
          >
            <FontAwesomeIcon icon={faRotateRight} />
            Try Again
          </button>

          {/* Explore More Books */}
          <button
            type="button"
            onClick={() => navigate("/all-books")}
            className="mt-3 flex w-full items-center justify-center gap-3 rounded-lg border border-[#3155e7] px-6 py-3 font-semibold text-[#3155e7] transition hover:bg-blue-50"
          >
            <FontAwesomeIcon icon={faBookOpen} />
            Explore More Books
            <FontAwesomeIcon icon={faArrowRight} />
          </button>

          <p className="mt-5 text-xs text-gray-400">
            Need help? Please contact our support team.
          </p>
        </div>
      </div>
    </>
  );
}

export default Payementfail;
