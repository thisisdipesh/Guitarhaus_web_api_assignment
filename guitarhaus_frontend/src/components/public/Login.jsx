import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { FaGuitar, FaApple, FaFacebook, FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import guitarHausLogo from "../../assets/images/guitarhaus_logo.png";
import loginpageImage from "../../assets/images/loginpage.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginUser = async (userData) => {
    const response = await axios.post("/api/v1/customers/login", userData);
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      alert("Login successful! 🎉");
      console.log("User logged in:", data);
      
      // Store user data in localStorage
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      
      // Store user details from response
      localStorage.setItem("fname", data.fname || "User");
      localStorage.setItem("lname", data.lname || "");
      localStorage.setItem("email", data.email || "");

      if (data.role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        navigate("/home");
      }
    },
    onError: (error) => {
      alert("Login failed. Please check your credentials.");
      console.error("Login error:", error.response?.data || error.message);
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Logo */}
      <div className="absolute top-5 left-5 z-10">
        <Link to="/home">
          <img
            src={guitarHausLogo}
            alt="Guitar Haus Logo"
            className="h-14"
          />
        </Link>
      </div>
      
      {/* Main Container - Split Layout */}
      <div className="relative flex w-full max-w-6xl bg-white shadow-2xl rounded-lg overflow-hidden">
        {/* Left: Full Image Side */}
        <div className="w-1/2 bg-gray-50 flex items-center justify-center relative">
          <img
            src={loginpageImage}
            alt="GuitarHaus Background"
            className="w-full h-full object-cover"
            onLoad={() => console.log("Image loaded successfully")}
            onError={(e) => {
              console.error("Image failed to load:", e);
              console.error("Image src:", e.target.src);
              e.target.style.display = 'none';
            }}
          />
          {/* Optional overlay for better text contrast if needed */}
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>
        
        {/* Right: Login Form Side */}
        <div className="w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="flex flex-col items-center mb-4 md:mb-6">
            <FaGuitar className="text-2xl md:text-3xl text-gray-700 mb-2" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
              Login to Your Account
            </h2>
            <span className="text-sm md:text-base text-gray-600 mb-2">GuitarHaus Login</span>
            <p className="mb-2 text-center text-gray-500 text-sm">
              Please enter your account details.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
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
                placeholder="Enter your email"
                className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="Enter your password"
                className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 shadow-lg"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Logging in..." : "LOGIN"}
            </button>
          </form>

          <p className="mt-4 md:mt-6 text-xs md:text-sm text-center text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-700 hover:underline">
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
