import React from "react";
import { Link } from "react-router-dom";

const Cancel = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-red-700 mb-4">Payment Cancelled</h1>
        <p className="text-lg text-gray-700 mb-6">
          Your payment was cancelled. No charges were made to your account.
        </p>
        <div className="flex gap-4">
          <Link 
            to="/guitars" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-blue-700 transition"
          >
            Browse Guitars
          </Link>
          <Link 
            to="/" 
            className="bg-gray-600 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-gray-700 transition"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cancel; 