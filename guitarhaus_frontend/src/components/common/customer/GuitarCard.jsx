import React from "react";
import { Link } from "react-router-dom";
import { FaGuitar, FaEye, FaHeart } from "react-icons/fa";
import guitar1 from '/src/assets/images/guitar_homepage.jpg';
import guitar2 from '/src/assets/images/guitar2.jpg';
import guitar3 from '/src/assets/images/guitar3.jpg';
import guitar4 from '/src/assets/images/guitar4.jpg';
import guitar5 from '/src/assets/images/guitar5.jpg';

const guitarImages = [guitar1, guitar2, guitar3, guitar4, guitar5];

const GuitarCard = ({ guitarData }) => {
  // Use the uploaded image if available, otherwise use a random local image
  const imageSrc = guitarData.images && guitarData.images.length > 0
    ? `http://localhost:3000/uploads/${guitarData.images[0]}`
    : guitarImages[Math.floor(Math.random() * guitarImages.length)];

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      {/* Image */}
      <div className="relative">
        <img 
          src={imageSrc} 
          alt={guitarData.name || "Guitar for sale"} 
          className="w-full h-48 object-cover rounded-t-lg" 
          onError={(e) => {
            e.target.src = guitarImages[Math.floor(Math.random() * guitarImages.length)];
          }}
        />
        
        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
            {guitarData.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-2">
          <FaGuitar className="text-yellow-600" />
          <span className="text-sm font-medium text-gray-600 uppercase">
            {guitarData.brand}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          {guitarData.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {guitarData.description || "Experience exceptional sound quality and craftsmanship with this premium guitar."}
        </p>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-yellow-600">
              ₹{guitarData.price?.toLocaleString()}
            </span>
            <p className="text-xs text-gray-500">Free Shipping</p>
          </div>
          
          <Link 
            to={`/guitars/${guitarData._id}`} 
            className="bg-yellow-500 text-white px-4 py-2 rounded font-semibold hover:bg-yellow-600 transition-colors duration-300"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GuitarCard;
