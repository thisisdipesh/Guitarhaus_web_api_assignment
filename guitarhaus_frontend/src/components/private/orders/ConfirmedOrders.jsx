import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const ConfirmedOrders = () => {
  // Mock Data (Replace with actual API fetch)
  const confirmedOrders = [
    { 
      id: 1, 
      user: "John Doe", 
      package: "Paris Getaway", 
      orderDate: "2025-02-17", 
      status: "Confirmed", 
      image: "https://via.placeholder.com/100x60?text=Paris"  // Example image URL
    },
    { 
      id: 2, 
      user: "Jane Smith", 
      package: "Thailand Adventure", 
      orderDate: "2025-02-16", 
      status: "Confirmed", 
      image: "https://via.placeholder.com/100x60?text=Thailand"  // Example image URL
    },
    { 
      id: 3, 
      user: "Michael Lee", 
      package: "Bali Retreat", 
      orderDate: "2025-02-15", 
      status: "Confirmed", 
      image: "https://via.placeholder.com/100x60?text=Bali"  // Example image URL
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Confirmed Orders</h2>

      {/* Confirmed Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Image</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">User</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Package</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {confirmedOrders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-100">
                {/* Image Column */}
                <td className="px-6 py-4 text-sm text-gray-700">
                  <img 
                    src={order.image} 
                    alt={order.package} 
                    className="w-24 h-16 object-cover rounded-md" 
                  />
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{order.user}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{order.package}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{order.orderDate}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <button
                    className="text-blue-500 hover:text-blue-700 mr-2"
                    onClick={() => alert(`Edit order ${order.id}`)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => alert(`Delete order ${order.id}`)}
                  >
                    <FaTrash />
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

export default ConfirmedOrders; 