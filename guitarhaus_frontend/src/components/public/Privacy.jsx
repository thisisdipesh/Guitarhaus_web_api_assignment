import React from "react";
import Footer from "../../components/common/customer/Footer";
import Navbar from "../../components/common/customer/Navbar";

const Privacy = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-25">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">🔒 Privacy Policy</h2>

        <div className="bg-white p-6 shadow-md rounded-md max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">1. Introduction</h3>
          <p className="text-gray-800 mb-4">
            We value your privacy and are committed to protecting your personal information. This policy outlines how we collect, use, and safeguard your data.
          </p>

          <h3 className="text-xl font-semibold text-gray-700 mb-3">2. Information We Collect</h3>
          <p className="text-gray-800 mb-4">
            - Personal details (name, email, phone number) when booking a package.<br />
            - Payment information for secure transactions.<br />
            - Browsing data to enhance user experience.<br />
          </p>

          <h3 className="text-xl font-semibold text-gray-700 mb-3">3. How We Use Your Information</h3>
          <p className="text-gray-800 mb-4">
            - To process bookings and transactions securely.<br />
            - To improve our website and services based on user preferences.<br />
            - To send promotional offers and updates (if opted-in).<br />
          </p>

          <h3 className="text-xl font-semibold text-gray-700 mb-3">4. Data Protection & Security</h3>
          <p className="text-gray-800 mb-4">
            - We use industry-standard security measures to protect your data.<br />
            - Payment details are encrypted and processed securely.<br />
            - We do not sell or share your data with third parties without consent.<br />
          </p>

          <h3 className="text-xl font-semibold text-gray-700 mb-3">5. Cookies & Tracking</h3>
          <p className="text-gray-800 mb-4">
            - We use cookies to enhance your browsing experience.<br />
            - Users can manage cookie settings in their browser preferences.<br />
          </p>

          <h3 className="text-xl font-semibold text-gray-700 mb-3">6. Your Rights</h3>
          <p className="text-gray-800 mb-4">
            - You have the right to request access to your data.<br />
            - You can opt out of marketing communications at any time.<br />
            - You can request data deletion by contacting us.<br />
          </p>

          <h3 className="text-xl font-semibold text-gray-700 mb-3">7. Changes to This Policy</h3>
          <p className="text-gray-800 mb-4">
            - We may update this privacy policy as needed.<br />
            - Users will be notified of significant changes.<br />
          </p>

          <h3 className="text-xl font-semibold text-gray-700 mb-3">8. Contact Us</h3>
          <p className="text-gray-700 mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="text-gray-700">
            Email: <a href="mailto:privacy@trek.com" className="text-red-800 hover:underline">privacy@trek.com</a>.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Privacy;
