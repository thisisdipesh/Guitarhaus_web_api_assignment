import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

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
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      if (data.role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        navigate("/");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="absolute top-5 left-5">
        <Link to="/">
          <img
            src="/src/assets/images/logo.png"
            alt="GuitarHaus Logo"
            className="h-12"
          />
        </Link>
      </div>
      <div className="relative flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="hidden md:block w-1/2">
          <img
            src="/src/assets/images/guitar5.jpg"
            alt="Guitar Background"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="w-full p-8 md:w-1/2">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Login to Your Account
          </h2>
          <p className="mb-6 text-center text-gray-500">
            Welcome back! Please enter your details.
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="text-right">
              <a href="#" className="text-sm text-red-600 hover:underline">
                Forgot your password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Logging in..." : "LOGIN"}
            </button>
          </form>

          <div className="flex items-center justify-center my-6">
            <span className="w-16 h-px bg-gray-300"></span>
            <span className="mx-2 text-sm text-gray-500">OR</span>
            <span className="w-16 h-px bg-gray-300"></span>
          </div>

          <div className="flex justify-center space-x-4">
            <button className="p-3 text-gray-600 bg-white border border-gray-300 rounded-full hover:bg-gray-100">
              <FaGoogle size={20} />
            </button>
            <button className="p-3 text-gray-600 bg-white border border-gray-300 rounded-full hover:bg-gray-100">
              <FaFacebook size={20} />
            </button>
            <button className="p-3 text-gray-600 bg-white border border-gray-300 rounded-full hover:bg-gray-100">
              <FaApple size={20} />
            </button>
          </div>

          <p className="mt-6 text-sm text-center text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-red-600 hover:underline">
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
