import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const NewAppointmentForm = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("Pediatrics");
  const [filename, setFilename] = useState([]);
  const [newFilename, setNewFilename] = useState("");

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

  const handleFilenameChange = (e) => {
    setNewFilename(e.target.value);
  };

  const addFilename = () => {
    if (newFilename.trim() !== "") {
      setFilename((prevFilenames) => [...prevFilenames, newFilename]);
      setNewFilename("");
    }
  };

  const handleAppointment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/submit",
        {
          name,
          password,
          phone,
          category,
          filename,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      setName("");
      setPassword("");
      setPhone("");
      setCategory("Pediatrics");
      setFilename([]);
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
            type="text"
            value={newFilename}
            onChange={handleFilenameChange}
            placeholder="Add filename"
          />
          <button type="button" onClick={addFilename}>
            Add Filename
          </button>
          <div>
            <ul>
              {filename.map((file, index) => (
                <li key={index}>{file}</li>
              ))}
            </ul>
          </div>
        </div>
        <button type="submit" style={{ margin: "0 auto" }}>
          GET APPOINTMENT
        </button>
      </form>
    </div>
  );
};

export default NewAppointmentForm;
