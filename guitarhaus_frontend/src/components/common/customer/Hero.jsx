import React from "react";
import { useNavigate } from "react-router-dom";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import heroImage from "/src/assets/images/guitar1.jpg";
import contactImage from "/src/assets/images/guitar2.jpg";
import packagesImage from "/src/assets/images/guitar3.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-[500px] bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }}>
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-black text-center px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight drop-shadow-lg">Discover Your Dream Guitar</h1>
        <p className="mt-4 text-xl md:text-2xl max-w-3xl text-gray-800">
          Explore our exclusive collection of guitars and find the perfect sound for your music journey.
        </p>
        <div className="mt-8">
          <button onClick={() => navigate("/guitars")} className="bg-yellow-500 text-black py-3 px-8 text-xl rounded-lg hover:bg-yellow-400 transition duration-300 shadow-md">
            Shop Guitars
          </button>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, description, buttonText, image, imagePosition = "left", onButtonClick }) => (
  <div className={`flex flex-col md:flex-row items-center justify-between py-12 ${imagePosition === "right" ? "md:flex-row-reverse" : ""}`}>
    <div className="md:w-1/2 p-6">
      <h2 className="text-4xl font-bold mb-4">{title}</h2>
      <p className="text-lg text-gray-700 mb-6">{description}</p>
      <button onClick={onButtonClick} className="bg-red-800 text-white py-3 px-8 text-xl rounded-lg hover:bg-red-600 transition duration-300">
        {buttonText}
      </button>
    </div>
    <div className="md:w-1/2">
      <img src={image} alt={title} className="w-full h-auto rounded-lg shadow-lg" />
    </div>
  </div>
);

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div>
      <HeroSection />
      <div className="container mx-auto px-6">
        <Section
          title="Our Guitar Collection"
          description="From classic acoustics to modern electrics, browse a curated selection for every guitarist."
          buttonText="View All Guitars"
          image={packagesImage}
          onButtonClick={() => navigate("/guitars")}
        />
        <Section
          title="Need Help Choosing?"
          description="Contact our experts for personalized recommendations and custom orders."
          buttonText="Contact Us"
          image={contactImage}
          imagePosition="right"
          onButtonClick={() => navigate("/contact")}
        />
      </div>
    </div>
  );
};

export default Hero;