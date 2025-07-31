import React from "react";
import { FaGuitar, FaClipboardList, FaDollarSign, FaUsers, FaPlus, FaChartBar } from 'react-icons/fa';

const Dashboard = () => {
  // Mock Data (Replace with API Fetch)
  const stats = [
    { id: 1, title: "Total Users", value: "1,240", icon: <FaUsers size={28} />, color: "from-blue-500 to-blue-400" },
    { id: 2, title: "Total Guitars", value: "58", icon: <FaGuitar size={28} />, color: "from-yellow-500 to-yellow-400" },
    { id: 3, title: "Total Orders", value: "3,450", icon: <FaClipboardList size={28} />, color: "from-pink-500 to-red-400" },
    { id: 4, title: "Total Revenue", value: "₹12,480", icon: <FaDollarSign size={28} />, color: "from-green-500 to-green-400" },
  ];

  const recentOrders = [
    { id: 1, customer: "John Doe", guitar: "Fender Stratocaster", date: "2024-08-15", status: "Confirmed", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: 2, customer: "Jane Smith", guitar: "Gibson Les Paul", date: "2024-08-14", status: "Pending", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    { id: 3, customer: "Mike Johnson", guitar: "Ibanez RG", date: "2024-08-13", status: "Canceled", avatar: "https://randomuser.me/api/portraits/men/65.jpg" },
    { id: 4, customer: "Emily Davis", guitar: "Yamaha Pacifica", date: "2024-08-12", status: "Confirmed", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 p-0 md:p-8">
      {/* Glassmorphism Hero */}
      <div className="backdrop-blur-lg bg-white/60 border border-yellow-100 shadow-2xl rounded-3xl px-8 py-10 flex flex-col md:flex-row items-center justify-between mb-10 mt-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-900 mb-2 tracking-tight drop-shadow-lg">Welcome, Admin! 🎸</h1>
          <p className="text-lg text-yellow-800/80 font-medium">Your modern dashboard overview</p>
        </div>
        <div className="mt-8 md:mt-0 flex gap-4">
          <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold px-6 py-3 rounded-2xl shadow-lg hover:from-yellow-500 hover:to-yellow-700 flex items-center gap-2 transition-all">
            <FaPlus /> Add Guitar
          </button>
          <button className="bg-gradient-to-r from-pink-400 to-red-400 text-white font-bold px-6 py-3 rounded-2xl shadow-lg hover:from-pink-500 hover:to-red-500 flex items-center gap-2 transition-all">
            <FaPlus /> Add User
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

      {/* Chart & Highlights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white/80 border border-yellow-100 rounded-3xl shadow-xl p-8 flex flex-col items-center justify-center">
          <h3 className="text-xl font-bold mb-4 text-yellow-900 flex items-center gap-2"><FaChartBar /> Sales Overview</h3>
          <div className="w-full h-56 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center text-2xl text-yellow-300 font-bold border-2 border-dashed border-yellow-200">
            [Chart Coming Soon]
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="bg-gradient-to-r from-yellow-200 to-yellow-100 rounded-2xl p-6 flex items-center gap-4 shadow">
            <FaGuitar className="text-yellow-600 text-3xl" />
            <div>
              <div className="font-bold text-lg text-yellow-900">Top Guitar: Fender Stratocaster</div>
              <div className="text-yellow-700 text-sm">Most sold this month</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-pink-200 to-pink-100 rounded-2xl p-6 flex items-center gap-4 shadow">
            <FaUsers className="text-pink-600 text-3xl" />
            <div>
              <div className="font-bold text-lg text-pink-900">Top User: John Doe</div>
              <div className="text-pink-700 text-sm">Most purchases this month</div>
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
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b last:border-b-0 hover:bg-yellow-50 transition">
                  <td className="py-3 px-4 text-sm font-semibold text-gray-800 flex items-center gap-3">
                    <img src={order.avatar} alt={order.customer} className="w-9 h-9 rounded-full border-2 border-yellow-200 shadow" />
                    {order.customer}
                  </td>
                  <td className="py-3 px-4 text-sm text-yellow-700">{order.guitar}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{order.date}</td>
                  <td className="py-2 px-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow ${order.status === "Confirmed" ? "bg-green-100 text-green-700" : order.status === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-700"}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
