import React, { useState, useEffect } from "react";
import { FaRegStar, FaStar, FaStarHalfAlt, FaGuitar } from "react-icons/fa";
import axios from "axios";
import Footer from "../../components/common/customer/Footer";
import Navbar from "../../components/common/customer/Navbar";

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [guitars, setGuitars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newReview, setNewReview] = useState({
    guitarId: "",
    rating: 5,
    comment: "",
  });

  // Fetch reviews and guitars on component mount
  useEffect(() => {
    fetchReviews();
    fetchGuitars();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/reviews");
      setReviews(response.data.data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Failed to load reviews");
    }
  };

  const fetchGuitars = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/guitars");
      setGuitars(response.data.data || []);
    } catch (error) {
      console.error("Error fetching guitars:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newReview.guitarId || !newReview.comment) {
      setError("Please select a guitar and write a comment");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to submit a review");
        return;
      }

      await axios.post(
        `http://localhost:3000/api/v1/reviews/guitar/${newReview.guitarId}`,
        {
          rating: newReview.rating,
          comment: newReview.comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Reset form and refresh reviews
      setNewReview({ guitarId: "", rating: 5, comment: "" });
      fetchReviews();
      setError("");
    } catch (error) {
      console.error("Error submitting review:", error);
      setError(error.response?.data?.message || "Failed to submit review");
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => {
      if (index + 1 <= rating) {
        return <FaStar key={index} className="text-yellow-500 text-lg" />;
      } else if (index + 0.5 === rating) {
        return <FaStarHalfAlt key={index} className="text-yellow-500 text-lg" />;
      } else {
        return <FaRegStar key={index} className="text-gray-400 text-lg" />;
      }
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-6 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading reviews...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Customer Reviews</h1>
        <p className="text-lg text-center text-gray-600 mb-12">
          See what our customers say about our guitars!
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Reviews Grid */}
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <FaGuitar className="text-gray-400 text-6xl mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                 <div className="flex items-center justify-between mb-3">
                   <h3 className="text-lg font-semibold text-gray-800">
                     {review.customer?.fname} {review.customer?.lname}
                   </h3>
                   <span className="text-sm text-gray-500">
                     {new Date(review.createdAt).toLocaleDateString()}
                   </span>
                 </div>
                
                {review.guitar && (
                  <p className="text-sm text-blue-600 mb-2">
                    <FaGuitar className="inline mr-1" />
                    {review.guitar.name}
                  </p>
                )}
                
                <div className="flex items-center mb-3">
                  {renderStars(review.rating)}
                  <span className="ml-2 text-sm text-gray-600">({review.rating})</span>
                </div>
                
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Review Form */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Leave a Review</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-800 font-semibold mb-2">Select Guitar</label>
              <select
                name="guitarId"
                value={newReview.guitarId}
                onChange={(e) => setNewReview({ ...newReview, guitarId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                required
              >
                <option value="">Select a Guitar</option>
                {guitars.map((guitar) => (
                  <option key={guitar._id} value={guitar._id}>
                    {guitar.name} - {guitar.brand}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-800 font-semibold mb-2">Rating</label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="focus:outline-none"
                  >
                    {star <= newReview.rating ? (
                      <FaStar className="text-yellow-500 text-2xl" />
                    ) : (
                      <FaRegStar className="text-gray-400 text-2xl hover:text-yellow-400" />
                    )}
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">({newReview.rating} stars)</span>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-800 font-semibold mb-2">Comment</label>
              <textarea
                name="comment"
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Share your experience with this guitar..."
                required
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="bg-yellow-500 text-white py-2 px-6 rounded-md hover:bg-yellow-600 transition duration-300 font-semibold"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Review;
