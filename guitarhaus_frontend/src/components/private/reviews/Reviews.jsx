import React, { useEffect, useState } from "react";
import { FaCheck, FaTrash, FaEdit, FaTimes } from "react-icons/fa";
import axios from "axios";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingReview, setEditingReview] = useState(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Authentication required. Please login again.");
        return;
      }

      const response = await axios.get("http://localhost:3000/api/v1/reviews/admin/all", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setReviews(response.data.data.map(r => ({
          id: r._id,
          user: r.customer?.fname || "User",
          package: r.guitar?.name || "-",
          rating: r.rating,
          review: r.comment,
          status: r.isVerified ? "Approved" : "Pending"
        })));
      } else {
        setError("Failed to fetch reviews");
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
      } else if (err.response?.status === 403) {
        setError("Access denied. Admin privileges required.");
      } else {
        setError("Failed to fetch reviews. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleEditClick = (review) => {
    setEditingReview(review.id);
    setEditText(review.review);
    setEditRating(review.rating);
    setActionError("");
    setSuccessMessage("");
  };

  const handleEditSave = async (review) => {
    try {
      setActionError("");
      setSuccessMessage("");
      const token = localStorage.getItem("token");
      
      if (!token) {
        setActionError("Authentication required. Please login again.");
        return;
      }

      const response = await axios.put(
        `http://localhost:3000/api/v1/reviews/${review.id}`,
        { rating: editRating, title: "Review", comment: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSuccessMessage("Review updated successfully!");
        setEditingReview(null);
        setEditText("");
        setEditRating(5);
        // Refetch reviews
        await fetchReviews();
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setActionError("Failed to update review.");
      }
    } catch (err) {
      console.error('Error updating review:', err);
      if (err.response?.status === 403) {
        setActionError("Access denied. You can only edit your own reviews.");
      } else if (err.response?.status === 404) {
        setActionError("Review not found.");
      } else {
        setActionError("Failed to update review. Please try again.");
      }
    }
  };

  const handleDelete = async (review) => {
    if (!window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
      return;
    }

    try {
      setActionError("");
      setSuccessMessage("");
      const token = localStorage.getItem("token");
      
      if (!token) {
        setActionError("Authentication required. Please login again.");
        return;
      }

      const response = await axios.delete(`http://localhost:3000/api/v1/reviews/${review.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setSuccessMessage("Review deleted successfully!");
        // Refetch reviews
        await fetchReviews();
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setActionError("Failed to delete review.");
      }
    } catch (err) {
      console.error('Error deleting review:', err);
      if (err.response?.status === 403) {
        setActionError("Access denied. You can only delete your own reviews.");
      } else if (err.response?.status === 404) {
        setActionError("Review not found.");
      } else {
        setActionError("Failed to delete review. Please try again.");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditText("");
    setEditRating(5);
    setActionError("");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Customer Reviews</h2>
      
      {/* Success and Error Messages */}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <FaCheck className="text-green-600 mr-2" />
            <span className="text-green-800 font-medium">{successMessage}</span>
          </div>
        </div>
      )}
      
      {actionError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <FaTimes className="text-red-600 mr-2" />
            <span className="text-red-800 font-medium">{actionError}</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading reviews...</span>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchReviews}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">User</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Guitar</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rating</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Review</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  editingReview === review.id ? (
                    <tr className="bg-yellow-50" key={review.id}>
                      <td className="px-6 py-4 text-sm text-gray-700">{review.user}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{review.package}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {[1,2,3,4,5].map(star => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setEditRating(star)}
                            className={`text-xl ${star <= editRating ? "text-yellow-500" : "text-gray-300"}`}
                            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                          >
                            &#9733;
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">{editRating} / 5</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <textarea
                          className="w-full border border-yellow-300 rounded-lg p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          rows={3}
                          value={editText}
                          onChange={e => setEditText(e.target.value)}
                          placeholder="Enter your review..."
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <button
                          className="bg-green-600 text-white px-3 py-1 rounded mr-2 hover:bg-green-700 transition-colors"
                          onClick={() => handleEditSave(review)}
                        >
                          <FaCheck className="inline mr-1" />
                          Save
                        </button>
                        <button
                          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors"
                          onClick={handleCancelEdit}
                        >
                          <FaTimes className="inline mr-1" />
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={review.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-700 font-medium">{review.user}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{review.package}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex items-center">
                          {Array.from({ length: review.rating }, (_, index) => (
                            <span key={index} className="text-yellow-500 text-lg">&#9733;</span>
                          ))}
                          <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-md">
                        <p className="line-clamp-3">{review.review}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <button
                          className="bg-blue-600 text-white px-3 py-1 rounded mr-2 hover:bg-blue-700 transition-colors"
                          onClick={() => handleEditClick(review)}
                          title="Edit Review"
                        >
                          <FaEdit className="inline mr-1" />
                          Edit
                        </button>
                        <button
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                          onClick={() => handleDelete(review)}
                          title="Delete Review"
                        >
                          <FaTrash className="inline mr-1" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No reviews found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reviews;
