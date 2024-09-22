import React, { useCallback, useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation, useNavigate } from "react-router-dom";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import axios from "axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);
const CheckoutForm = () => {
  const location = useLocation();
  const { amount } = location.state || { amount: 7 }; // Default to 7 if no amount is passed

  const fetchClientSecret = useCallback(() => {
    return fetch(`http://localhost:4000/api/payment/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: amount }),
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, [amount]);

  const options = { fetchClientSecret };

  return (
    <div id="checkout" style={{ width: "100vw" }}>
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};



const Return = () => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUploadStatus, setFileUploadStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessionStatus = async () => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const sessionId = urlParams.get("session_id");

      try {
        const response = await fetch(
          `http://localhost:4000/api/payment/session-status?session_id=${sessionId}`
        );
        const data = await response.json();

        setStatus(data.status);
        setCustomerEmail(data.customer_email);

        if (data.status === "paid") {
          localStorage.setItem('isPaymentSuccessful', 'true');
        } else {
          navigate('/checkout');
        }
      } catch (error) {
        console.error("Error fetching session status:", error);
        navigate('/checkout');
      }
    };

    fetchSessionStatus();
  }, [navigate]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const printFormData = (formData) => {
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
  };
  
  const handleFileUpload = async () => {
    if (!selectedFile) {
      setFileUploadStatus('No file selected');
      return;
    }
  
    const secondOpinionData = JSON.parse(localStorage.getItem('secondOpinionData'));
    if (!secondOpinionData) {
      setFileUploadStatus('No second opinion data found');
      return;
    }
  
    const formData = new FormData();
    formData.append('hospitalname', secondOpinionData.hospitalname);
    formData.append('name', secondOpinionData.name);
    formData.append('description', secondOpinionData.description);
    formData.append('file', selectedFile);
  
    // Print FormData contents for debugging
    printFormData(formData);
  
    try {
      const response = await axios.post('http://localhost:4000/hospital/second-opinion', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setFileUploadStatus('File uploaded successfully');
      localStorage.removeItem('secondOpinionData');
      navigate('/');
    } catch (error) {
      console.error("Error uploading file:", error);
      setFileUploadStatus(`Error uploading file: ${error.response?.data?.error || error.message}`);
    }
  };

  if (status === "paid") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center text-green-600">Payment Successful!</h1>
          <p className="text-lg mb-6 text-center">Please upload your file below:</p>
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full mb-4 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <button
            onClick={handleFileUpload}
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Upload File
          </button>
          {fileUploadStatus && (
            <p className={`mt-4 text-center ${fileUploadStatus.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {fileUploadStatus}
            </p>
          )}
        </div>
      </div>
    );
  }
  

  return (
    <div>
      <h1>Processing Payment...</h1>
      <p>{status === "paid" ? "Payment successful!" : "Payment failed, redirecting..."}</p>
    </div>
  );
};



export { CheckoutForm, Return };