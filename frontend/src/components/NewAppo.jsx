import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const NewAppo = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("Pediatrics");
  const [files, setFiles] = useState([]);

  const departmentsArray = [
    "Pediatrics",
    "Orthopedics",
    "Cardiology",
    "Neurology",
    "Oncology",
    "Radiology",
    "Physical Therapy",
    "Dermatology",
    "ENT",
  ];

  // Handle file selection and update state
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]); // Append new files to existing ones
  };

  // Handle form submission
  const handleAppointment = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("password", password);
      formData.append("phone", phone);
      formData.append("category", category);

      // Append all files to FormData
      files.forEach((file) => {
        formData.append("files", file);
      });

      const { data } = await axios.post(
        "http://localhost:4000/submit3",
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
      setCategory("Pediatrics");
      setFiles([]);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="container form-component appointment-form">
      <h2>Appointment</h2>
      <form onSubmit={handleAppointment}>
        <div>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Mobile Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {departmentsArray.map((depart, index) => (
              <option value={depart} key={index}>
                {depart}
              </option>
            ))}
          </select>
        </div>
        <div>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
          />
          {/* Display selected files */}
          <div className="file-list">
            {files.map((file, index) => (
              <div key={index} className="file-item">
                {file.name}
                <button type="button" onClick={() => handleRemoveFile(index)}>Remove</button>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" style={{ margin: "0 auto" }}>
          GET APPOINTMENT
        </button>
      </form>
    </div>
  );
};

// Add function to remove a file from the list
const handleRemoveFile = (index) => {
  setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
};

export default NewAppo;
