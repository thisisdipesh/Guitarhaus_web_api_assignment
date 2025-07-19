import React from "react";
import { FaEye, FaTrash } from "react-icons/fa";

const Payments = () => {
  // Mock Data (Replace with actual API fetch)
  const payments = [
    { id: 1, user: "John Doe", bookingId: "B001", amount: "₹999", paymentDate: "2025-02-17", status: "Completed" },
    { id: 2, user: "Jane Smith", bookingId: "B002", amount: "₹1,299", paymentDate: "2025-02-16", status: "Pending" },
    { id: 3, user: "Michael Lee", bookingId: "B003", amount: "₹899", paymentDate: "2025-02-15", status: "Refunded" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Payments</h2>

      {/* Payments Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">User</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Booking ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Payment Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b hover:bg-gray-100">
                <td className="px-6 py-4 text-sm text-gray-700">{payment.user}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{payment.bookingId}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{payment.amount}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{payment.paymentDate}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      payment.status === "Completed"
                        ? "bg-red-100 text-red-800"
                        : payment.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <button
                    className="text-red-500 hover:text-red-700 mr-2"
                    onClick={() => alert(`View payment details for ${payment.bookingId}`)}
                  >
                    <FaEye />
                  </button>
                  {payment.status !== "Refunded" && (
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => alert(`Refund payment for ${payment.bookingId}`)}
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

export default Payments;
