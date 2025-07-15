import React from "react";
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import Footer from "../../components/common/customer/Footer";
import Navbar from "../../components/common/customer/Navbar";

const Contact = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">Contact Us</h1>
        <p className="text-lg text-gray-600 text-center mb-12">
          Have questions? We'd love to hear from you.
        </p>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="flex justify-center mb-4">
              <FaPhone className="text-red-800 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold">Phone</h3>
            <p className="text-gray-700 mt-2">+1 (123) 456-7890</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="flex justify-center mb-4">
              <FaEnvelope className="text-red-800 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold">Email</h3>
            <p className="text-gray-700 mt-2">support@trek.com</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="flex justify-center mb-4">
              <FaMapMarkerAlt className="text-red-800 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold">Address</h3>
            <p className="text-gray-700 mt-2">123 Trek Lane, Adventure City</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="mt-12 bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Send Us a Message
          </h2>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-800 font-semibold">Name</label>
              <input type="text" id="name" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-800 font-semibold">Email</label>
              <input type="email" id="email" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-800 font-semibold">Message</label>
              <textarea id="message" rows="5" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"></textarea>
            </div>
            <button type="submit" className="w-full bg-red-800 text-white py-2 px-6 rounded-md hover:bg-red-700 transition duration-300">
              Send Message
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact; 
