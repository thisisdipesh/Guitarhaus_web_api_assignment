import React from "react";
import { FaCheck, FaTrash } from "react-icons/fa";

const Reviews = () => {
  // Mock Data (Replace with actual API fetch)
  const reviews = [
    { id: 1, user: "John Doe", package: "Paris Getaway", rating: 5, review: "Amazing experience, loved the trip!", status: "Approved" },
    { id: 2, user: "Jane Smith", package: "Bali Retreat", rating: 4, review: "Beautiful destination, but the hotel could be better.", status: "Pending" },
    { id: 3, user: "Michael Lee", package: "Thailand Adventure", rating: 3, review: "Good trip, but the schedule was too packed.", status: "Approved" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Customer Reviews</h2>

      {/* Reviews Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">User</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Package</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rating</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Review</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id} className="border-b hover:bg-gray-100">
                <td className="px-6 py-4 text-sm text-gray-700">{review.user}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{review.package}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {Array.from({ length: review.rating }, (_, index) => (
                    <span key={index} className="text-yellow-500">&#9733;</span> // Display star icons for rating
                  ))}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{review.review}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      review.status === "Approved"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {review.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {review.status === "Pending" ? (
                    <button
                      className="text-red-500 hover:text-red-700 mr-2"
                      onClick={() => alert(`Approve review ${review.id}`)}
                    >
                      <FaCheck />
                    </button>
                  ) : (
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => alert(`Reject review ${review.id}`)}
                    >
                      <FaTrash />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reviews;
