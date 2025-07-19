import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FaArrowUp, FaGuitar, FaStar, FaShippingFast, FaCrown, FaTools } from "react-icons/fa";
import Footer from "../../components/common/customer/Footer";
import Hero from "../../components/common/customer/Hero";
import Navbar from "../../components/common/customer/Navbar";
import GuitarCard from "../common/customer/GuitarCard";

const Home = () => {
  const [showScroll, setShowScroll] = useState(false);
  const [guitars, setGuitars] = useState([]);
  const packagesRef = useRef(null);

  // Show scroll-to-top after scrolling
  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch guitars
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/guitars")
      .then((res) => setGuitars(res.data.data))
      .catch((err) => console.error("Error fetching guitars:", err));
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToPackages = () => {
    packagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Navbar scrollToPackages={scrollToPackages} />
      <Hero />

      {/* Guitars Section */}
      <div ref={packagesRef} className="container mx-auto py-10">
        <h2 className="text-3xl font-bold text-red-800 text-center mb-6">
          Explore Our Guitars
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guitars.map((guitar) => (
            <GuitarCard key={guitar._id} guitarData={guitar} />
          ))}
        </div>
      </div>

      {/* Why Choose GuitarHaus Section */}
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 py-12 mt-12">
        <h2 className="text-3xl font-bold text-center text-yellow-900 mb-8 flex items-center justify-center gap-2">
          <FaGuitar className="text-yellow-700" /> Why Choose GuitarHaus?
        </h2>
        <div className="flex flex-col md:flex-row justify-center gap-8 max-w-5xl mx-auto">
          <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-6 w-full md:w-1/4">
            <FaCrown size={40} className="text-yellow-700 mb-2" />
            <h3 className="font-bold text-lg mb-1">Premium Brands</h3>
            <p className="text-gray-600 text-center">Handpicked guitars from the world's top makers.</p>
          </div>
          <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-6 w-full md:w-1/4">
            <FaTools size={40} className="text-yellow-700 mb-2" />
            <h3 className="font-bold text-lg mb-1">Expert Luthiers</h3>
            <p className="text-gray-600 text-center">Custom setups and repairs by certified professionals.</p>
          </div>
          <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-6 w-full md:w-1/4">
            <FaShippingFast size={40} className="text-yellow-700 mb-2" />
            <h3 className="font-bold text-lg mb-1">Fast Delivery</h3>
            <p className="text-gray-600 text-center">Safe, insured shipping for every order.</p>
          </div>
          <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-6 w-full md:w-1/4">
            <FaStar size={40} className="text-yellow-700 mb-2" />
            <h3 className="font-bold text-lg mb-1">Loved by Musicians</h3>
            <p className="text-gray-600 text-center">Trusted by pros and hobbyists alike.</p>
          </div>
        </div>
      </div>

      {/* Guitar Stories/Testimonial Section */}
      <div className="relative bg-cover bg-center py-16 mt-12" style={{ backgroundImage: 'url(/src/assets/images/guitar3.jpg)' }}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
          <FaGuitar size={50} className="mx-auto mb-4 text-yellow-400 animate-bounce" />
          <h2 className="text-3xl font-bold mb-4">Guitar Stories</h2>
          <p className="text-xl italic mb-6">"I found my dream guitar at GuitarHaus. The quality, service, and passion for music is unmatched!"</p>
          <span className="block font-semibold">— A. Musician, Touring Artist</span>
        </div>
      </div>

      {/* Footer - Now at the very end */}
      <Footer />

      {/* Scroll to Top Button */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-red-700 text-white p-3 rounded-full shadow-lg hover:bg-red-800 transition duration-300 cursor-pointer"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </>
  );
};

export default Home;
