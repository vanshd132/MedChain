import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Chatbot from '../../components/vansh/Chatbot'; // Import the Chatbot component
import Navbar from "../../components/Navbar";

const HospitalDetail = () => {
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const [secondOpinion, setSecondOpinion] = useState({ description: '' });
  const [fileUploadStatus, setFileUploadStatus] = useState('');
  const { hospitalname } = useParams(); // Extract name from URL
  const navigate = useNavigate(); // For navigation to payment page

  // Extract username from token
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.post('http://localhost:4000/check-token', { token });
          if (response.data.valid) {
            setUsername(response.data.user.name); // Extracted username
          } else {
            localStorage.removeItem('token');
            setUsername('');
          }
        } catch (error) {
          console.error('Error validating token:', error);
          localStorage.removeItem('token');
          setUsername('');
        }
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/hospitals/${hospitalname}`);
        setHospital(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching hospital details:", error);
        setError("Failed to fetch hospital details.");
        setLoading(false);
      }
    };
    fetchHospitalDetails();
  }, [hospitalname]);

  const handleSecondOpinionSubmit = (e) => {
    e.preventDefault();

    // Store the second opinion data temporarily in localStorage
    localStorage.setItem('secondOpinionData', JSON.stringify({
      hospitalname,
      name: username,
      description: secondOpinion.description,
    }));

    // Redirect to payment page with the required payment amount (can adjust amount as needed)
    navigate('/checkout', { state: { amount: 7 } });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!hospital) {
    return <p>No data available</p>;
  }

  return (
    <div className="overflow-hidden min-h-screen bg-gradient-to-r from-blue-100 via-purple-200 to-pink-100 flex flex-col items-center p-6">
      <Chatbot />
      <Navbar />
      <div className="max-w-4xl w-full p-6 bg-white rounded-lg shadow-xl border border-gray-200">
        <div className="flex justify-center mb-6">
          <img
            src="https://static.vecteezy.com/system/resources/previews/045/486/811/non_2x/hospital-building-icon-hospital-icon-isolated-on-white-background-vector.jpg"
            alt="Hospital"
            className="w-64 h-64 object-cover rounded-lg shadow-md"
          />
        </div>

        <h1 className="overflow-hidden text-4xl font-extrabold mb-4 text-center text-gradient bg-gradient-to-r from-purple-500 to-blue-600 bg-clip-text text-transparent">
          {hospital.hospitalname}
        </h1>

        <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-300 rounded-lg shadow-xl p-6">
          <p className="text-lg text-gray-700 mb-4">
            <strong>Location:</strong> {hospital.address}
          </p>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Doctors</h2>
            {hospital.doctors && hospital.doctors.length > 0 ? (
              <ul className="space-y-4">
                {hospital.doctors.map((doctor) => (
                  <motion.li
                    key={doctor._id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-transform transform hover:scale-105"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">{doctor.name}</span>
                      <span className="text-sm text-gray-600">{doctor.speciality}</span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No doctors available</p>
            )}
          </div>
        </div>

        <div className="mt-8 max-w-4xl w-full p-6 bg-white rounded-lg shadow-xl border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Second Opinion</h2>
          <form onSubmit={handleSecondOpinionSubmit}>
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">Description</label>
              <textarea
                id="description"
                rows="4"
                value={secondOpinion.description}
                onChange={(e) => setSecondOpinion({ description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
              <p><strong>Note: </strong>You will be able to upload file after payment</p>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Submit & Pay
            </button>
          </form>
          {fileUploadStatus && <p className="mt-4 text-center text-gray-700">{fileUploadStatus}</p>}
        </div>
      </div>
    </div>
  );
};

export default HospitalDetail;
