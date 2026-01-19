import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user", // Default to Normal User
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Note: Ensure your backend route is /api/auth/signup
      await axios.post("http://localhost:5000/api/auth/signup", formData);
      alert("Registration Successful! Please Login.");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-10">
      <div className="w-full max-w-md p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl transform transition-all hover:scale-[1.01]">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
            Create Account
          </h1>
          <p className="text-gray-500 text-sm">Join us to rate and discover stores</p>
        </div>

        {error && (
          <div className="p-4 mb-6 text-sm text-red-700 bg-red-50 border-l-4 border-red-500 rounded animate-pulse">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSignup}>
          
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">I want to be a...</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="user">Normal User (I want to rate stores)</option>
              <option value="owner">Store Owner (I have a shop)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              name="name"
              type="text"
              placeholder="John Doe"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="john@example.com"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address <span className="text-gray-400 font-normal">(Optional)</span></label>
            <input
              name="address"
              type="text"
              placeholder="City, State"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg transform transition hover:-translate-y-0.5 mt-4"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/" className="font-semibold text-purple-600 hover:text-purple-800 transition">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;