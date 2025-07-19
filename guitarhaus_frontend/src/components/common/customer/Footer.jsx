import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaGuitar } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-red-900 text-white py-12 mt-12">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FaGuitar className="text-yellow-400" size={24} />
            <h3 className="text-xl font-bold">GuitarHaus</h3>
          </div>
          <p className="text-gray-300 leading-relaxed">
            Discover amazing guitars at exclusive deals. Your trusted partner for quality instruments and exceptional service.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="space-y-3">
            <li><Link to="/" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200">Home</Link></li>
            <li><Link to="/guitars" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200">Guitars</Link></li>
            <li><Link to="/review" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200">Reviews</Link></li>
            <li><Link to="/contact" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200">Contact</Link></li>
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h3 className="text-xl font-bold mb-4">Legal</h3>
          <ul className="space-y-3">
            <li><Link to="/faq" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200">FAQ</Link></li>
            <li><Link to="/terms" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200">Terms & Conditions</Link></li>
            <li><Link to="/privacy" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200">Privacy Policy</Link></li>
            <li><Link to="/aboutus" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200">About Us</Link></li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-xl font-bold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a 
              href="#" 
              className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 p-2 hover:bg-red-800 rounded-full"
              aria-label="Facebook"
            >
              <FaFacebook size={20} />
            </a>
            <a 
              href="#" 
              className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 p-2 hover:bg-red-800 rounded-full"
              aria-label="Instagram"
            >
              <FaInstagram size={20} />
            </a>
            <a 
              href="#" 
              className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 p-2 hover:bg-red-800 rounded-full"
              aria-label="Twitter"
            >
              <FaTwitter size={20} />
            </a>
            <a 
              href="#" 
              className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 p-2 hover:bg-red-800 rounded-full"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="border-t border-red-800 mt-8 pt-8">
        <div className="text-center text-gray-400">
          © {new Date().getFullYear()} GuitarHaus. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
