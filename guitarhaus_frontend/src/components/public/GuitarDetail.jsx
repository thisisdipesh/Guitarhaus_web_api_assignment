import axios from "axios";
import React, { lazy, useEffect, useState } from "react";
import { FaHeart, FaTag, FaGuitar, FaCheckCircle, FaCrown, FaStar } from "react-icons/fa";
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
  const [wishlistCount, setWishlistCount] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
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
        const isInWishlist = res.data.data.some((item) => item.guitar && item.guitar._id === id);
        setIsFavorite(isInWishlist);
        setWishlistCount(res.data.data.length);
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
        const res = await axios.delete(`http://localhost:3000/api/v1/wishlist/remove/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFavorite(false);
        setWishlistCount(res.data.count);
      } else {
        const res = await axios.post(
          `http://localhost:3000/api/v1/wishlist/add`,
          { guitarId: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsFavorite(true);
        setWishlistCount(res.data.count);
        navigate('/favorite');
      }
    } catch (err) {
      console.error("Error updating wishlist", err);
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      alert("Please log in to add items to cart.");
      return;
    }

    setAddingToCart(true);
    try {
      await axios.post(
        `http://localhost:3000/api/v1/cart/add`,
        { guitarId: id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("Guitar added to cart successfully! 🎸");
      navigate('/mycart');
    } catch (err) {
      console.error("Error adding to cart", err);
      alert("Failed to add to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <p className="text-center py-10 text-lg">Loading guitar details...</p>;
  if (error) return <p className="text-center text-red-600 py-10">{error}</p>;
  if (!packageData) return null;

  // Get the guitar image from backend or fallback to local images
  const getGuitarImage = () => {
    if (packageData.images && packageData.images.length > 0) {
      return `http://localhost:3000/uploads/${packageData.images[0]}`;
    }
    // Fallback to local images if no backend image
    return guitarImages[Math.floor(Math.random() * guitarImages.length)];
  };

  return (
    <>
      <Navbar wishlistCount={wishlistCount} />
      
      {/* Main Guitar Display Section with Side Info */}
      <div className="relative w-full h-[500px] bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
        <div className="absolute inset-0 flex items-center">
          {/* Guitar Image - Left Side */}
          <div className="w-1/2 h-full flex items-center justify-center">
            <img
              src={getGuitarImage()}
              alt={packageData.title || "Guitar"}
              className="max-w-full max-h-full object-contain opacity-90"
              style={{ maxHeight: '80%', maxWidth: '80%' }}
            />
          </div>
          
          {/* Guitar Info - Right Side */}
          <div className="w-1/2 h-full flex flex-col justify-center items-start px-8 text-white">
            <div className="space-y-6">
              {/* Guitar Name */}
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg tracking-tight mb-4">
                  {packageData.title}
                </h1>
              </div>
              
              {/* Brand and Category */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FaCrown className="text-yellow-400" size={20} />
                  <span className="text-xl font-semibold text-yellow-400">{packageData.brand}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaStar className="text-yellow-400" size={20} />
                  <span className="text-xl font-semibold text-yellow-400">{packageData.category}</span>
                </div>
              </div>
              
              {/* Price */}
              <div className="flex items-center gap-3">
                <FaTag className="text-yellow-400" size={20} />
                <span className="text-2xl font-bold text-yellow-400">₹{packageData.price}</span>
              </div>
              
              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="bg-yellow-500 text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition duration-300 shadow-lg mt-6 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaGuitar size={20} />
                {addingToCart ? "Adding to Cart..." : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Information Panels */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Guitar Specs Panel */}
          <div className="bg-yellow-50 rounded-lg shadow-lg p-6 border-l-4 border-yellow-400">
            <h2 className="text-2xl font-bold text-yellow-900 mb-4 flex items-center gap-2">
              <FaGuitar className="text-yellow-700" /> Guitar Specs
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaTag className="text-red-600" />
                <span className="text-gray-800 font-semibold">Price: ₹{packageData.price}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-green-600" />
                <span className="text-gray-800 font-semibold">Available: In Stock</span>
              </div>
              <div className="flex items-center gap-3">
                <FaCrown className="text-yellow-700" />
                <span className="text-gray-800 font-semibold">Brand: {packageData.brand}</span>
              </div>
            </div>
          </div>

          {/* Description Panel */}
          <div className="bg-yellow-50 rounded-lg shadow-lg p-6 border-l-4 border-yellow-400">
            <h2 className="text-2xl font-bold text-yellow-900 mb-4 flex items-center gap-2">
              <FaGuitar className="text-yellow-700" /> Description
            </h2>
            <p className="text-gray-800 leading-relaxed">
              {packageData.description || "Experience the perfect blend of craftsmanship and sound quality. This guitar offers exceptional playability and rich, warm tones that will inspire your musical journey."}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mt-8 justify-center">
          <button 
            onClick={handleWishlistToggle} 
            className={`flex items-center justify-center gap-3 text-lg font-semibold px-8 py-4 rounded-lg shadow-lg transition duration-300 ${
              isFavorite 
                ? "bg-red-600 text-white hover:bg-red-700" 
                : "bg-white text-red-700 border-2 border-red-600 hover:bg-red-50"
            }`}
          >
            <FaHeart className={isFavorite ? "text-white" : "text-red-600"} />
            {isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>
        </div>

        {/* Guitar Features Section */}
        {packageData.itinerary && packageData.itinerary.length > 0 && (
          <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              🎸 Guitar Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {packageData.itinerary.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <span className="text-yellow-700 font-bold text-lg">✔</span>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </>
  );
};

export default PackageDetail;

