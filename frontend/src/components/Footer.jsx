

import React from "react";
import { Link } from "react-router-dom";
import { FaLocationArrow, FaPhone } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  const hours = [
    { id: 1, day: "Monday", time: "9:00 AM - 11:00 PM" },
    { id: 2, day: "Tuesday", time: "12:00 PM - 12:00 PM" },
    { id: 3, day: "Wednesday", time: "10:00 AM - 10:00 PM" },
    { id: 4, day: "Thursday", time: "9:00 AM - 9:00 PM" },
    { id: 5, day: "Friday", time: "3:00 PM - 9:00 PM" },
    { id: 6, day: "Saturday", time: "9:00 AM - 3:00 PM" },
  ];

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <hr className="border-gray-600 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center md:items-start">
            <img src="/logo.png" alt="logo" className="w-32 mb-4" />
            <p className="text-gray-400 text-center md:text-left">
              Your reliable medical partner for all healthcare needs.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4 text-blue-400">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link to="/appointment" className="text-gray-300 hover:text-white transition">Appointment</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition">About</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4 text-blue-400">Hours</h4>
            <ul className="space-y-2">
              {hours.map((element) => (
                <li key={element.id} className="flex justify-between text-gray-300">
                  <span>{element.day}</span>
                  <span>{element.time}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4 text-blue-400">Contact</h4>
            <div className="flex items-center space-x-3 mb-4">
              <FaPhone className="text-blue-400" />
              <span className="text-gray-300">998-897-5999</span>
            </div>
            <div className="flex items-center space-x-3 mb-4">
              <MdEmail className="text-blue-400" />
              <span className="text-gray-300">Medcare@gmail.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaLocationArrow className="text-blue-400" />
              <span className="text-gray-300">Delhi, India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
