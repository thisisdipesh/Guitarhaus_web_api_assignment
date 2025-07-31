import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

const ConfirmedOrders = () => {
  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConfirmedOrders();
  }, []);

  const fetchConfirmedOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError('Authentication required. Please login again.');
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:3000/api/v1/admin/orders/confirmed', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setConfirmedOrders(response.data.data);
      } else {
        setError('Failed to load confirmed orders');
      }
    } catch (err) {
      console.error('Error fetching confirmed orders:', err);
      if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
      } else if (err.response?.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else {
        setError('Failed to load confirmed orders. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`http://localhost:3000/api/v1/admin/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          alert('Order deleted successfully!');
          fetchConfirmedOrders(); // Refresh the list
        } else {
          alert('Failed to delete order');
        }
      } catch (err) {
        console.error('Error deleting order:', err);
        alert('Failed to delete order. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Confirmed Orders</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-2">Loading confirmed orders...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Confirmed Orders</h2>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchConfirmedOrders}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Confirmed Orders</h2>

      {/* Confirmed Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">User</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Guitar</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {confirmedOrders.length > 0 ? (
              confirmedOrders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {order.customer ? `${order.customer.fname} ${order.customer.lname}` : 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {order.items && order.items.length > 0 ? order.items[0].guitar?.name || 'Unknown Guitar' : 'Unknown Guitar'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    ₹{order.totalAmount?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-2"
                      onClick={() => alert(`Edit order ${order._id}`)}
                      title="Edit Order"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteOrder(order._id)}
                      title="Delete Order"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No confirmed orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConfirmedOrders; 