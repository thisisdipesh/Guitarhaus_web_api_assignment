import React from "react";
import { FaGuitar, FaClipboardList, FaDollarSign, FaUsers, FaPlus, FaChartBar } from 'react-icons/fa';

const Dashboard = () => {
  // Mock Data (Replace with API Fetch)
  const stats = [
    { id: 1, title: "Total Users", value: "1,240", icon: <FaUsers size={28} />, color: "bg-gradient-to-r from-red-500 to-pink-500" },
    { id: 2, title: "Total Guitars", value: "58", icon: <FaGuitar size={28} />, color: "bg-gradient-to-r from-yellow-500 to-yellow-400" },
    { id: 3, title: "Total Bookings", value: "3,450", icon: <FaClipboardList size={28} />, color: "bg-gradient-to-r from-blue-500 to-blue-400" },
    { id: 4, title: "Total Revenue", value: "$12,480", icon: <FaDollarSign size={28} />, color: "bg-gradient-to-r from-green-500 to-green-400" },
  ];

  const recentBookings = [
    { id: 1, customer: "John Doe", guitar: "Fender Stratocaster", date: "2024-08-15", status: "Confirmed" },
    { id: 2, customer: "Jane Smith", guitar: "Gibson Les Paul", date: "2024-08-14", status: "Pending" },
    { id: 3, customer: "Mike Johnson", guitar: "Ibanez RG", date: "2024-08-13", status: "Canceled" },
    { id: 4, customer: "Emily Davis", guitar: "Yamaha Pacifica", date: "2024-08-12", status: "Confirmed" },
  ];

  return (
    <div className="space-y-8 p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-red-400 shadow-lg rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">Welcome back, Admin! 🎸</h1>
          <p className="text-white text-lg mt-2 opacity-90">Here's a summary of your dashboard.</p>
        </div>
        <div className="mt-6 md:mt-0 flex gap-4">
          <button className="bg-white text-yellow-600 font-bold px-6 py-3 rounded-xl shadow hover:bg-yellow-100 flex items-center gap-2 transition">
            <FaPlus /> Add Guitar
          </button>
          <button className="bg-white text-red-600 font-bold px-6 py-3 rounded-xl shadow hover:bg-red-100 flex items-center gap-2 transition">
            <FaPlus /> Add User
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.id} className={`rounded-2xl shadow-lg p-6 flex flex-col items-center ${stat.color} text-white relative overflow-hidden`}> 
            <div className="absolute right-4 top-4 opacity-20 text-6xl">{stat.icon}</div>
            <div className="z-10 flex flex-col items-center">
              <span className="text-3xl font-extrabold drop-shadow-lg">{stat.value}</span>
              <span className="text-lg font-semibold mt-2 opacity-90">{stat.title}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-8 mt-8">
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2 text-gray-800 flex items-center gap-2"><FaChartBar /> Sales Overview</h3>
          <div className="w-full h-48 bg-gradient-to-r from-yellow-100 to-red-100 rounded-xl flex items-center justify-center text-2xl text-gray-400 font-bold">
            [Chart Coming Soon]
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-yellow-100 rounded-xl p-4 flex items-center gap-4">
            <FaGuitar className="text-yellow-600 text-2xl" />
            <div>
              <div className="font-bold text-lg text-yellow-800">Top Guitar: Fender Stratocaster</div>
              <div className="text-yellow-700 text-sm">Most sold this month</div>
            </div>
          </div>
          <div className="bg-red-100 rounded-xl p-4 flex items-center gap-4">
            <FaUsers className="text-red-600 text-2xl" />
            <div>
              <div className="font-bold text-lg text-red-800">Top User: John Doe</div>
              <div className="text-red-700 text-sm">Most purchases this month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white shadow-lg rounded-2xl p-8 mt-8">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Recent Bookings</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left rounded-xl">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-3 px-4 text-sm font-semibold">CUSTOMER</th>
                <th className="py-3 px-4 text-sm font-semibold">GUITAR</th>
                <th className="py-3 px-4 text-sm font-semibold">DATE</th>
                <th className="py-3 px-4 text-sm font-semibold">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-semibold text-gray-800">{booking.customer}</td>
                  <td className="py-3 px-4 text-sm text-yellow-700">{booking.guitar}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{booking.date}</td>
                  <td className={`py-2 font-semibold ${booking.status === "Confirmed" ? "text-green-600" : booking.status === "Pending" ? "text-yellow-600" : "text-red-600"}`}>
                    {booking.status}
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
