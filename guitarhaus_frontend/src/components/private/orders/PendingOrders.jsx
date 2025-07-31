import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

const PendingOrders = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError('Authentication required. Please login again.');
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:3000/api/v1/admin/orders/pending', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setPendingOrders(response.data.data);
      } else {
        setError('Failed to load pending orders');
      }
    } catch (err) {
      console.error('Error fetching pending orders:', err);
      if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
      } else if (err.response?.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else {
        setError('Failed to load pending orders. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApproveOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`http://localhost:3000/api/v1/admin/orders/${orderId}/approve`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        alert('Order approved successfully!');
        fetchPendingOrders(); // Refresh the list
      } else {
        alert('Failed to approve order');
      }
    } catch (err) {
      console.error('Error approving order:', err);
      alert('Failed to approve order. Please try again.');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.put(`http://localhost:3000/api/v1/admin/orders/${orderId}/cancel`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          alert('Order cancelled successfully!');
          fetchPendingOrders(); // Refresh the list
        } else {
          alert('Failed to cancel order');
        }
      } catch (err) {
        console.error('Error cancelling order:', err);
        alert('Failed to cancel order. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Pending Orders</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
          <span className="ml-2">Loading pending orders...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Pending Orders</h2>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchPendingOrders}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Pending Orders</h2>

      {/* Pending Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Items</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount & Payment</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingOrders.length > 0 ? (
              pendingOrders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div>
                      <div className="font-semibold">
                        {order.customer ? `${order.customer.fname} ${order.customer.lname}` : 'Unknown'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.customer?.email || 'No email'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.shippingAddress?.phone || 'No phone'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div>
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, index) => (
                          <div key={index} className="mb-1">
                            <div className="font-medium">
                              {item.guitar?.name || 'Unknown Guitar'}
                            </div>
                            <div className="text-xs text-gray-500">
                              Qty: {item.quantity} × ₹{item.price?.toFixed(2) || '0.00'}
                            </div>
                          </div>
                        ))
                      ) : (
                        <span>No items</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div>
                      <div className="font-semibold">₹{order.totalAmount?.toFixed(2) || '0.00'}</div>
                      <div className="text-xs text-gray-500">
                        {order.paymentMethod || 'Unknown'} • {order.paymentStatus || 'Unknown'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <button
                      className="text-green-500 hover:text-green-700 mr-2"
                      onClick={() => handleApproveOrder(order._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  No pending orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingOrders; 