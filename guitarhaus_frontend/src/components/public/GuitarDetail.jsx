import axios from "axios";
import React, { lazy, useEffect, useState } from "react";
import { FaCalendarAlt, FaClock, FaHeart, FaMapMarkerAlt, FaTag, FaGuitar, FaCheckCircle, FaCrown, FaStar } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../common/customer/Footer";
import Navbar from "../common/customer/Navbar";
import guitar1 from '/src/assets/images/guitar_homepage.jpg';
import guitar2 from '/src/assets/images/guitar2.jpg';
import guitar3 from '/src/assets/images/guitar3.jpg';
import guitar4 from '/src/assets/images/guitar4.jpg';
import guitar5 from '/src/assets/images/guitar5.jpg';
const guitarImages = [guitar1, guitar2, guitar3, guitar4, guitar5];

const PackageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0); // Wishlist count state
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchGuitarDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/guitars/${id}`);
        setPackageData(res.data.data);
      } catch (err) {
        setError("Failed to load guitar details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchWishlistData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Wishlist is an array of objects with a 'guitar' property
        const isInWishlist = res.data.data.some((item) => item.guitar && item.guitar._id === id);
        setIsFavorite(isInWishlist);
        setWishlistCount(res.data.data.length); // Set count dynamically
      } catch (err) {
        console.error("Error fetching wishlist", err);
      }
    };

    fetchGuitarDetails();
    if (token) fetchWishlistData();
  }, [id, token]);

  const handleWishlistToggle = async () => {
    if (!token) {
      alert("Please log in to add to wishlist.");
      return;
    }

    try {
      if (isFavorite) {
        // Remove from wishlist
        const res = await axios.delete(`http://localhost:3000/api/v1/wishlist/remove/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFavorite(false);
        setWishlistCount(res.data.count); // Update count from response
      } else {
        // Add to wishlist
        const res = await axios.post(
          `http://localhost:3000/api/v1/wishlist/add`,
          { guitarId: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsFavorite(true);
        setWishlistCount(res.data.count); // Update count from response
        navigate('/favorite');
      }
    } catch (err) {
      console.error("Error updating wishlist", err);
    }
  };

  if (loading) return <p className="text-center py-10 text-lg">Loading guitar details...</p>;
  if (error) return <p className="text-center text-red-600 py-10">{error}</p>;
  if (!packageData) return null;

  return (
    <>
      <Navbar wishlistCount={wishlistCount} /> {/* Pass count to Navbar if needed */}
      <div className="container mx-auto px-6 py-10">
        {/* Hero Section */}
        <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-lg mb-10 flex items-center justify-center bg-black/80">
          <img
            src={packageData.images && packageData.images.length > 0 ? `http://localhost:3000/uploads/${packageData.images[0]}` : guitarImages[Math.floor(Math.random() * guitarImages.length)]}
            alt={packageData.title || "Guitar for sale"}
            className="w-full h-full object-cover absolute inset-0 opacity-60"
          />
          <div className="relative z-10 flex flex-col items-center justify-center text-center w-full">
            <FaGuitar size={60} className="text-yellow-400 mb-4 animate-pulse drop-shadow-lg" />
            <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg tracking-tight">
              {packageData.title}
            </h1>
            <span className="mt-2 text-lg text-yellow-200 font-semibold flex items-center justify-center gap-2">
              <FaCrown className="text-yellow-400" /> {packageData.brand} &nbsp;|&nbsp; <FaStar className="text-yellow-400" /> {packageData.category}
            </span>
          </div>
        </div>

        {/* Guitar Specs & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          {/* Left Side - Guitar Specs */}
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <FaGuitar className="text-yellow-700" /> Guitar Specs
            </h2>
            <div className="flex flex-col gap-3 text-lg">
              <span className="flex items-center gap-2 text-gray-700"><FaTag className="text-red-700" /> <b>Price:</b> ₹{packageData.price}</span>
              <span className="flex items-center gap-2 text-gray-700"><FaCheckCircle className="text-green-600" /> <b>Available:</b> {packageData.isAvailable ? "In Stock" : "Out of Stock"}</span>
              <span className="flex items-center gap-2 text-gray-700"><FaCrown className="text-yellow-700" /> <b>Brand:</b> {packageData.brand}</span>
              <span className="flex items-center gap-2 text-gray-700"><FaStar className="text-yellow-700" /> <b>Category:</b> {packageData.category}</span>
              <span className="flex items-center gap-2 text-gray-700"><FaClock className="text-blue-700" /> <b>Added:</b> {packageData.createdAt ? new Date(packageData.createdAt).toLocaleDateString() : "-"}</span>
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2"><FaCalendarAlt className="text-blue-700" /> Available Dates</h3>
              <div className="flex flex-wrap gap-2">
                {(packageData.availableDates && Array.isArray(packageData.availableDates) && packageData.availableDates.length > 0) ? (
                  packageData.availableDates.map((date, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                      {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">No available dates</span>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Description & Actions */}
          <div className="flex flex-col gap-6 justify-between">
            <div className="bg-yellow-50 rounded-lg shadow-md p-6 mb-4">
              <h3 className="text-xl font-bold text-yellow-900 mb-2 flex items-center gap-2"><FaGuitar className="text-yellow-700" /> Description</h3>
              <p className="text-gray-800 text-lg leading-relaxed">{packageData.description}</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <button 
                onClick={handleWishlistToggle} 
                className={`flex-1 flex items-center justify-center gap-2 text-lg font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300 ${isFavorite ? "bg-red-600 text-white" : "bg-white text-red-700 border border-red-600 hover:bg-red-50"}`}
              >
                <FaHeart className={isFavorite ? "text-white" : "text-red-600"} />
                {isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
              </button>
              <button
                onClick={() => navigate(`/checkout/${packageData._id}`)}
                className="flex-1 bg-yellow-500 text-black px-6 py-3 rounded-lg text-lg font-bold shadow-md hover:bg-yellow-400 transition duration-300 flex items-center justify-center gap-2"
              >
                <FaGuitar /> Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Itinerary Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-10">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">🎸 Guitar Features</h3>
          <ul className="list-none space-y-4">
            {(packageData.itinerary && Array.isArray(packageData.itinerary)) ? (
              packageData.itinerary.map((item, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="text-yellow-700 font-bold text-lg">✔</span>
                  <span className="text-gray-700 text-lg">{item}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-600">No features listed</li>
            )}
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PackageDetail;

