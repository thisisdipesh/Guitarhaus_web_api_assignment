import { Bell, LogOut, User } from "lucide-react";
import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-yellow-500 text-black p-4 flex justify-between items-center shadow-lg rounded-b-xl">
      {/* Admin Panel Title */}
      <h1 className="text-2xl font-extrabold tracking-wider font-mono">Admin Dashboard</h1>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Notifications Icon */}
        <button className="relative p-2 rounded-full hover:bg-gray-800">
          <Bell size={20} />
          <span className="absolute top-0 right-0 bg-red-500 text-xs text-white px-1.5 py-0.5 rounded-full">3</span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800">
            <User size={20} />
            <span className="hidden md:inline">Admin</span>
          </button>

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg hidden group-hover:block">
            <button className="block w-full px-4 py-2 text-left hover:bg-gray-700">Profile</button>
            <button className="block w-full px-4 py-2 text-left hover:bg-gray-700">Settings</button>
            <button className="block w-full px-4 py-2 text-left hover:bg-red-700 flex items-center gap-2">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
