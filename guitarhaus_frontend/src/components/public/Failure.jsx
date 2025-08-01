import React from "react";
import { Link } from "react-router-dom";

const Failure = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
    <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
      <h1 className="text-3xl font-extrabold text-red-700 mb-4">Payment Failed</h1>
      <p className="text-lg text-gray-700 mb-6">Sorry, your payment could not be processed. Please try again or contact support if the issue persists.</p>
      <Link to="/home" className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-red-700 transition">Return Home</Link>
    </div>
  </div>
);

export default Failure; 