import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Chatbot from '../../components/vansh/Chatbot';  // Import the Chatbot component

const HospitalList = () => {
  const [hospitals, setHospitals] = useState([]);
  const navigate = useNavigate();  // Initialize the useNavigate hook

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get("http://localhost:4000/hospitals");
        setHospitals(response.data);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };

    fetchHospitals();
  }, []);

  const handleClick = (hospitalName) => {
    navigate(`/HospitalList/${hospitalName}`);  // Navigate to the hospital details page
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-blue-100 via-purple-200 to-pink-100 flex flex-col">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-purple-500 to-blue-600 text-white text-center py-12">
        <h1 className="text-5xl font-extrabold mb-4 overflow-hidden">Discover Top Hospitals</h1>
        <p className="text-xl mb-6">Find the best healthcare facilities near you</p>
        <a
          href="#hospitals"
          className="bg-white text-blue-600 py-2 px-6 rounded-full font-semibold shadow-lg hover:bg-gray-200 transition duration-100"
        >
          Explore Hospitals
        </a>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-6 hidden lg:block">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Filters</h2>
          <div className="space-y-4">
            <button className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition duration-300">Filter by Specialty</button>
            <button className="bg-purple-500 text-white py-2 px-4 rounded-full hover:bg-purple-600 transition duration-300">Filter by Location</button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6" id="hospitals">
          <h2 className="text-3xl font-extrabold mb-8 text-center text-gradient bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            List of Hospitals
          </h2>
          <div className="overflow-hidden grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {hospitals.length === 0 ? (
              <p className="text-center text-gray-500 col-span-full">No hospitals found.</p>
            ) : (
              hospitals
                .filter((hospital) => hospital.hospitalname)
                .map((hospital, index) => (
                  <motion.div
                    key={hospital._id}
                    className="flex flex-col p-6 bg-gradient-to-br from-blue-50 to-white border border-gray-200 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:-translate-y-2 cursor-pointer"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    onClick={() => handleClick(hospital.hospitalname)}
                  >
                    {/* Image on the top */}
                    <div className="flex justify-center mb-4">
                      <img
                        src="https://static.vecteezy.com/system/resources/previews/045/486/811/non_2x/hospital-building-icon-hospital-icon-isolated-on-white-background-vector.jpg"
                        alt="Hospital"
                        className="w-auto h-32 object-cover rounded-lg shadow-lg "
                      />
                    </div>

                    {/* Hospital details */}
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold mb-2 text-gray-800 hover:text-purple-600 transition duration-200 ease-in-out">
                        {hospital.hospitalname}
                      </h3>

                      {hospital.speciality && (
                        <div className="mb-3">
                          <span className="px-3 py-1 bg-purple-500 text-white text-xs font-medium rounded-full">
                            {hospital.speciality}
                          </span>
                        </div>
                      )}

                      {hospital.address && (
                        <p className="text-gray-600 mb-4 text-sm">{hospital.address}</p>
                      )}

                      <div>
                        <h4 className="text-lg font-bold text-gray-700 mt-4 mb-2">
                          Available Doctors
                        </h4>
                        {hospital.doctors && hospital.doctors.length > 0 ? (
                          <ul className="space-y-3">
                            {hospital.doctors.map((doctor) => (
                              <li
                                key={doctor._id}
                                className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:bg-blue-100 transition"
                              >
                                <div className="flex flex-col">
                                  <span className="font-semibold text-gray-800 text-sm">
                                    {doctor.name}
                                  </span>
                                  <span className="text-xs text-gray-600">
                                    {doctor.speciality}
                                  </span>
                                </div>
                                <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                                  {doctor.speciality}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 text-sm">No doctors available</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer id="footer" className="bg-blue-600 text-white text-center py-6 mt-8">
        <p className="text-lg mb-2">© 2024 Your Company. All rights reserved.</p>
        <a
          href="mailto:contact@yourcompany.com"
          className="text-blue-200 hover:underline"
        >
          contact@yourcompany.com
        </a>
      </footer>

      {/* Render Chatbot component */}
      <Chatbot />
    </div>
  );
};

export default HospitalList;
