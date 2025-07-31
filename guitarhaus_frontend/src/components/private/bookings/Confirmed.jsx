import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const Confirmed = () => {
  // Mock Data (Replace with actual API fetch)
  const confirmedBookings = [
    { 
      id: 1, 
      user: "John Doe", 
      package: "Paris Getaway", 
      bookingDate: "2025-02-17", 
      status: "Confirmed", 
      image: "https://via.placeholder.com/100x60?text=Paris"  // Example image URL
    },
    { 
      id: 2, 
      user: "Jane Smith", 
      package: "Thailand Adventure", 
      bookingDate: "2025-02-16", 
      status: "Confirmed", 
      image: "https://via.placeholder.com/100x60?text=Thailand"  // Example image URL
    },
    { 
      id: 3, 
      user: "Michael Lee", 
      package: "Bali Retreat", 
      bookingDate: "2025-02-15", 
      status: "Confirmed", 
      image: "https://via.placeholder.com/100x60?text=Bali"  // Example image URL
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Confirmed Bookings</h2>

      {/* Confirmed Bookings Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Image</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">User</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Package</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Booking Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {confirmedBookings.map((booking) => (
              <tr key={booking.id} className="border-b hover:bg-gray-100">
                {/* Image Column */}
                <td className="px-6 py-4 text-sm text-gray-700">
                  <img 
                    src={booking.image} 
                    alt={booking.package} 
                    className="w-24 h-16 object-cover rounded-md" 
                  />
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{booking.user}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{booking.package}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{booking.bookingDate}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    booking.status === "Confirmed" 
                      ? "bg-red-100 text-red-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <button
                    className="text-red-500 hover:text-red-700 mr-2"
                    onClick={() => alert(`View booking details ${booking.id}`)}
                  >
                    View
                  </button>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => alert(`Cancel booking ${booking.id}`)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Confirmed;
