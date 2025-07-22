import React, { useState } from "react";
import Footer from "../../components/common/customer/Footer";
import Navbar from "../../components/common/customer/Navbar";
import axios from "axios";
import { useEffect } from "react";
import { FaGuitar, FaUser, FaEnvelope, FaPhone, FaImage } from "react-icons/fa";

const EditProfile = () => {
  const [user, setUser] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if (!userId) return setError("User ID not found");
        const response = await axios.get(`http://localhost:3000/api/v1/customers/getCustomer/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.data);
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfilePic(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const formData = new FormData();
      formData.append("fname", user.fname);
      formData.append("lname", user.lname);
      formData.append("email", user.email);
      formData.append("phone", user.phone);
      if (newProfilePic) formData.append("profilePicture", newProfilePic);
      const response = await axios.put(
        `http://localhost:3000/api/v1/customers/updateCustomer/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage("Profile updated successfully!");
      setUser(response.data.data);
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-300 flex flex-col items-center justify-center py-12">
        {/* Decorative Guitar SVG */}
        <div className="absolute left-0 top-0 opacity-10 z-0">
          <FaGuitar size={220} color="#b8860b" />
        </div>
        <h1 className="text-4xl font-extrabold text-yellow-900 text-center mb-2 flex items-center justify-center gap-3 z-10">
          <FaGuitar className="inline-block text-yellow-700" size={36} /> Edit Your GuitarHaus Profile
        </h1>
        <p className="text-lg text-yellow-800 text-center mb-8 z-10">Keep your details up to date and rock on! 🎸</p>
        {message && <div className="text-green-700 text-center mb-4 z-10">{message}</div>}
        {error && <div className="text-red-700 text-center mb-4 z-10">{error}</div>}
        <div className="max-w-lg w-full mx-auto bg-white/90 shadow-2xl rounded-3xl p-8 border-4 border-yellow-200 z-10">
          {/* Profile Picture as Guitar Soundhole */}
          <div className="flex flex-col items-center mb-8 relative">
            <div className="relative flex items-center justify-center">
              <div className="w-32 h-32 bg-yellow-200 rounded-full border-8 border-yellow-700 flex items-center justify-center shadow-inner relative">
                <img
                  src={newProfilePic ? URL.createObjectURL(newProfilePic) : user.image ? `http://localhost:3000/uploads/${user.image}` : "https://via.placeholder.com/100"}
                  alt="Profile"
                  className="w-24 h-24 object-cover rounded-full border-4 border-yellow-900 shadow-lg"
                  style={{ boxShadow: '0 0 0 8px #fff, 0 0 0 12px #b8860b' }}
                />
                <FaGuitar className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-yellow-700" size={32} />
              </div>
              <label htmlFor="profilePicUpload" className="absolute bottom-0 right-0 bg-yellow-700 text-white p-2 rounded-full cursor-pointer shadow-lg border-2 border-white">
                <FaImage size={18} />
                <input id="profilePicUpload" type="file" className="hidden" onChange={handleProfilePicChange} />
              </label>
            </div>
            <span className="mt-3 text-yellow-900 font-semibold">Profile Picture</span>
          </div>
          {/* Profile Update Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-yellow-900 font-bold mb-1 flex items-center gap-2"><FaUser />First Name</label>
                <input
                  type="text"
                  name="fname"
                  value={user.fname}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-yellow-50 text-yellow-900 font-semibold"
                  required
                />
              </div>
              <div className="w-1/2">
                <label className="block text-yellow-900 font-bold mb-1 flex items-center gap-2"><FaUser />Last Name</label>
                <input
                  type="text"
                  name="lname"
                  value={user.lname}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-yellow-50 text-yellow-900 font-semibold"
                />
              </div>
            </div>
            <div>
              <label className="block text-yellow-900 font-bold mb-1 flex items-center gap-2"><FaEnvelope />Email</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-yellow-50 text-yellow-900 font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-yellow-900 font-bold mb-1 flex items-center gap-2"><FaPhone />Phone Number</label>
              <input
                type="text"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-yellow-50 text-yellow-900 font-semibold"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-white py-3 px-4 rounded-xl text-lg font-bold hover:from-yellow-700 hover:to-yellow-800 transition duration-300 shadow-lg flex items-center justify-center gap-3 mt-4"
            >
              <FaGuitar size={20} /> Save Changes
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditProfile;
