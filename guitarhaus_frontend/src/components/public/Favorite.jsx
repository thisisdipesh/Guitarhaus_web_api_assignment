import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import Footer from "../../components/common/customer/Footer";
import Navbar from "../../components/common/customer/Navbar";
import { Link } from "react-router-dom";
import guitar1 from '/src/assets/images/guitar_homepage.jpg';
import guitar2 from '/src/assets/images/guitar2.jpg';
import guitar3 from '/src/assets/images/guitar3.jpg';
import guitar4 from '/src/assets/images/guitar4.jpg';
import guitar5 from '/src/assets/images/guitar5.jpg';
const guitarImages = [guitar1, guitar2, guitar3, guitar4, guitar5];

const Favorite = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const response = await axios.get("http://localhost:3000/api/v1/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // response.data.data is an array of wishlist items, each with a 'guitar' property
        if (response.data && Array.isArray(response.data.data)) {
          setFavorites(response.data.data);
        } else {
          setFavorites([]);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const removeFavorite = async (guitarId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/v1/wishlist/remove/${guitarId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites((prevFavorites) => prevFavorites.filter((item) => item.guitar && item.guitar._id !== guitarId));
    } catch (error) {
      console.error("Error removing wishlist item:", error);
    }
  };
  

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-25 h-[500px]">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Your Favorite Guitars ❤️</h1>

        {loading ? (
          <p className="text-center text-gray-800 text-lg">Loading favorites...</p>
        ) : favorites.length === 0 ? (
          <p className="text-center text-gray-800 text-lg">No favorite guitars yet.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {favorites.map((item) => item.guitar && (
              <div key={item.guitar._id} className="bg-white shadow-lg rounded-lg flex items-center p-4">
                <img src={item.guitar.images && item.guitar.images.length > 0 ? `http://localhost:3000/uploads/${item.guitar.images[0]}` : guitarImages[Math.floor(Math.random() * guitarImages.length)]} alt="Guitar for sale" className="w-32 h-32 object-cover rounded-md" />
                <div className="ml-6 flex-grow">
                  <h3 className="text-2xl font-bold text-gray-800">{item.guitar.name || item.guitar.title}</h3>
                  <p className="text-gray-800 mt-1">{item.guitar.description}</p>
                  <p className="text-lg font-semibold text-red-800 mt-2">₹{item.guitar.price}</p>
                </div>
                <button
                  onClick={() => removeFavorite(item.guitar._id)}
                  className="bg-red-800 text-white py-2 px-4 rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <FaTrash /> Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
    
  );
};

export default Favorite; 
