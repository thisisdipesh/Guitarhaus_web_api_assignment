import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../common/customer/Navbar";
import Footer from "../common/customer/Footer";
import GuitarCard from "../common/customer/GuitarCard";
import { FaGuitar, FaSearch, FaFilter } from "react-icons/fa";

const Guitars = () => {
  const [guitars, setGuitars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchGuitars = async () => {
      try {
        const res = await axios.get("/api/v1/guitars");
        setGuitars(res.data.data);
      } catch (err) {
        setError("Failed to load guitars. Please try again later.");
        console.error("Error fetching guitars:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGuitars();
  }, []);

  // Filtered guitars (UI only, not backend)
  const filteredGuitars = guitars.filter((guitar) => {
    const matchesSearch =
      guitar.name.toLowerCase().includes(search.toLowerCase()) ||
      guitar.brand.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category ? guitar.category === category : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-yellow-100 via-red-100 to-yellow-50 py-16 mb-10 shadow-inner">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8 px-6">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold text-yellow-700 mb-4 drop-shadow-lg flex items-center justify-center md:justify-start gap-3">
              <FaGuitar className="text-red-500" /> Guitar Collection
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-6 max-w-2xl mx-auto md:mx-0">
              Discover the perfect guitar for your music journey. Browse our exclusive collection of acoustic, electric, and classical guitars.
            </p>
            <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
              <div className="flex items-center bg-white rounded-lg shadow px-4 py-2 w-full md:w-80">
                <FaSearch className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search by name or brand..."
                  className="outline-none w-full bg-transparent text-gray-700"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center bg-white rounded-lg shadow px-4 py-2 w-full md:w-60">
                <FaFilter className="text-gray-400 mr-2" />
                <select
                  className="outline-none w-full bg-transparent text-gray-700"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="Acoustic">Acoustic</option>
                  <option value="Electric">Electric</option>
                  <option value="Bass">Bass</option>
                  <option value="Classical">Classical</option>
                  <option value="Ukulele">Ukulele</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src="/src/assets/images/guitar4.jpg"
              alt="Guitar Banner"
              className="w-full max-w-md rounded-2xl shadow-2xl border-4 border-yellow-200"
            />
          </div>
        </div>
      </div>

      {/* Guitars Grid */}
      <div className="container mx-auto px-6 pb-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Explore Our Guitars
        </h2>
        {loading ? (
          <p className="text-center py-10">Loading guitars...</p>
        ) : error ? (
          <p className="text-center text-red-600 py-10">{error}</p>
        ) : filteredGuitars.length === 0 ? (
          <p className="text-center text-gray-600 py-10">No guitars found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredGuitars.map((guitar) => (
              <div key={guitar._id} className="hover:scale-105 transition-transform duration-300">
                <GuitarCard guitarData={guitar} />
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Guitars; 