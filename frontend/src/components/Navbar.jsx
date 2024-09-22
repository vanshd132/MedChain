import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/user/patient/logout",
        { withCredentials: true }
      );
      toast.success(response.data.message);
      setIsAuthenticated(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  const navigateTo = useNavigate();

  const goToLogin = () => {
    navigateTo("/login");
  };

  return (
    <nav className="relative container mx-auto flex items-center justify-between p-4 bg-gray-900 text-white shadow-md">
      <div className="flex items-center">
        <img src="/logo.png" alt="logo" className="h-20 w-auto" />
      </div>
      <div
        className={`fixed inset-0 bg-gray-900 bg-opacity-90 transition-transform transform ${
          show ? "translate-x-0" : "translate-x-full"
        } md:relative md:flex md:items-center md:bg-transparent md:bg-opacity-100 md:translate-x-0 md:w-auto md:gap-6 md:justify-between`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:gap-6">
          <Link
            to="/"
            className="p-3 hover:bg-gray-700 rounded-lg transition-colors duration-300"
            onClick={() => setShow(false)}
          >
            Home
          </Link>
          {/* <Link
            to="/appointment"
            className="p-3 hover:bg-gray-700 rounded-lg transition-colors duration-300"
            onClick={() => setShow(false)}
          >
            Appointment
          </Link> */}
          {/* <Link
            to="/appointment-status"
            className="p-3 hover:bg-gray-700 rounded-lg transition-colors duration-300"
            onClick={() => setShow(false)}
          >
            User Details
          </Link> */}
          <Link
            to="/fileUpload"
            className="p-3 hover:bg-gray-700 rounded-lg transition-colors duration-300"
            onClick={() => setShow(false)}
          >
            Upload Report
          </Link>
          <Link
            to="/ocrspace"
            className="p-3 hover:bg-gray-700 rounded-lg transition-colors duration-300"
            onClick={() => setShow(false)}
          >
            Report Analysis
          </Link>
          <Link
            to="/HospitalList"
            className="p-3 hover:bg-gray-700 rounded-lg transition-colors duration-300"
            onClick={() => setShow(false)}
          >
            Hospital
          </Link>
          <Link
            to="/appointment1"
            className="p-3 hover:bg-gray-700 rounded-lg transition-colors duration-300"
            onClick={() => setShow(false)}
          >
            Appointment1
          </Link>
          <Link
            to="/about"
            className="p-3 hover:bg-gray-700 rounded-lg transition-colors duration-300"
            onClick={() => setShow(false)}
          >
            About Us
          </Link>
          <Link
            to="/appointment-status"
            className="p-3 hover:bg-gray-700 rounded-lg transition-colors duration-300"
            onClick={() => setShow(false)}
          >
            Appointment Status
          </Link>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:gap-4 mt-4 md:mt-0">
          {isAuthenticated ? (
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition-colors duration-300"
              onClick={handleLogout}
            >
              LOGOUT
            </button>
          ) : (
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition-colors duration-300"
              onClick={goToLogin}
            >
              LOGIN
            </button>
          )}
        </div>
      </div>
      <div
        className="md:hidden cursor-pointer"
        onClick={() => setShow(!show)}
      >
        <GiHamburgerMenu size={24} />
      </div>
    </nav>
  );
};

export default Navbar;
