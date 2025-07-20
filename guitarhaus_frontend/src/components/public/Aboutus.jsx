import React from "react";
import Footer from "../../components/common/customer/Footer";
import Navbar from "../../components/common/customer/Navbar";
import { FaGuitar } from "react-icons/fa";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-20">
        <div className="flex flex-col items-center mb-6">
          <FaGuitar className="text-5xl text-yellow-600 mb-2" />
          <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-2 tracking-tight">About GuitarHaus</h1>
        </div>
        <p className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Welcome to GuitarHaus – your ultimate destination for guitars, gear, and a thriving music community. Whether you're a beginner or a seasoned pro, we’re here to help you find your perfect sound and inspire your musical journey.
        </p>

        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img 
              src="/src/assets/images/guitar4.jpg" 
              alt="Inside GuitarHaus Shop"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              At GuitarHaus, our mission is to connect people through the power of music. We provide top-quality guitars, expert advice, and a welcoming space for all guitar lovers. From classic acoustics to cutting-edge electrics, we help you play, learn, and grow.
            </p>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Why Choose GuitarHaus?</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Huge selection of acoustic, electric, and bass guitars</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Knowledgeable staff and expert advice</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Quality instruments and accessories, guaranteed</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Community events, workshops, and lessons</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Friendly support for all skill levels</li>
            </ul>
          </div>
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Meet Our Guitar Experts</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Our passionate team is here to help you find the right instrument, answer your questions, and support your musical dreams.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <img src="/src/assets/images/guitar1.jpg" alt="Acoustic Guitar Expert" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
              <h4 className="text-xl font-semibold">Alex - Acoustic Specialist</h4>
              <p className="text-gray-600">Loves fingerstyle and folk music</p>
            </div>
            {/* Team Member 2 */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <img src="/src/assets/images/guitar2.jpg" alt="Electric Guitar Expert" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
              <h4 className="text-xl font-semibold">Jamie - Electric Guru</h4>
              <p className="text-gray-600">Rock, blues, and gear wizard</p>
            </div>
            {/* Team Member 3 */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <img src="/src/assets/images/guitar3.jpg" alt="Bass Guitar Expert" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
              <h4 className="text-xl font-semibold">Taylor - Bass Enthusiast</h4>
              <p className="text-gray-600">Groove master and teacher</p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-yellow-700 mb-2">Ready to start your guitar journey?</h3>
          <p className="text-lg text-gray-700 mb-4">Visit us in-store or join our online community today!</p>
          <Link to="/register" className="inline-block px-6 py-3 bg-yellow-600 text-white font-semibold rounded-lg shadow hover:bg-yellow-700 transition">Join GuitarHaus</Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs; 
