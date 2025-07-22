import axios from "axios";
import React, { useEffect, useState } from "react";
import Footer from "../common/customer/Footer";
import Navbar from "../common/customer/Navbar";
import { FaGuitar, FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Myprofile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage

        if (!userId) {
          console.error("User ID not found in local storage");
          return;
        }

        const response = await axios.get(`http://localhost:3000/api/v1/customers/getCustomer/${userId}`, {
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
      <div className="relative min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-300 flex flex-col items-center justify-center py-12">
        {/* Decorative Guitar SVG */}
        <div className="absolute left-0 top-0 opacity-10 z-0">
          <FaGuitar size={220} color="#b8860b" />
        </div>
        <h1 className="text-4xl font-extrabold text-yellow-900 text-center mb-2 flex items-center justify-center gap-3 z-10">
          <FaGuitar className="inline-block text-yellow-700" size={36} /> Your GuitarHaus Profile
        </h1>
        <p className="text-lg text-yellow-800 text-center mb-8 z-10">Welcome to your musical journey! 🎸</p>
        <div className="max-w-2xl w-full mx-auto bg-white/90 shadow-2xl rounded-3xl p-8 border-4 border-yellow-200 z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Picture as Guitar Soundhole */}
            <div className="relative flex flex-col items-center md:w-1/3 w-full">
              <div className="w-32 h-32 bg-yellow-200 rounded-full border-8 border-yellow-700 flex items-center justify-center shadow-inner relative">
                <img
                  src={user && user.image ? `http://localhost:3000/uploads/${user.image}` : "https://via.placeholder.com/100"}
                  alt="Profile"
                  className="w-24 h-24 object-cover rounded-full border-4 border-yellow-900 shadow-lg"
                  style={{ boxShadow: '0 0 0 8px #fff, 0 0 0 12px #b8860b' }}
                />
                <FaGuitar className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-yellow-700" size={32} />
              </div>
              <span className="mt-3 text-yellow-900 font-semibold">Profile</span>
              <span className="text-yellow-800 mt-2">{user && user.email}</span>
            </div>
            {/* Profile Details */}
            <div className="md:w-2/3 w-full mt-6 md:mt-0">
              <h3 className="text-2xl font-bold text-yellow-900 mb-4 flex items-center gap-2"><FaUser />User Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-yellow-50 p-4 rounded-lg flex flex-col gap-1 border border-yellow-200">
                  <label className="block text-yellow-700 font-semibold flex items-center gap-2"><FaUser />First Name</label>
                  <p className="text-yellow-900 font-bold">{user && user.fname}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg flex flex-col gap-1 border border-yellow-200">
                  <label className="block text-yellow-700 font-semibold flex items-center gap-2"><FaUser />Last Name</label>
                  <p className="text-yellow-900 font-bold">{user && user.lname}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg flex flex-col gap-1 border border-yellow-200">
                  <label className="block text-yellow-700 font-semibold flex items-center gap-2"><FaPhone />Phone</label>
                  <p className="text-yellow-900 font-bold">{user && user.phone}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg flex flex-col gap-1 border border-yellow-200">
                  <label className="block text-yellow-700 font-semibold flex items-center gap-2"><FaEnvelope />Email</label>
                  <p className="text-yellow-900 font-bold">{user && user.email}</p>
                </div>
              </div>
              <button className="mt-8 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white py-3 px-8 rounded-xl text-lg font-bold hover:from-yellow-700 hover:to-yellow-800 transition duration-300 shadow-lg flex items-center gap-3" onClick={() => navigate('/editprofile')}>
                <FaGuitar size={20} /> Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Myprofile;
