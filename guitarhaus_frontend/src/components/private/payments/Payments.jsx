import React, { useState, useEffect } from "react";
import { FaEye, FaTrash, FaTrashAlt } from "react-icons/fa";
import axios from "axios";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError('Authentication required. Please login again.');
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:3000/api/v1/admin/payments', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setPayments(response.data.data);
      } else {
        setError('Failed to load payments');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
      } else if (err.response?.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else if (err.code === 'ECONNREFUSED') {
        setError('Cannot connect to server. Please check if the backend is running.');
      } else {
        setError('Failed to load payments. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewPayment = (payment) => {
    alert(`Payment Details:\nUser: ${payment.customerName}\nOrder ID: ${payment.orderId}\nAmount: ${payment.amount}\nMethod: ${payment.paymentMethod}\nStatus: ${payment.status}`);
  };

  const handleRefundPayment = async (payment) => {
    if (window.confirm(`Are you sure you want to refund payment for ${payment.customerName}?`)) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.put(`http://localhost:3000/api/v1/admin/payments/${payment.orderId}/refund`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          alert('Payment refunded successfully!');
          fetchPayments(); // Refresh the list
        } else {
          alert('Failed to refund payment');
        }
      } catch (err) {
        console.error('Error refunding payment:', err);
        alert('Failed to refund payment. Please try again.');
      }
    }
  };

  const handleDeletePayment = async (payment) => {
    if (window.confirm(`Are you sure you want to delete this payment for ${payment.customerName}? This action cannot be undone and will remove the payment from history.`)) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`http://localhost:3000/api/v1/admin/payments/${payment.orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          alert('Payment deleted successfully!');
          fetchPayments(); // Refresh the list
        } else {
          alert('Failed to delete payment');
        }
      } catch (err) {
        console.error('Error deleting payment:', err);
        alert('Failed to delete payment. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Payments</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading payments...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Payments</h2>
        <div className="text-center py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <div className="text-red-600 text-lg font-semibold mb-2">Something went wrong</div>
            <p className="text-red-500 text-sm mb-4">{error}</p>
            <button 
              onClick={fetchPayments}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Payments</h2>

      {/* Payments Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">User</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Payment Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Method</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment._id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div>
                      <div className="font-semibold">{payment.customerName}</div>
                      <div className="text-xs text-gray-500">{payment.customerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{payment.orderId}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-semibold">₹{payment.amount}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(payment.paymentDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span className="capitalize">{payment.paymentMethod}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        payment.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : payment.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : payment.status === "refunded"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-2"
                      onClick={() => handleViewPayment(payment)}
                      title="View Payment Details"
                    >
                      <FaEye />
                    </button>
                    {payment.status === "paid" && (
                      <button
                        className="text-orange-500 hover:text-orange-700 mr-2"
                        onClick={() => handleRefundPayment(payment)}
                        title="Refund Payment"
                      >
                        <FaTrash />
                      </button>
                    )}
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeletePayment(payment)}
                      title="Delete Payment"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
