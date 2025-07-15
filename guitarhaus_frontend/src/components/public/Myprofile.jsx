import axios from "axios";
import React, { useEffect, useState } from "react";
import Footer from "../common/customer/Footer";
import Navbar from "../common/customer/Navbar";

const Myprofile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage

        if (!userId) {
          console.error("User ID not found in local storage");
          return;
        }

        const response = await axios.get(`http://localhost:3000/api/v1/auth/getCustomer/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data.data); // Updated to use response.data.data
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-25 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Your Profile</h1>

        {loading ? (
          <p className="text-gray-800 text-lg">Loading profile...</p>
        ) : user ? (
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              {/* Profile Picture */}
              <div className="md:w-1/3 text-center">
                <img
                  src={`http://localhost:3000/${user.profileImage}`}
                  alt="Profile"
                  className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-red-500"
                />
                <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>

              {/* Profile Details */}
              <div className="md:w-2/3 md:pl-8 mt-6 md:mt-0">
                <h3 className="text-xl font-bold text-gray-800 mb-4">User Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <label className="block text-gray-600 font-semibold">Username</label>
                    <p className="text-gray-800">{user.username}</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <label className="block text-gray-600 font-semibold">Phone</label>
                    <p className="text-gray-800">{user.phone}</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg col-span-2">
                    <label className="block text-gray-600 font-semibold">Address</label>
                    <p className="text-gray-800">{user.address}</p>
                  </div>
                </div>
                <button className="mt-6 bg-red-800 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition duration-300">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-800 text-lg">Failed to load profile.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Myprofile;
