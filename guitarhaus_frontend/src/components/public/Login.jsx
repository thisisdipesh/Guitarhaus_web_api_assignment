import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { FaGuitar, FaApple, FaFacebook, FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import loginPoster from '../../assets/images/loginpage.png';

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
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100"
      style={{
        backgroundImage: `url('data:image/svg+xml;utf8,<svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.08"><path d="M30 10a5 5 0 1 1 0 10a5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6a3 3 0 0 0 0-6zm18.5 28.5l-7-7a4 4 0 0 0-5.7 5.7l7 7a4 4 0 1 0 5.7-5.7zm-1.4 4.3a2 2 0 1 1-2.8-2.8a2 2 0 0 1 2.8 2.8zM10 30a5 5 0 1 1 10 0a5 5 0 0 1-10 0zm2 0a3 3 0 1 0 6 0a3 3 0 0 0-6 0zm28.5-18.5l-7 7a4 4 0 0 0 5.7 5.7l7-7a4 4 0 1 0-5.7-5.7zm4.3 1.4a2 2 0 1 1-2.8 2.8a2 2 0 0 1 2.8-2.8z" fill="%236b7280"/></g></svg>')`,
        backgroundRepeat: 'repeat',
      }}
    >
      <div className="absolute top-5 left-5">
        <Link to="/">
          <img
            src="/src/assets/images/guitarhaus_logo.png"
            alt="Guitar Haus Logo"
            className="h-14"
          />
        </Link>
      </div>
      <div className="relative flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left: Guitar Poster Image */}
        <div className="hidden md:block w-1/2">
          <img
            src={loginPoster}
            alt="GuitarHaus Poster"
            className="object-contain w-full h-full bg-white"
          />
        </div>
        {/* Right: Login Form */}
        <div className="w-full p-8 md:w-1/2 flex flex-col justify-center">
          <div className="flex flex-col items-center mb-4">
            <FaGuitar className="text-3xl text-gray-700 mb-2" />
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Login to Your Account
            </h2>
            <span className="text-base text-gray-600 mb-2">GuitarHaus Login</span>
            <p className="mb-2 text-center text-gray-500">
              Please enter your account details.
            </p>
          </div>

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
                className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:ring-gray-400 focus:border-gray-400"
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
                className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:ring-gray-400 focus:border-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="text-right">
              <a href="#" className="text-sm text-gray-600 hover:underline">
                Forgot your password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-gray-700 rounded-lg hover:bg-gray-800"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Logging in..." : "LOGIN"}
            </button>
          </form>

          {/* Remove the social login divider and buttons */}
          {/* <div className="flex items-center justify-center my-6">
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
          </div> */}

          <p className="mt-6 text-sm text-center text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-gray-700 hover:underline">
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
