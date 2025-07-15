import React from "react";
import { Link } from "react-router-dom";
import guitar1 from '/src/assets/images/guitar_homepage.jpg';
import guitar2 from '/src/assets/images/guitar2.jpg';
import guitar3 from '/src/assets/images/guitar3.jpg';
import guitar4 from '/src/assets/images/guitar4.jpg';
import guitar5 from '/src/assets/images/guitar5.jpg';

const guitarImages = [guitar1, guitar2, guitar3, guitar4, guitar5];

const GuitarCard = ({ guitarData }) => {
  // Use the uploaded image if available, otherwise use a random local image
  const backendImage = guitarData.images && guitarData.images.length > 0
    ? `http://localhost:3000/uploads/${guitarData.images[0]}`
    : guitarImages[Math.floor(Math.random() * guitarImages.length)];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <img src={backendImage} alt={guitarData.name || "Guitar for sale"} className="w-full h-52 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{guitarData.name}</h3>
        <p className="text-gray-600 mt-2 line-clamp-2">{guitarData.description}</p>
        <p className="text-gray-700 mt-2 font-medium">🎸 {guitarData.brand}</p>
        <p className="text-gray-700 mt-1">Category: {guitarData.category}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-yellow-700 font-bold text-lg">₹{guitarData.price}</span>
          <Link to={`/guitars/${guitarData._id}`} className="bg-yellow-500 text-black px-4 py-2 rounded-md text-sm hover:bg-yellow-400">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GuitarCard;
