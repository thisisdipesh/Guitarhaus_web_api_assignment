import React, { useState } from "react";
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaGuitar, FaMusic, FaHeadphones, FaClock, FaStar, FaCheckCircle, FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";
import Footer from "../../components/common/customer/Footer";
import Navbar from "../../components/common/customer/Navbar";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    alert("Thank you for your message! We'll get back to you soon. 🎸");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaGuitar className="text-yellow-700" size={40} />
            <h1 className="text-5xl font-bold text-yellow-900">Get in Touch</h1>
          </div>
          <p className="text-xl text-yellow-800 max-w-2xl mx-auto">
            Have questions about our guitars? Need help choosing the perfect instrument? 
            We're here to help you find your perfect sound! 🎵
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-yellow-200">
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <FaMusic size={24} />
                  Contact Information
                </h2>
              </div>
              
              <div className="p-8 space-y-6">
                {/* Phone */}
                <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
                  <div className="bg-yellow-600 p-3 rounded-full">
                    <FaPhone className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Call Us</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-sm text-yellow-600">Available 9 AM - 8 PM</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
                  <div className="bg-yellow-600 p-3 rounded-full">
                    <FaEnvelope className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Email Us</h3>
                    <p className="text-gray-600">info@guitarhaus.com</p>
                    <p className="text-sm text-yellow-600">We'll respond within 24 hours</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
                  <div className="bg-yellow-600 p-3 rounded-full">
                    <FaMapMarkerAlt className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Visit Our Store</h3>
                    <p className="text-gray-600">123 Guitar Street, Music City</p>
                    <p className="text-sm text-yellow-600">Nashville, TN 37201</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
                  <div className="bg-yellow-600 p-3 rounded-full">
                    <FaClock className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Store Hours</h3>
                    <p className="text-gray-600">Mon-Sat: 10 AM - 8 PM</p>
                    <p className="text-sm text-yellow-600">Sunday: 12 PM - 6 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Choose GuitarHaus */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-yellow-200">
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <FaStar size={24} />
                  Why Choose GuitarHaus?
                </h2>
              </div>
              
              <div className="p-8 space-y-4">
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-green-600" size={16} />
                  <span className="text-gray-700">Premium quality guitars from top brands</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-green-600" size={16} />
                  <span className="text-gray-700">Expert advice from professional musicians</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-green-600" size={16} />
                  <span className="text-gray-700">Free setup and maintenance services</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-green-600" size={16} />
                  <span className="text-gray-700">Try before you buy - test any guitar</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-green-600" size={16} />
                  <span className="text-gray-700">Lifetime warranty on all instruments</span>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-yellow-200">
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <FaHeadphones size={24} />
                  Follow Our Music
                </h2>
              </div>
              
              <div className="p-8">
                <div className="flex space-x-4 justify-center">
                  <a href="#" className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition duration-300">
                    <FaFacebook size={20} />
                  </a>
                  <a href="#" className="bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700 transition duration-300">
                    <FaInstagram size={20} />
                  </a>
                  <a href="#" className="bg-blue-400 text-white p-3 rounded-full hover:bg-blue-500 transition duration-300">
                    <FaTwitter size={20} />
                  </a>
                </div>
                <p className="text-center text-gray-600 mt-4">
                  Follow us for guitar tips, new arrivals, and exclusive offers!
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-yellow-200">
            <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <FaGuitar size={24} />
                Send Us a Message
              </h2>
            </div>
            
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-800 font-semibold mb-2 flex items-center gap-2">
                    <FaGuitar className="text-yellow-600" size={14} />
                    Your Name
                  </label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-200"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-800 font-semibold mb-2 flex items-center gap-2">
                    <FaEnvelope className="text-yellow-600" size={14} />
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-200"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-gray-800 font-semibold mb-2 flex items-center gap-2">
                    <FaMusic className="text-yellow-600" size={14} />
                    Subject
                  </label>
                  <select 
                    id="subject" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-200"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="guitar-inquiry">Guitar Inquiry</option>
                    <option value="purchase-help">Purchase Help</option>
                    <option value="maintenance">Maintenance & Repair</option>
                    <option value="lessons">Guitar Lessons</option>
                    <option value="general">General Question</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-gray-800 font-semibold mb-2 flex items-center gap-2">
                    <FaHeadphones className="text-yellow-600" size={14} />
                    Your Message
                  </label>
                  <textarea 
                    id="message" 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-200"
                    placeholder="Tell us about your guitar needs or questions..."
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 px-6 rounded-lg text-lg font-bold hover:from-yellow-600 hover:to-yellow-700 transition duration-300 shadow-lg flex items-center justify-center gap-3"
                >
                  <FaGuitar size={20} />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Contact; 
