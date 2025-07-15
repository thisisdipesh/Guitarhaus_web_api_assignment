import axios from "axios";
import React, { lazy, useEffect, useState } from "react";
import { FaCalendarAlt, FaClock, FaHeart, FaMapMarkerAlt, FaTag } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../common/customer/Footer";
import Navbar from "../common/customer/Navbar";
import guitar1 from '/src/assets/images/guitar1.jpg';
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
    const fetchPackageDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/package/${id}`);
        setPackageData(res.data);
      } catch (err) {
        setError("Failed to load package details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchWishlistData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const isInWishlist = res.data.wishlist.packages.some((pkg) => pkg._id === id);
        setIsFavorite(isInWishlist);
        setWishlistCount(res.data.wishlist.packages.length); // Set count dynamically
      } catch (err) {
        console.error("Error fetching wishlist", err);
      }
    };

    fetchPackageDetails();
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
          { packageId: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsFavorite(true);
        setWishlistCount(res.data.count); // Update count from response
      }
    } catch (err) {
      console.error("Error updating wishlist", err);
    }
  };

  if (loading) return <p className="text-center py-10 text-lg">Loading package details...</p>;
  if (error) return <p className="text-center text-red-600 py-10">{error}</p>;

  return (
    <>
      <Navbar wishlistCount={wishlistCount} /> {/* Pass count to Navbar if needed */}
      <div className="container mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
          <img
            src={guitarImages[Math.floor(Math.random() * guitarImages.length)]}
            alt="Guitar for sale"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80 flex items-center justify-center">
            <h1 className="text-white text-5xl font-bold shadow-lg">{packageData.title}</h1>
          </div>
        </div>

        {/* Package Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
          {/* Left Side - Itinerary */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">📌 Itinerary</h3>
            <ul className="list-none space-y-4">
              {packageData.itinerary.map((item, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="text-red-700 font-bold text-lg">✔</span>
                  <span className="text-gray-700 text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side - Package Details */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900">{packageData.title}</h2>
            <p className="text-lg text-gray-700 mt-4 leading-relaxed">{packageData.description}</p>

            <div className="mt-6 space-y-4">
              <p className="flex items-center text-gray-800 text-lg">
                <FaMapMarkerAlt className="mr-3 text-red-700" /> <span className="font-semibold">{packageData.location}</span>
              </p>
              <p className="flex items-center text-gray-800 text-lg">
                <FaClock className="mr-3 text-red-700" /> <span className="font-semibold">{packageData.duration}</span>
              </p>
              <p className="flex items-center text-gray-800 text-lg">
                <FaTag className="mr-3 text-red-700" /> <span className="font-semibold text-xl">Rs.{packageData.price}</span>
              </p>

              {/* Available Dates Section */}
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                  <FaCalendarAlt className="mr-2 text-blue-700" /> Available Dates
                </h3>
                <div className="flex flex-wrap gap-2">
                  {packageData.availableDates.length > 0 ? (
                    packageData.availableDates.map((date, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                        {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-600">No available dates</p>
                  )}
                </div>
              </div>
            </div>

            {/* Booking & Favorite Section */}
            <div className="mt-10 flex justify-between items-center">
              {/* Favorite Button */}
              <button 
                onClick={handleWishlistToggle} 
                className="flex items-center text-lg font-semibold text-gray-800 transition duration-300"
              >
                <FaHeart className={`mr-2 text-2xl ${isFavorite ? "text-red-600" : "text-gray-400"}`} />
                {isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
              </button>

              {/* Booking Button */}
              <button
                onClick={() => navigate(`/checkout/${packageData._id}`)}
                className="bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-bold shadow-lg hover:bg-red-800 transition duration-300"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PackageDetail;

