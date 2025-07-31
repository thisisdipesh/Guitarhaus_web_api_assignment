import React, { useState, useEffect } from "react";
import { FaGuitar, FaClipboardList, FaDollarSign, FaUsers, FaPlus, FaChartBar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalGuitars: 0,
    totalOrders: 0,
    totalRevenue: 0,
    topGuitar: { name: "Loading...", sales: 0 },
    topUser: { name: "Loading...", purchases: 0 },
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError('Authentication required. Please login again.');
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:3000/api/v1/admin/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Dashboard API Response:', response.data);

      if (response.data.success) {
        const data = response.data.data;
        console.log('Dashboard Data:', data);
        
        setDashboardData({
          totalUsers: data.totalUsers || 0,
          totalGuitars: data.totalGuitars || 0,
          totalOrders: data.totalOrders || 0,
          totalRevenue: data.totalRevenue || 0,
          topGuitar: data.topGuitar || { name: "No sales yet", sales: 0 },
          topUser: data.topUser || { name: "No purchases yet", purchases: 0 },
          recentOrders: data.recentOrders || []
        });
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
      } else if (err.response?.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to load dashboard data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddGuitar = () => {
    navigate('/admin/addguitar');
  };

  // Format numbers with commas
  const formatNumber = (num) => {
    if (num === null || num === undefined || isNaN(num)) {
      return "0";
    }
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return "₹0";
    }
    return `₹${formatNumber(amount)}`;
  };

  const stats = [
    { 
      id: 1, 
      title: "Total Users", 
      value: formatNumber(dashboardData.totalUsers || 0), 
      icon: <FaUsers size={28} />, 
      color: "from-blue-500 to-blue-400" 
    },
    { 
      id: 2, 
      title: "Total Guitars", 
      value: formatNumber(dashboardData.totalGuitars || 0), 
      icon: <FaGuitar size={28} />, 
      color: "from-yellow-500 to-yellow-400" 
    },
    { 
      id: 3, 
      title: "Total Orders", 
      value: formatNumber(dashboardData.totalOrders || 0), 
      icon: <FaClipboardList size={28} />, 
      color: "from-pink-500 to-red-400" 
    },
    { 
      id: 4, 
      title: "Total Revenue", 
      value: formatCurrency(dashboardData.totalRevenue || 0), 
      icon: <FaDollarSign size={28} />, 
      color: "from-green-500 to-green-400" 
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 p-0 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 text-lg text-yellow-800">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 p-0 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 p-0 md:p-8">
      {/* Glassmorphism Hero */}
      <div className="backdrop-blur-lg bg-white/60 border border-yellow-100 shadow-2xl rounded-3xl px-8 py-10 flex flex-col md:flex-row items-center justify-between mb-10 mt-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-900 mb-2 tracking-tight drop-shadow-lg">Welcome, Admin! 🎸</h1>
          <p className="text-lg text-yellow-800/80 font-medium">Your modern dashboard overview</p>
        </div>
        <div className="mt-8 md:mt-0 flex gap-4">
          <button onClick={handleAddGuitar} className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold px-6 py-3 rounded-2xl shadow-lg hover:from-yellow-500 hover:to-yellow-700 flex items-center gap-2 transition-all">
            <FaPlus /> Add Guitar
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        {stats.map((stat) => (
          <div key={stat.id} className={`rounded-3xl shadow-xl p-7 bg-white/80 border border-gray-100 flex flex-col items-center relative overflow-hidden hover:scale-105 transition-transform duration-300`}> 
            <div className={`absolute right-4 top-4 opacity-10 text-7xl pointer-events-none select-none`}>{stat.icon}</div>
            <div className="z-10 flex flex-col items-center">
              <span className="text-4xl font-extrabold text-yellow-900 drop-shadow-lg">{stat.value}</span>
              <span className="text-lg font-semibold mt-2 text-gray-700 tracking-wide">{stat.title}</span>
            </div>
            <div className={`absolute left-0 bottom-0 w-full h-2 bg-gradient-to-r ${stat.color}`}></div>
          </div>
        ))}
      </div>

      {/* Highlights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-gradient-to-r from-yellow-200 to-yellow-100 rounded-2xl p-6 flex items-center gap-4 shadow">
          <FaGuitar className="text-yellow-600 text-3xl" />
          <div>
            <div className="font-bold text-lg text-yellow-900">
              Top Guitar: {dashboardData.topGuitar?.name || "No sales yet"}
            </div>
            <div className="text-yellow-700 text-sm">
              {dashboardData.topGuitar?.sales || 0} sold this month
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-pink-200 to-pink-100 rounded-2xl p-6 flex items-center gap-4 shadow">
          <FaUsers className="text-pink-600 text-3xl" />
          <div>
            <div className="font-bold text-lg text-pink-900">
              Top User: {dashboardData.topUser?.name || "No purchases yet"}
            </div>
            <div className="text-pink-700 text-sm">
              {dashboardData.topUser?.purchases || 0} purchases this month
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white/80 border border-yellow-100 rounded-3xl shadow-xl p-8">
        <h3 className="text-2xl font-bold mb-6 text-yellow-900">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white/80 rounded-2xl">
            <thead>
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Guitar</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentOrders.length > 0 ? (
                dashboardData.recentOrders.map((order) => (
                  <tr key={order._id} className="border-b last:border-b-0 hover:bg-yellow-50 transition">
                    <td className="py-3 px-4 text-sm font-semibold text-gray-800 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full border-2 border-yellow-200 shadow bg-yellow-100 flex items-center justify-center">
                        <FaUsers className="text-yellow-600 text-sm" />
                      </div>
                      {order.customerName || order.customer?.fname + ' ' + order.customer?.lname || 'Unknown'}
                    </td>
                    <td className="py-3 px-4 text-sm text-yellow-700">{order.guitarName || order.guitar?.name || 'Unknown Guitar'}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(order.createdAt || order.date).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow ${
                        order.status === "confirmed" || order.status === "Confirmed" 
                          ? "bg-green-100 text-green-700" 
                          : order.status === "pending" || order.status === "Pending" 
                          ? "bg-yellow-100 text-yellow-800" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500">
                    No recent orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
