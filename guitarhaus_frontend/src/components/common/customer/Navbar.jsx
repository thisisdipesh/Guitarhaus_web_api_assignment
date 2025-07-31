import React, { useEffect, useState } from "react";
import { FaBars, FaHeart, FaTimes } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import logo from '/src/assets/images/guitarhaus_logo.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Get token from local storage
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Decode token (if needed) and set user
        const decodedUser = JSON.parse(atob(token.split(".")[1])); // Decode JWT
        setUser(decodedUser);
      } catch (error) {
        console.error("Invalid token");
        localStorage.removeItem("token"); // Remove if invalid
      }
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50 border-b-2 border-yellow-400">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="GuitarHaus Logo" className="h-10 w-10 object-contain" />
          <span className="text-2xl font-bold text-yellow-700 tracking-wide font-mono">GuitarHaus</span>
        </Link>
        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className={`pb-1 ${location.pathname === '/' ? 'border-b-4 border-yellow-500 text-yellow-700' : 'text-gray-700 hover:text-yellow-700'}`}>Home</Link>
          <Link to="/guitars" className={`pb-1 ${location.pathname.startsWith('/guitars') ? 'border-b-4 border-yellow-500 text-yellow-700' : 'text-gray-700 hover:text-yellow-700'}`}>Guitars</Link>
          <Link to="/review" className={`pb-1 ${location.pathname === '/review' ? 'border-b-4 border-yellow-500 text-yellow-700' : 'text-gray-700 hover:text-yellow-700'}`}>Reviews</Link>
          {user && (
            <Link to="/mycart" className="text-gray-700 hover:text-red-500">My Cart</Link>
          )}
          <Link to="/contact" className={`pb-1 ${location.pathname === '/contact' ? 'border-b-4 border-yellow-500 text-yellow-700' : 'text-gray-700 hover:text-yellow-700'}`}>Contact</Link>
          <Link to="/aboutus" className={`pb-1 ${location.pathname === '/aboutus' ? 'border-b-4 border-yellow-500 text-yellow-700' : 'text-gray-700 hover:text-yellow-700'}`}>About Us</Link>
        </div>
        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <Link to="/favorite" className="relative text-gray-700 hover:text-red-500">
            <FaHeart size={22} />
            {/* <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">3</span> */}
          </Link>

          {/* If user is logged in */}
          {user ? (
            <div className="flex space-x-4">
              <Link to="/myprofile" className="bg-red-800 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700">My Account</Link>
              <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-500">
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex space-x-3">
              <Link to="/login" className="bg-red-800 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700">Login</Link>
              <Link to="/register" className="bg-red-800 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700">Sign Up</Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md absolute top-full left-0 w-full py-4">
          <Link to="/" className="block px-6 py-2 text-gray-700 hover:bg-gray-100">Home</Link>
          <Link to="/guitars" className="block px-6 py-2 text-gray-700 hover:bg-gray-100">Guitars</Link>
          <Link to="/review" className="block px-6 py-2 text-gray-700 hover:bg-gray-100">Reviews</Link>
          {user && (
            <Link to="/mycart" className="block px-6 py-2 text-gray-700 hover:bg-gray-100">My Cart</Link>
          )}
          <Link to="/contact" className="block px-6 py-2 text-gray-700 hover:bg-gray-100">Contact</Link>
          <Link to="/about-us" className="block px-6 py-2 text-gray-700 hover:bg-gray-100">About Us</Link>

          {user ? (
            <>
              <Link to="/profile" className="block bg-red-800 text-white text-center px-6 py-2 rounded-md text-sm hover:bg-red-700">My Account</Link>
              <button onClick={handleLogout} className="block w-full text-center bg-red-600 text-white px-6 py-2 rounded-md text-sm hover:bg-red-500">
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block bg-red-800 text-white text-center px-6 py-2 rounded-md text-sm hover:bg-red-700">Login</Link>
              <Link to="/register" className="block bg-red-800 text-white text-center px-6 py-2 rounded-md text-sm hover:bg-red-700">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
