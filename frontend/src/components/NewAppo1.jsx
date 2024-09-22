import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const NewAppo1 = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [files, setFiles] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/hospitals?name=${hospitalName}`);
        setHospitals(response.data);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };

    fetchHospitals();
  }, [hospitalName]);

  useEffect(() => {
    if (selectedHospital) {
      const fetchDoctors = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/hospital/${selectedHospital}/doctor`);
          setDoctors(response.data);
        } catch (error) {
          console.error("Error fetching doctors:", error);
        }
      };

      fetchDoctors();
    }
  }, [selectedHospital]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleAppointment = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("password", password);
      formData.append("phone", phone);
      formData.append("hospital", selectedHospital);
      formData.append("doctor", selectedDoctor);

      files.forEach((file) => {
        formData.append("files", file);
      });

      const { data } = await axios.post(
        "http://localhost:4000/api/submit31",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(data.message);
      setName("");
      setPassword("");
      setPhone("");
      setHospitalName("");
      setFiles([]);
      setSelectedHospital("");
      setSelectedDoctor("");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Appointment</h2>
      <form onSubmit={handleAppointment} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
        <input
          type="text"
          placeholder="Mobile Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        />
        <div>
          <select
            value={selectedHospital}
            onChange={(e) => setSelectedHospital(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          >
            <option value="">Select a Hospital</option>
            {hospitals.map((hospital) => (
              <option value={hospital._id} key={hospital._id}>
                {hospital.hospitalname}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          >
            <option value="">Select a Doctor</option>
            {doctors.map((doctor) => (
              <option value={doctor._id} key={doctor._id}>
                {doctor.name} - {doctor.speciality}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="border border-gray-300 rounded-md shadow-sm"
          />
          <div className="space-y-1">
            {files.map((file, index) => (
              <div key={index} className="flex justify-between items-center px-4 py-2 border border-gray-200 rounded-md">
                <span>{file.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Get Appointment
        </button>
      </form>
    </div>
  );
};

export default NewAppo1;
