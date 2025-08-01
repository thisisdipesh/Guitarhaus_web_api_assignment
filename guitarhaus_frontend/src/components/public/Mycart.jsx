import React, { useState, useEffect } from "react";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "../common/customer/Footer";
import Navbar from "../common/customer/Navbar";
import axios from "axios";

// Import local guitar images for fallback
import guitar1 from '/src/assets/images/guitar_homepage.jpg';
import guitar2 from '/src/assets/images/guitar2.jpg';
import guitar3 from '/src/assets/images/guitar3.jpg';
import guitar4 from '/src/assets/images/guitar4.jpg';
import guitar5 from '/src/assets/images/guitar5.jpg';

const guitarImages = [guitar1, guitar2, guitar3, guitar4, guitar5];

const MyCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingItem, setRemovingItem] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!token) {
          setError("You must be logged in to see your cart.");
          setLoading(false);
          return;
        }

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
  }, [token]);

  const handleRemoveItem = async (itemId) => {
    if (!token) return;

    setRemovingItem(itemId);
    try {
      await axios.delete(
        `/api/v1/cart/remove/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove item from local state
      setCartItems(prevItems => prevItems.filter(item => item._id !== itemId));
    } catch (err) {
      console.error("Error removing item:", err);
      alert("Failed to remove item from cart.");
    } finally {
      setRemovingItem(null);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (!token || newQuantity < 1) return;

    try {
      const response = await axios.put(
        `/api/v1/cart/update/${itemId}`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update item in local state
      setCartItems(prevItems => 
        prevItems.map(item => 
          item._id === itemId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
      alert("Failed to update quantity.");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-6 py-24">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
            <span className="ml-3 text-lg">Loading your cart...</span>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <FaShoppingCart className="text-yellow-600" size={24} />
          <h1 className="text-3xl font-bold text-gray-800">My Cart</h1>
        </div>
        
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error}</p>
            <button 
              onClick={() => navigate('/login')}
              className="mt-4 bg-yellow-500 text-black px-6 py-2 rounded hover:bg-yellow-600 transition duration-300"
            >
              Login
            </button>
          </div>
        ) : cartItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md border border-gray-200">
                <div className="bg-yellow-500 p-4 rounded-t-lg">
                  <h2 className="text-xl font-bold text-white">
                    Cart Items ({cartItems.length})
                  </h2>
                </div>
                
                <div className="p-4">
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-4">
                          {/* Guitar Image */}
                          <img
                            src={item.guitar && item.guitar.images && item.guitar.images.length > 0 
                              ? `http://localhost:5000/uploads/${item.guitar.images[0]}` 
                              : guitarImages[Math.floor(Math.random() * guitarImages.length)]
                            }
                            alt={item.guitar ? item.guitar.name : "Guitar"}
                            className="w-20 h-20 object-cover rounded"
                            onError={(e) => {
                              e.target.src = guitarImages[Math.floor(Math.random() * guitarImages.length)];
                            }}
                          />
                          
                          {/* Guitar Details */}
                          <div className="flex-grow">
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">
                              {item.guitar ? item.guitar.name : "Guitar"}
                            </h3>
                            <p className="text-gray-600 mb-1">
                              Brand: {item.guitar ? item.guitar.brand : "Unknown"}
                            </p>
                            <p className="text-gray-600">
                              Price: ₹{item.price ? item.price.toLocaleString() : "0"}
                            </p>
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleUpdateQuantity(item._id, Math.max(1, item.quantity - 1))}
                              className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                              className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                            >
                              +
                            </button>
                          </div>
                          
                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            disabled={removingItem === item._id}
                            className="text-red-500 hover:text-red-700 disabled:opacity-50"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                        
                        {/* Item Total */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Item Total:</span>
                            <span className="font-bold text-yellow-600">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md border border-gray-200">
                <div className="bg-yellow-500 p-4 rounded-t-lg">
                  <h2 className="text-xl font-bold text-white">
                    Order Summary
                  </h2>
                </div>
                
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-semibold">₹{calculateTotal().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-semibold text-green-600">Free</span>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-yellow-600">₹{calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-yellow-500 text-white py-3 rounded text-lg font-bold hover:bg-yellow-600 transition duration-300 mt-4"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <FaShoppingCart className="text-gray-400 mx-auto mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some guitars to get started!</p>
            <button
              onClick={() => navigate('/guitars')}
              className="bg-yellow-500 text-black px-6 py-2 rounded font-semibold hover:bg-yellow-600 transition duration-300"
            >
              Browse Guitars
            </button>
          </div>
        )}
      </div>
      
      <Footer />
    </>
  );
};

export default MyCart;
