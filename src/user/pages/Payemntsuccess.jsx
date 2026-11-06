
import React, { useEffect, useState } from "react";
import Header from "../components/Userheader";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faCircleCheck,
  faBookOpen,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

import { verifyPaymentAPI } from "../../services/allApi";

function PaymentSuccess() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  // Verify payment when the success page loads
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const sessionID = new URLSearchParams(
          window.location.search
        ).get("session_id");

        if (!sessionID) {
          setError("Payment session ID not found.");
          return;
        }

        const res = await verifyPaymentAPI({ sessionID });

        console.log("Payment verification:", res.data);

        if (res.status === 200) {
          setVerified(true);
        } else {
          setError("Payment verification failed.");
        }
      } catch (err) {
        console.error(
          "Payment verification error:",
          err.response?.data || err.message
        );

        setError(
          err.response?.data?.message ||
            "Unable to verify payment. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, []);

  return (
    <>
      <Header />

      <div className="min-h-[85vh] bg-gray-50 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg sm:p-12">

          {loading ? (
            <>
              <div className="mb-6 flex justify-center">
                <div className="h-20 w-20 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
              </div>

              <h1 className="text-2xl font-bold text-gray-800">
                Verifying Payment...
              </h1>

              <p className="mt-4 text-gray-600">
                Please wait while we verify your payment.
              </p>
            </>
          ) : verified ? (
            <>
              {/* Success Icon */}
              <div className="mb-6 flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className="text-6xl text-green-500"
                  />
                </div>
              </div>

              {/* Success Message */}
              <h1 className="text-3xl font-bold text-gray-800">
                Payment Successful!
              </h1>

              <p className="mt-4 text-gray-600">
                Thank you for your purchase!
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Your payment has been completed successfully.
                Get ready to explore your next favourite book!
              </p>

              {/* Success Details */}
              <div className="mt-8 rounded-xl border border-green-100 bg-green-50 p-5">
                <FontAwesomeIcon
                  icon={faBookOpen}
                  className="mb-3 text-3xl text-green-600"
                />

                <h2 className="font-semibold text-gray-800">
                  Happy Reading!
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                  Every book is a new adventure. Keep reading
                  and discovering new stories.
                </p>
              </div>

              {/* Explore Books Button */}
              <button
                type="button"
                onClick={() => navigate("/all-books")}
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-lg bg-[#3155e7] px-6 py-3 font-semibold text-white transition hover:bg-[#2444c7]"
              >
                <FontAwesomeIcon icon={faBookOpen} />
                Explore More Books
                <FontAwesomeIcon icon={faArrowRight} />
              </button>

              <p className="mt-5 text-xs text-gray-400">
                Thank you for choosing our bookstore!
              </p>
            </>
          ) : (
            <>
              {/* Verification Error */}
              <div className="mb-6 flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
                  <span className="text-5xl font-bold text-red-500">
                    !
                  </span>
                </div>
              </div>

              <h1 className="text-2xl font-bold text-gray-800">
                Payment Verification Failed
              </h1>

              <p className="mt-4 text-sm text-red-600">
                {error}
              </p>

              <button
                type="button"
                onClick={() => navigate("/all-books")}
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-lg bg-[#3155e7] px-6 py-3 font-semibold text-white transition hover:bg-[#2444c7]"
              >
                <FontAwesomeIcon icon={faBookOpen} />
                Explore Books
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </>
          )}

        </div>
      </div>
    </>
  );
}

export default PaymentSuccess;
