import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const registerUser = async (userData) => {
    const response = await axios.post("/api/v1/customers/register", userData);
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      alert("Registration successful! 🎉");
      console.log("User registered:", data);
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
            Create an Account
          </h2>
          <p className="mb-6 text-sm text-center text-gray-500">
            By creating an account, you agree to our{" "}
            <Link to="/privacy" className="font-medium text-red-600 hover:underline">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link to="/terms" className="font-medium text-red-600 hover:underline">
              Terms of Use
            </Link>
            .
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label
                  htmlFor="fname"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  id="fname"
                  type="text"
                  name="fname"
                  placeholder="John"
                  className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  value={formData.fname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="lname"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  id="lname"
                  type="text"
                  name="lname"
                  placeholder="Doe"
                  className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  value={formData.lname}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

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
                name="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="123-456-7890"
                className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                value={formData.phone}
                onChange={handleChange}
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
                name="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Registering..." : "CREATE ACCOUNT"}
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
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-red-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
