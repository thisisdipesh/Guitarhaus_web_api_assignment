import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-red-900 text-white py-8 mt-12">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About Section */}
        <div>
          <h3 className="text-xl font-bold mb-4">Trek</h3>
          <p className="text-gray-400">
            Discover amazing places at exclusive deals.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-red-400">Home</Link></li>
            <li><Link to="/package" className="hover:text-red-400">Packages</Link></li>
            <li><Link to="/reviews" className="hover:text-red-400">Reviews</Link></li>
            <li><Link to="/contact" className="hover:text-red-400">Contact</Link></li>
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h3 className="text-xl font-bold mb-4">Legal</h3>
          <ul className="space-y-2">
            <li><Link to="/faq" className="hover:text-red-400">FAQ</Link></li>
            <li><Link to="/terms" className="hover:text-red-400">Terms & Conditions</Link></li>
            <li><Link to="/privacy" className="hover:text-red-400">Privacy Policy</Link></li>
            <li><Link to="/aboutus" className="hover:text-red-400">About Us</Link></li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-xl font-bold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-red-400"><FaFacebook size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-red-400"><FaInstagram size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-red-400"><FaTwitter size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-red-400"><FaLinkedin size={20} /></a>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-500 mt-8">
        &copy; {new Date().getFullYear()} Trek. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
