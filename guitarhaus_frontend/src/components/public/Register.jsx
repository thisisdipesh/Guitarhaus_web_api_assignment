import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { FaGuitar } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import guitarHausLogo from '../../assets/images/guitarhaus_logo.png';
import loginpageImage from '../../assets/images/loginpage.png';

const Register = () => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const registerUser = async (userData) => {
    const response = await axios.post("/api/v1/customers/register", userData);
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      alert("Registration successful! 🎉");
      console.log("User registered:", data);
      navigate('/login');
    },
    onError: (error) => {
      alert("Registration failed. Please try again.");
      console.error("Error:", error);
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match! ❌");
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="absolute top-5 left-5">
        <Link to="/">
          <img
            src={guitarHausLogo}
            alt="Guitar Haus Logo"
            className="h-14"
          />
        </Link>
      </div>
      <div className="relative flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left: Guitar Poster Image */}
        <div className="w-1/4 md:w-1/3 lg:w-1/4 bg-gray-50 flex items-center justify-center">
          <img
            src={loginpageImage}
            alt="GuitarHaus Poster"
            className="w-full h-full object-cover"
            onLoad={() => console.log("Image loaded successfully")}
            onError={(e) => {
              console.error("Image failed to load:", e);
              console.error("Image src:", e.target.src);
              e.target.style.display = 'none';
            }}
          />
        </div>
        {/* Right: Register Form */}
        <div className="w-3/4 md:w-2/3 lg:w-3/4 p-6 md:p-8 flex flex-col justify-center">
          <div className="flex flex-col items-center mb-4 md:mb-6">
            <FaGuitar className="text-2xl md:text-3xl text-gray-700 mb-2" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
              Create an Account
            </h2>
            <p className="mb-2 text-center text-gray-500 text-xs md:text-sm">
              By creating an account, you agree to our{' '}
              <Link to="/privacy" className="font-medium text-blue-600 hover:text-blue-700 hover:underline">
                Privacy Policy
              </Link>{' '}and{' '}
              <Link to="/terms" className="font-medium text-blue-600 hover:text-blue-700 hover:underline">
                Terms of Use
              </Link>.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-3 md:space-y-4">
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
              <div className="w-full md:w-1/2">
                <label
                  htmlFor="fname"
                  className="block mb-1 md:mb-2 text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  id="fname"
                  type="text"
                  name="fname"
                  placeholder="First Name"
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={formData.fname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="w-full md:w-1/2">
                <label
                  htmlFor="lname"
                  className="block mb-1 md:mb-2 text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  id="lname"
                  type="text"
                  name="lname"
                  placeholder="Last Name"
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={formData.lname}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block mb-1 md:mb-2 text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block mb-1 md:mb-2 text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="123-456-7890"
                className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-1 md:mb-2 text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block mb-1 md:mb-2 text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 shadow-lg"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Registering..." : "CREATE ACCOUNT"}
            </button>
          </form>

          <p className="mt-4 md:mt-6 text-xs md:text-sm text-center text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
