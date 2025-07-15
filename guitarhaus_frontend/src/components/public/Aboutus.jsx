import React from "react";
import Footer from "../../components/common/customer/Footer";
import Navbar from "../../components/common/customer/Navbar";

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">About Us</h1>
        <p className="text-lg text-center text-gray-600 mb-12">
          Your trusted partner for unforgettable trek experiences across the Himalayas and beyond.
        </p>

        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img 
              src="/src/assets/images/guitar4.jpg" 
              alt="Guitar Shop Interior"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Our goal is to provide trekkers with authentic, safe, and
              unforgettable journeys. We believe in responsible tourism that
              respects local cultures and environments.
            </p>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Why Choose Us?</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>✅ Expert guides with extensive local knowledge</li>
              <li>✅ Customized trek packages to suit your needs</li>
              <li>✅ Commitment to safety and quality</li>
              <li>✅ 24/7 customer support</li>
            </ul>
          </div>
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
          <p className="text-lg text-gray-600 mb-12">
            Our dedicated team of professionals is here to ensure you have the best possible experience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <img src="/src/assets/images/guitar1.jpg" alt="Guitar Closeup" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
              <h4 className="text-xl font-semibold">Acoustic Beauty</h4>
              <p className="text-gray-600">Classic Acoustic</p>
            </div>
            {/* Team Member 2 */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <img src="/src/assets/images/guitar2.jpg" alt="Electric Guitar" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
              <h4 className="text-xl font-semibold">Electric Vibes</h4>
              <p className="text-gray-600">Modern Electric</p>
            </div>
            {/* Team Member 3 */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <img src="/src/assets/images/guitar3.jpg" alt="Guitar Headstock" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
              <h4 className="text-xl font-semibold">Headstock Hero</h4>
              <p className="text-gray-600">Signature Series</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs; 
