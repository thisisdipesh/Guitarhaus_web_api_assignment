import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const Success = () => {
  const location = useLocation();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to get query params
  const getQueryParam = (name) => {
    return new URLSearchParams(location.search).get(name);
  };

  useEffect(() => {
    // Get transaction_uuid and total_amount from query params
    const transaction_uuid = getQueryParam("transaction_uuid");
    const total_amount = getQueryParam("total_amount");
    const product_code = "EPAYTEST";

    if (!transaction_uuid || !total_amount) {
      setError("Missing payment details in URL.");
      setLoading(false);
      return;
    }

    axios
      .get(
        `https://rc.esewa.com.np/api/epay/transaction/status/?product_code=${product_code}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`
      )
      .then((res) => {
        setStatus(res.data.status);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to verify eSewa payment.");
        setLoading(false);
      });
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-green-700 mb-4">Payment Successful!</h1>
        {loading ? (
          <p className="text-gray-700 mb-6">Verifying payment status...</p>
        ) : error ? (
          <p className="text-red-600 mb-6">{error}</p>
        ) : (
          <p className="text-lg text-gray-700 mb-6">eSewa Payment Status: <span className="font-bold">{status}</span></p>
        )}
        <Link to="/" className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-green-700 transition">Return Home</Link>
      </div>
    </div>
  );
};

export default Success; 