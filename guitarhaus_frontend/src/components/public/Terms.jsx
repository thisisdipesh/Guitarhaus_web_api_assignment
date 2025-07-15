import React from "react";
import Footer from "../../components/common/customer/Footer";
import Navbar from "../../components/common/customer/Navbar";

const Terms = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-25">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Terms and Conditions</h2>
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4 text-gray-700">
          <p>
            Welcome to Trek. By using our services, you agree to the following terms and conditions. Please read them carefully.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 pt-4">1. Booking and Payments</h3>
          <p>
            All bookings require a deposit to be confirmed. Full payment must be made before the start of the tour. We accept various payment methods, which will be detailed during the booking process.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 pt-4">2. Cancellations and Refunds</h3>
          <p>
            Cancellation policies vary depending on the package. Please refer to the specific cancellation terms provided with your booking. Refunds, if applicable, will be processed within 30 days.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 pt-4">3. Trekker Responsibilities</h3>
          <p>
            Trekkers are responsible for ensuring they have the necessary documents (passports, visas, etc.) and are in good health for the chosen activities. You must follow the guide's instructions at all times.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 pt-4">4. Itinerary Changes</h3>
          <p>
            While we strive to adhere to the planned itinerary, changes may occur due to unforeseen circumstances like weather or political instability. We reserve the right to make necessary adjustments for your safety.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 pt-4">5. Limitation of Liability</h3>
          <p>
            Trek is not liable for any personal injury, property damage, or loss resulting from events beyond our control. We recommend purchasing comprehensive travel insurance.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 pt-4">6. Governing Law</h3>
          <p>
            These terms are governed by the laws of Nepal. Any disputes will be resolved in the courts of Kathmandu.
          </p>
        </div>
        <p className="text-gray-700 mt-6">
          If you have any questions about these Terms, please contact us at{" "}
          <a href="mailto:support@trek.com" className="text-red-800 hover:underline">support@trek.com</a>.
        </p>
      </div>
      <Footer />
    </>
  );
};

export default Terms;
