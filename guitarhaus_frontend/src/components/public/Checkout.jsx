import axios from "axios";
import KhaltiCheckout from "khalti-checkout-web";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../../components/common/customer/Footer";
import Navbar from "../../components/common/customer/Navbar";
import guitar1 from '/src/assets/images/guitar_homepage.jpg';
import guitar2 from '/src/assets/images/guitar2.jpg';
import guitar3 from '/src/assets/images/guitar3.jpg';
import guitar4 from '/src/assets/images/guitar4.jpg';
import guitar5 from '/src/assets/images/guitar5.jpg';
const guitarImages = [guitar1, guitar2, guitar3, guitar4, guitar5];

const Checkout = () => {
  const { id } = useParams(); // Get package ID from URL
  const [packageData, setPackageData] = useState(null);
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

  useEffect(() => {
    const fetchGuitarDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/guitars/${id}`);
        setPackageData(res.data.data);
      } catch (err) {
        setError("Failed to load guitar details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchGuitarDetails();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Khalti Payment Configuration
  const khaltiConfig = {
    publicKey: "test_public_key_dc74e0fd57cb46cd93832aee0a390234",
    productIdentity: packageData?._id,
    productName: packageData?.name || packageData?.title || "Guitar",
    productUrl: `http://localhost:5173/guitars/${packageData?._id}`,
    eventHandler: {
      onSuccess(payload) {
        console.log("Payment Success:", payload);

        // Save booking details after payment success
        axios
          .post("http://localhost:3000/api/v1/bookings", {
            packageId: id,
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            tickets: formData.tickets,
            pickupLocation: formData.pickupLocation,
            paymentMethod: "khalti",
            paymentId: payload.idx, // Save Khalti transaction ID
          })
          .then(() => {
            alert("Booking Successful! 🚀");
          })
          .catch(() => {
            alert("Booking saved failed, but payment was successful.");
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
    if (!packageData) return;
    const totalAmount = packageData.price * formData.tickets * 100; // Convert to paisa
    khaltiCheckout.show({ amount: totalAmount });
  };

  if (loading) return <p className="text-center py-10 text-lg">Loading checkout details...</p>;
  if (error) return <p className="text-center text-red-600 py-10">{error}</p>;
  if (!packageData) return null;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">🛒 Checkout</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Package Summary */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">📌 Booking Summary</h3>
            <div className="flex flex-col items-center">
              <img 
                src={guitarImages[Math.floor(Math.random() * guitarImages.length)]} 
                alt="Guitar for sale" 
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
              <div className="mt-4 w-full">
                <h4 className="text-xl font-semibold text-gray-700">{packageData.name || packageData.title}</h4>
                <p className="text-gray-500">{packageData.duration}</p>
                <p className="text-gray-800 font-bold mt-2 text-lg">₹{packageData.price}</p>
                <p className="text-gray-600 mt-2">{packageData.description}</p>

                {/* Available Dates */}
                <div className="mt-4">
                  <h4 className="text-lg font-semibold text-gray-700">📅 Available Dates</h4>
                  <ul className="text-gray-500">
                    {(packageData.availableDates && Array.isArray(packageData.availableDates)) ? (
                      packageData.availableDates.map((date, index) => (
                        <li key={index}>🗓 {new Date(date).toDateString()}</li>
                      ))
                    ) : (
                      <li>No available dates</li>
                    )}
                  </ul>
                </div>

                {/* Itinerary Section */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-700">🛤 Itinerary</h4>
                  <ul className="space-y-2 mt-2">
                    {(Array.isArray(packageData.itinerary) && packageData.itinerary.length > 0) ? (
                      packageData.itinerary.map((feature, index) => (
                        <li key={index} className="border-l-4 border-red-500 pl-4 py-2">
                          <h5 className="text-red-700 font-semibold">Feature {index + 1}</h5>
                          <p className="text-gray-600">{typeof feature === 'string' ? feature : JSON.stringify(feature)}</p>
                        </li>
                      ))
                    ) : (
                      <p className="text-gray-500">No features listed for this guitar.</p>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">📝 Enter Details</h3>
            <form className="space-y-4">
              <div className="mt-6">
                <label className="block text-gray-800 font-semibold mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-red-400"
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block text-gray-800 font-semibold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-red-400"
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block text-gray-800 font-semibold mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-red-400"
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block text-gray-800 font-semibold mb-2">Number of People</label>
                <input
                  type="number"
                  name="tickets"
                  placeholder="Number of people"
                  value={formData.tickets}
                  min="1"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-red-400"
                  required
                />
              </div>

              {/* Payment Button */}
              <button
                type="button"
                onClick={handlePayment}
                className="w-full bg-red-800 text-white py-3 rounded-lg text-lg hover:bg-red-700 transition duration-300"
              >
                Pay with Khalti
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
