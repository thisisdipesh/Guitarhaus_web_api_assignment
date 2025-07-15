import React, { useState, useEffect } from "react";
import Footer from "../common/customer/Footer";
import Navbar from "../common/customer/Navbar";
import axios from "axios";

const MyCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId || !token) {
          setError("You must be logged in to see your cart.");
          setLoading(false);
          return;
        }

        // Replace with actual cart API endpoint
        const response = await axios.get(
          `/api/v1/cart`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCartItems(response.data.data.items || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch cart. Please try again later.");
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          My Cart
        </h1>
        <p className="text-lg text-center text-gray-600 mb-12">
          Review your selected guitars and proceed to checkout.
        </p>

        <div className="flex flex-col items-center space-y-6">
          {loading ? (
            <p className="text-gray-800">Loading your cart...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item._id}
                className="w-full max-w-4xl p-6 bg-white shadow-lg rounded-lg flex items-start space-x-6"
              >
                <img
                  src={item.guitar && item.guitar.images && item.guitar.images.length > 0 ? `http://localhost:3000/uploads/${item.guitar.images[0]}` : "https://via.placeholder.com/150"}
                  alt={item.guitar ? item.guitar.name : "Guitar"}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="flex-grow">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {item.guitar ? item.guitar.name : "Guitar"}
                  </h2>
                  <p className="text-gray-600">
                    Brand: {item.guitar ? item.guitar.brand : "-"}
                  </p>
                  <p className="text-gray-600">
                    Price: ₹{item.guitar ? item.guitar.price : "-"}
                  </p>
                  <p className="text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-800 text-center">
              Your cart is empty.
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyCart;
