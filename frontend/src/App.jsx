import React, { useContext, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Context } from "./main";
import { GoogleOAuthProvider } from "@react-oauth/google";


// Vansh pages
import Login from "./Pages/vansh/login";
import SignUp from "./Pages/vansh/SignUP";
import NotFound from "./Pages/vansh/NotFound";
import HospitalList from "./Pages/vansh/HospitalList";
import HospitalDetail from "./Pages/vansh/UserViewHospital";
import { CheckoutForm, Return } from "./Pages/vansh/Payment";
import HospitalSendResponsePage from "./Pages/vansh/OCR";
import UserDetails2 from "./Pages/vanshEdit/Userdetails2";
import FileUpload from "./Pages/vanshEdit/FileUpload";
import HospitalDetails from "./Pages/vanshEdit/HospitalDetails";
import Home from "./Pages/vanshEdit/Home";
import Appointment1 from "./Pages/Appointment1";
import AboutUs from "./Pages/AboutUs";


const App = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } =
    useContext(Context);
    const clientID = import.meta.env.VITE_CLIENT_ID; // Updated for Vite

  return (
    <>
      <Router>
        <Routes>
        {/* Only wrap the SignUp page  and login page with GoogleOAuthProvider */}
        <Route
          path="/signup"
          element={
            <GoogleOAuthProvider clientId={clientID}>
              <SignUp />
            </GoogleOAuthProvider>
          }
        />
        <Route
          path="/login"
          element={
            <GoogleOAuthProvider clientId={clientID}>
              <Login />
            </GoogleOAuthProvider>
          }/>
        <Route path="/" element={<Home />} />
        <Route path="/hospital/:name" element={<HospitalDetails />}/>
        <Route path="/user/:name" element={<UserDetails2/>}/>
        <Route path="*" element={<NotFound/>}/>
        <Route path="/HospitalList" element={<HospitalList/>}/>
        <Route path="/HospitalList/:hospitalname" element={<HospitalDetail/>}/>
        <Route path="/checkout" element={<CheckoutForm/>}/>
        <Route path="/return" element={<Return/>}/>
        <Route path="/ocrspace" element={<HospitalSendResponsePage/>}/>
        <Route path="/about" element={<AboutUs />} />
        <Route path="/appointment1" element={<Appointment1/>}/>
        <Route path="/appointment-status1" element={<UserDetails2/>} />
        <Route path="/fileUpload" element={<FileUpload/>}/>
        <Route path="/hospital" element={<HospitalDetails/>}/>
        </Routes>
        <ToastContainer position="top-center" />
      </Router>
    </>
  );
};

export default App;
