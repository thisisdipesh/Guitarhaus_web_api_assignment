import React, { useEffect, useState } from "react";
import { FaCheck, FaTrash } from "react-icons/fa";
import axios from "axios";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingReview, setEditingReview] = useState(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    // Fetch all reviews from backend
    const token = localStorage.getItem("token");
    axios.get("http://localhost:3000/api/v1/reviews/admin/all", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setReviews(res.data.data.map(r => ({
          id: r._id,
          user: r.customer?.fname || "User",
          package: r.guitar?.name || "-",
          rating: r.rating,
          review: r.comment,
          status: r.isVerified ? "Approved" : "Pending"
        })));
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch reviews");
        setLoading(false);
      });
  }, []);

  const handleEditClick = (review) => {
    setEditingReview(review.id);
    setEditText(review.review);
    setEditRating(review.rating);
    setActionError("");
  };

  const handleEditSave = async (review) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:3000/api/v1/reviews/${review.id}`,
        { rating: editRating, title: "Review", comment: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingReview(null);
      setEditText("");
      setEditRating(5);
      setActionError("");
      // Refetch reviews
      axios.get("http://localhost:3000/api/v1/reviews/admin/all", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          setReviews(res.data.data.map(r => ({
            id: r._id,
            user: r.customer?.fname || "User",
            package: r.guitar?.name || "-",
            rating: r.rating,
            review: r.comment,
            status: r.isVerified ? "Approved" : "Pending"
          })));
        });
    } catch (err) {
      setActionError("Failed to update review.");
    }
  };

  const handleDelete = async (review) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:3000/api/v1/reviews/${review.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refetch reviews
      axios.get("http://localhost:3000/api/v1/reviews/admin/all", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          setReviews(res.data.data.map(r => ({
            id: r._id,
            user: r.customer?.fname || "User",
            package: r.guitar?.name || "-",
            rating: r.rating,
            review: r.comment,
            status: r.isVerified ? "Approved" : "Pending"
          })));
        });
    } catch (err) {
      setActionError("Failed to delete review.");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Customer Reviews</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
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
              {reviews.map((review) => (
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
                          className={star <= editRating ? "text-yellow-500" : "text-gray-300"}
                          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        >
                          &#9733;
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">{editRating} / 5</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <textarea
                        className="w-full border border-yellow-300 rounded-lg p-2"
                        rows={2}
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <button
                        className="bg-blue-600 text-white px-4 py-1 rounded mr-2 hover:bg-blue-700"
                        onClick={() => handleEditSave(review)}
                      >
                        Save
                      </button>
                      <button
                        className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-600"
                        onClick={() => setEditingReview(null)}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={review.id} className="border-b hover:bg-gray-100">
                    <td className="px-6 py-4 text-sm text-gray-700">{review.user}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{review.package}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {Array.from({ length: review.rating }, (_, index) => (
                        <span key={index} className="text-yellow-500">&#9733;</span>
                      ))}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{review.review}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <button
                        className="bg-blue-600 text-white px-4 py-1 rounded mr-2 hover:bg-blue-700"
                        onClick={() => handleEditClick(review)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-600"
                        onClick={() => handleDelete(review)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reviews;
