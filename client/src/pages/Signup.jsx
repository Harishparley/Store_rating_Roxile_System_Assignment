import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", address: "", role: "user" });
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/signup", formData);
      navigate("/");
    } catch (err) { setError(err.response?.data?.error || "Signup failed"); }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-10">
      <div className="w-full max-w-md p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">Create Account</h1>
          <p className="text-gray-500 text-sm">Join us today</p>
        </div>
        {error && <div className="p-3 mb-4 text-red-700 bg-red-100 rounded">{error}</div>}
        <form className="space-y-4" onSubmit={handleSignup}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">I am a...</label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white">
              <option value="user">User</option>
              <option value="owner">Store Owner</option>
            </select>
          </div>
          <input name="name" type="text" placeholder="Full Name" required onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
          <input name="email" type="email" placeholder="Email" required onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
          <input name="password" type="password" placeholder="Password" required onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
          <input name="address" type="text" placeholder="Address" onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
          <button type="submit" className="w-full py-3 font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg mt-2">Sign Up</button>
        </form>
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-purple-600 font-semibold hover:underline">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
};
export default Signup;