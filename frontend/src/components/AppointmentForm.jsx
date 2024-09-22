import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";

const AppointmentForm = () => {
  const [Name, setName] = useState("");
  const [password,setPassword] = useState("")
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [department, setDepartment] = useState("Pediatrics");
  const [category, setCategory] = useState("Pediatrics");
  const [doctorName, setDoctorName] = useState("");
  const [doctorLastName, setDoctorLastName] = useState("");
  const [address, setAddress] = useState("");
  const [filename, setFilename] = useState([]);
  const [hasVisited, setHasVisited] = useState(false);

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

  const [doctors, setDoctors] = useState([]);
  // useEffect(() => {
  //   const fetchDoctors = async () => {
  //     const { data } = await axios.get(
  //       "http://localhost:4000/api/v1/user/doctors",
  //       { withCredentials: true }
  //     );
  //     setDoctors(data.doctors);
  //     console.log(data.doctors);
  //   };
  //   fetchDoctors();
  // }, []);
  const handleAppointment = async (e) => {
    e.preventDefault();
    try {
      const hasVisitedBool = Boolean(hasVisited);
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/appointment/post",
        {
          Name,
          password,
          phone,
          category,
          filename
          // lastName,
          // email,
          // nic,
          // dob,
          // gender,
          // appointment_date: appointmentDate,
          // department,
          // doctor_Name: doctorName,
          // doctor_lastName: doctorLastName,
          // hasVisited: hasVisitedBool,
          // address,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
        setName(""),
        setPassword(""),
        setPhone(""),
        setCategory(""),
        setFilename([""])
        
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <div className="container form-component appointment-form">
        <h2>Appointment</h2>
        <form onSubmit={handleAppointment}>
          <div>
            <input
              type="text"
              placeholder="Name"
              value={Name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            /> */}
          </div>
          <div>
            {/* <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            /> */}
            <input
              type="number"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            {/* <input
              type="number"
              placeholder="NIC"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
            /> */}
            {/* <input
              type="date"
              placeholder="Date of Birth"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            /> */}
          </div>
          <div>
            {/* <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input
              type="date"
              placeholder="Appointment Date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
            /> */}
          </div>
          <div>
            {/* <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setDoctorName("");
                setDoctorLastName("");
              }}
            >
              {departmentsArray.map((depart, index) => {
                return (
                  <option value={depart} key={index}>
                    {depart}
                  </option>
                );
              })}
            </select> */}
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setDoctorName("");
                setDoctorLastName("");
              }}
            >
              {departmentsArray.map((depart, index) => {
                return (
                  <option value={depart} key={index}>
                    {depart}
                  </option>
                );
              })}
            </select>
            {/* <select
              value={`${doctorName}`}
              onChange={(e) => {
                const [firstName] = e.target.value.split(" ");
                setDoctorName(firstName);
                // setDoctorLastName(lastName);
              }}
              disabled={!department}
            >
              <option value="">Select Doctor</option>
              {doctors
                .filter((doctor) => doctor.doctorDepartment === department)
                .map((doctor, index) => (
                  <option
                    value={`${doctor.Name}`}
                    key={index}
                  >
                    {doctor.first} 
                  </option>
                ))}
            </select> */}
          </div>
          {/* <textarea
            rows="10"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
          /> */}
          <textarea
            rows="1"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="Filename"
          />
          <div
            style={{
              gap: "10px",
              justifyContent: "flex-end",
              flexDirection: "row",
            }}
          >
            {/* <p style={{ marginBottom: 0 }}>Have you visited before?</p> */}
            {/* <input
              type="checkbox"
              checked={hasVisited}
              onChange={(e) => setHasVisited(e.target.checked)}
              style={{ flex: "none", width: "25px" }}
            /> */}
          </div>
          <button style={{ margin: "0 auto" }}>GET APPOINTMENT</button>
        </form>
      </div>
    </>
  );
};

export default AppointmentForm;
