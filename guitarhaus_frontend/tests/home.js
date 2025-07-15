import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import Footer from "../../components/common/customer/Footer";
import Hero from "../../components/common/customer/Hero";
import Navbar from "../../components/common/customer/Navbar";
import PackageCard from "../../components/common/customer/PackageCard"; // Ensure correct path

const Home = () => {
  const [showScroll, setShowScroll] = useState(false);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const packagesRef = useRef(null);

  // Handle Scroll Event
  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch Packages from API
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/package")
      .then((res) => {
        setPackages(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching packages. Please try again later.");
        setLoading(false);
      });
  }, []);

  // Scroll to Top Function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Function to Scroll to Packages Section
  const scrollToPackages = () => {
    packagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Navbar scrollToPackages={scrollToPackages} />
      <Hero />

      {/* Packages Section */}
      <div ref={packagesRef} className="container mx-auto py-10 px-6">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          Explore Our Packages
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading packages...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : packages.length === 0 ? (
          <p className="text-center text-gray-600">No packages available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <PackageCard key={pkg._id} packageData={pkg} />
            ))}
          </div>
        )}
      </div>

      <Footer />

      {/* Scroll to Top Button */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition duration-300 cursor-pointer"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </>
  );
};

export default Home;