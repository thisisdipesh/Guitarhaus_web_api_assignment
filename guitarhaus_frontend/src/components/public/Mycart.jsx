import React, { useState, useEffect } from "react";
import { FaTrash, FaShoppingCart, FaCreditCard, FaGuitar, FaCrown, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "../common/customer/Footer";
import Navbar from "../common/customer/Navbar";
import axios from "axios";

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
          `http://localhost:3000/api/v1/cart`,
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
        `http://localhost:3000/api/v1/cart/remove/${itemId}`,
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
        `http://localhost:3000/api/v1/cart/update/${itemId}`,
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
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaShoppingCart className="text-yellow-700" size={32} />
            <h1 className="text-4xl font-bold text-yellow-900">My Cart</h1>
          </div>
          <p className="text-center text-yellow-800 text-lg">Review your selected guitars and proceed to checkout</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error}</p>
            <button 
              onClick={() => navigate('/login')}
              className="mt-4 bg-yellow-500 text-black px-6 py-2 rounded-lg hover:bg-yellow-600 transition duration-300"
            >
              Login
            </button>
          </div>
        ) : cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <FaGuitar size={24} />
                    Cart Items ({cartItems.length})
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div key={item._id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex items-start space-x-4">
                          {/* Guitar Image */}
                          <img
                            src={item.guitar && item.guitar.images && item.guitar.images.length > 0 
                              ? `http://localhost:3000/uploads/${item.guitar.images[0]}` 
                              : "https://via.placeholder.com/150"
                            }
                            alt={item.guitar ? item.guitar.name : "Guitar"}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          
                          {/* Guitar Details */}
                          <div className="flex-grow">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                              {item.guitar ? item.guitar.name : "Guitar"}
                            </h3>
                            <div className="space-y-1 text-gray-600">
                              <div className="flex items-center gap-2">
                                <FaCrown className="text-yellow-600" size={14} />
                                <span>Brand: {item.guitar ? item.guitar.brand : "-"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FaStar className="text-yellow-600" size={14} />
                                <span>Price: ₹{item.guitar ? item.guitar.price : "-"}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Quantity and Actions */}
                          <div className="flex flex-col items-end space-y-3">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleUpdateQuantity(item._id, Math.max(1, item.quantity - 1))}
                                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition duration-200"
                              >
                                -
                              </button>
                              <span className="w-12 text-center font-semibold">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition duration-200"
                              >
                                +
                              </button>
                            </div>
                            
                            <button
                              onClick={() => handleRemoveItem(item._id)}
                              disabled={removingItem === item._id}
                              className="text-red-500 hover:text-red-700 transition duration-200 flex items-center gap-1 disabled:opacity-50"
                            >
                              <FaTrash size={14} />
                              {removingItem === item._id ? "Removing..." : "Remove"}
                            </button>
                          </div>
                        </div>
                        
                        {/* Item Total */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Item Total:</span>
                            <span className="text-lg font-bold text-yellow-700">₹{item.price * item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-8">
                <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <FaCreditCard size={24} />
                    Order Summary
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-semibold">₹{calculateTotal()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-semibold text-green-600">Free</span>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-yellow-700">₹{calculateTotal()}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-4 rounded-lg text-lg font-bold hover:from-yellow-600 hover:to-yellow-700 transition duration-300 shadow-lg flex items-center justify-center gap-3 mt-6"
                  >
                    <FaCreditCard size={20} />
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <FaShoppingCart className="text-gray-400 mx-auto mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some guitars to get started!</p>
            <button
              onClick={() => navigate('/guitars')}
              className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition duration-300"
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
