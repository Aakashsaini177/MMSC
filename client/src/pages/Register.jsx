import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { toast } from "react-toastify";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const Register = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();

  const changeInputHandler = (e) => {
    setUserData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const registerUser = async (e) => {
    e.preventDefault();
    setError("");

    if (userData.password !== userData.password2) {
      setError("Passwords do not match");
      return;
    }

    try {
      await register(userData.username, userData.email, userData.password);
      toast.success("Registered successfully");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-500 mt-2">Join MMSC Services today</p>
          </div>

          <form onSubmit={registerUser} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaUser />
                </div>
                <input
                  type="text"
                  name="username"
                  placeholder="Full Name"
                  value={userData.username}
                  onChange={changeInputHandler}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={userData.email}
                  onChange={changeInputHandler}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaLock />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={userData.password}
                  onChange={changeInputHandler}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaLock />
                </div>
                <input
                  type="password"
                  name="password2"
                  placeholder="Confirm Password"
                  value={userData.password2}
                  onChange={changeInputHandler}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
