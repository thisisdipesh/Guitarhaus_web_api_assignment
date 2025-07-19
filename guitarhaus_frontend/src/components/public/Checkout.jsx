import axios from "axios";
import KhaltiCheckout from "khalti-checkout-web";
import React, { useEffect, useState } from "react";
import { FaGuitar, FaCreditCard, FaUser, FaEnvelope, FaPhone, FaShoppingCart, FaCheckCircle, FaStar, FaCrown, FaTrash } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../../components/common/customer/Footer";
import Navbar from "../../components/common/customer/Navbar";
import guitar1 from '/src/assets/images/guitar_homepage.jpg';
import guitar2 from '/src/assets/images/guitar2.jpg';
import guitar3 from '/src/assets/images/guitar3.jpg';
import guitar4 from '/src/assets/images/guitar4.jpg';
import guitar5 from '/src/assets/images/guitar5.jpg';
const guitarImages = [guitar1, guitar2, guitar3, guitar4, guitar5];

const Checkout = () => {
  const { id } = useParams(); // Get package ID from URL (optional)
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    tickets: 1,
    pickupLocation: "",
    paymentMethod: "khalti",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCartCheckout, setIsCartCheckout] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          // Single guitar checkout
          const res = await axios.get(`http://localhost:3000/api/v1/guitars/${id}`);
          setPackageData(res.data.data);
          setIsCartCheckout(false);
        } else {
          // Cart checkout
          if (!token) {
            setError("You must be logged in to checkout.");
            setLoading(false);
            return;
          }

          const cartRes = await axios.get(`http://localhost:3000/api/v1/cart`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          setCartItems(cartRes.data.data.items || []);
          setIsCartCheckout(true);
        }
      } catch (err) {
        setError("Failed to load checkout details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Get the guitar image from backend or fallback to local images
  const getGuitarImage = (guitar) => {
    if (guitar?.images && guitar.images.length > 0) {
      return `http://localhost:3000/uploads/${guitar.images[0]}`;
    }
    return guitarImages[Math.floor(Math.random() * guitarImages.length)];
  };

  // Calculate total for cart checkout
  const calculateCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  // Khalti Payment Configuration
  const khaltiConfig = {
    publicKey: "test_public_key_dc74e0fd57cb46cd93832aee0a390234",
    productIdentity: isCartCheckout ? "cart_checkout" : packageData?._id,
    productName: isCartCheckout ? "GuitarHaus Cart" : (packageData?.name || packageData?.title || "Guitar"),
    productUrl: isCartCheckout ? `http://localhost:5173/mycart` : `http://localhost:5173/guitars/${packageData?._id}`,
    eventHandler: {
      onSuccess(payload) {
        console.log("Payment Success:", payload);

        // Save booking details after payment success
        const bookingData = {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          paymentMethod: "khalti",
          paymentId: payload.idx,
        };

        if (isCartCheckout) {
          // Cart checkout - save multiple bookings
          bookingData.cartItems = cartItems;
        } else {
          // Single guitar checkout
          bookingData.packageId = id;
          bookingData.tickets = formData.tickets;
        }

        axios
          .post("http://localhost:3000/api/v1/bookings", bookingData)
          .then(() => {
            alert("Order Successful! 🚀");
            navigate('/');
          })
          .catch(() => {
            alert("Order saved failed, but payment was successful.");
          });
      },
      onError(error) {
        console.log("Payment Error:", error);
        alert("Payment Failed. Please try again.");
      },
      onClose() {
        console.log("Khalti popup closed.");
      },
    },
    paymentPreference: ["KHALTI"],
  };

  const khaltiCheckout = new KhaltiCheckout(khaltiConfig);

  const handlePayment = () => {
    if (isCartCheckout && cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const totalAmount = isCartCheckout ? calculateCartTotal() : (packageData?.price * formData.tickets);
    khaltiCheckout.show({ amount: totalAmount * 100 }); // Convert to paisa
  };

  if (loading) return <p className="text-center py-10 text-lg">Loading checkout details...</p>;
  if (error) return <p className="text-center text-red-600 py-10">{error}</p>;
  if (isCartCheckout && cartItems.length === 0) return <p className="text-center py-10 text-lg">Your cart is empty.</p>;

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaShoppingCart className="text-yellow-700" size={32} />
            <h1 className="text-4xl font-bold text-yellow-900">Checkout</h1>
          </div>
          <p className="text-center text-yellow-800 text-lg">
            {isCartCheckout ? "Complete your guitar purchase" : "Complete your guitar purchase"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-yellow-200">
            <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <FaGuitar size={24} />
                {isCartCheckout ? "Order Summary" : "Guitar Summary"}
              </h3>
            </div>
            
            <div className="p-8">
              {isCartCheckout ? (
                // Cart Items Display
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center space-x-4">
                        <img
                          src={getGuitarImage(item.guitar)}
                          alt={item.guitar ? item.guitar.name : "Guitar"}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-grow">
                          <h4 className="font-semibold text-gray-800">
                            {item.guitar ? item.guitar.name : "Guitar"}
                          </h4>
                          <div className="text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <FaCrown className="text-yellow-600" size={12} />
                              <span>Brand: {item.guitar ? item.guitar.brand : "-"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaStar className="text-yellow-600" size={12} />
                              <span>Price: ₹{item.guitar ? item.guitar.price : "-"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaShoppingCart className="text-yellow-600" size={12} />
                              <span>Quantity: {item.quantity}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-yellow-700">₹{item.price * item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Cart Total */}
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-semibold">Total Amount:</span>
                      <span className="text-2xl font-bold text-yellow-700">₹{calculateCartTotal()}</span>
                    </div>
                  </div>
                </div>
              ) : (
                // Single Guitar Display
                <>
                  {/* Guitar Image */}
                  <div className="relative mb-6">
                    <img 
                      src={getGuitarImage(packageData)} 
                      alt={packageData?.title || "Guitar"} 
                      className="w-full h-80 object-cover rounded-xl shadow-lg"
                    />
                    <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full font-bold">
                      ₹{packageData?.price}
                    </div>
                  </div>

                  {/* Guitar Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <FaCrown className="text-yellow-600" />
                      <span className="text-lg font-semibold text-gray-800">{packageData?.brand}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaStar className="text-yellow-600" />
                      <span className="text-lg font-semibold text-gray-800">{packageData?.category}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaCheckCircle className="text-green-600" />
                      <span className="text-lg font-semibold text-gray-800">In Stock</span>
                    </div>
                  </div>

                  {/* Guitar Description */}
                  <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                    <p className="text-gray-600 leading-relaxed">
                      {packageData?.description || "Experience exceptional craftsmanship and superior sound quality with this premium guitar."}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-yellow-200">
            <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <FaCreditCard size={24} />
                Payment Details
              </h3>
            </div>
            
            <div className="p-8">
              <form className="space-y-6">
                <div>
                  <label className="block text-gray-800 font-semibold mb-3 flex items-center gap-2">
                    <FaUser className="text-yellow-600" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-semibold mb-3 flex items-center gap-2">
                    <FaEnvelope className="text-yellow-600" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-semibold mb-3 flex items-center gap-2">
                    <FaPhone className="text-yellow-600" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-200"
                    required
                  />
                </div>

                {!isCartCheckout && (
                  <div>
                    <label className="block text-gray-800 font-semibold mb-3 flex items-center gap-2">
                      <FaShoppingCart className="text-yellow-600" />
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="tickets"
                      placeholder="Number of guitars"
                      value={formData.tickets}
                      min="1"
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-200"
                      required
                    />
                  </div>
                )}

                {/* Total Amount */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Total Amount:</span>
                    <span className="text-2xl font-bold text-yellow-700">
                      ₹{isCartCheckout ? calculateCartTotal() : (packageData?.price * formData.tickets)}
                    </span>
                  </div>
                </div>

                {/* Payment Button */}
                <button
                  type="button"
                  onClick={handlePayment}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-4 rounded-lg text-lg font-bold hover:from-yellow-600 hover:to-yellow-700 transition duration-300 shadow-lg flex items-center justify-center gap-3"
                >
                  <FaCreditCard size={20} />
                  Pay with Khalti
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Checkout;
