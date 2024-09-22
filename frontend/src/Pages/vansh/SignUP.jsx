import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode'; // Ensure proper import
import axios from 'axios';

function SignUp() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    password: '',
    role: 'user',
    address: ''
  });
  const [isHospital, setIsHospital] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setFormData({
      ...formData,
      role: selectedRole,
      address: selectedRole === 'hospital' ? formData.address : '' // Reset address if not hospital
    });
    setIsHospital(selectedRole === 'hospital');
  };

  const handleLocalSignUp = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        email: formData.email, 
        name: isHospital ? formData.name : formData.name, // Send name as "hospitalname" for hospitals
        phone: formData.phone, 
        password: formData.password,
        role: formData.role,
        ...(isHospital && { address: formData.address }) // Add address if hospital
      };
      
      const response = await axios.post('http://localhost:4000/signup', payload);
      console.log(response.data);

      if (response.data.success) {
        navigate(`/user/${formData.name}`);
      } else {
        alert('Signup failed');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('Error during signup');
    }
  };

  const handleGoogleSignUpSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const emailFromGoogle = decoded.email;
      axios.post('http://localhost:5000/api/users', { email: emailFromGoogle })
        .then(response => {
          if (response.data.done) {
            navigate(`/hospital/${emailFromGoogle}`);
          } else {
            alert('Invalid email from Google');
          }
        })
        .catch(error => {
          console.error('Error checking Google email:', error);
          alert('Error checking email');
        });
    } catch (error) {
      console.error('Error decoding Google token:', error);
    }
  };

  const handleGoogleLoginFailure = (error) => {
    console.error('Google Login Failed:', error);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #d0eaff 20%, #f9a8a8 100%)',
      margin: 0,
      width: '100%'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '500px', // Increased width of the white box
        backgroundColor: '#fff',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
        textAlign: 'center',
        margin: '50px' // Removed vertical centering, added top margin
      }}>
        {/* Center the image */}
        <div style={{
          display: 'flex',
          justifyContent: 'center'
        }}>
          <img 
            src='https://st2.depositphotos.com/4362315/7819/v/450/depositphotos_78194048-stock-illustration-medical-logo-health-care-center.jpg'
            style={{ width: '60%', borderRadius: '50%' }} 
            alt="Medical Logo"
          />
        </div>
        <h2>MED-CHAIN</h2>

        <form onSubmit={handleLocalSignUp} style={{ marginBottom: '20px' }}>
          {/* Email Input */}
          <div style={{ marginBottom: '15px', textAlign: 'left' }}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '10px', borderRadius: '5px' }}
              placeholder="Enter your email"
              required
            />
          </div>
          
          {/* Name Input */}
          <div style={{ marginBottom: '15px', textAlign: 'left' }}>
            <label>{isHospital ? 'Hospital Name' : 'Name'}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '10px', borderRadius: '5px' }}
              placeholder={isHospital ? 'Enter hospital name' : 'Enter your name'}
              required
            />
          </div>

          {/* Phone Input */}
          <div style={{ marginBottom: '15px', textAlign: 'left' }}>
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '10px', borderRadius: '5px' }}
              placeholder="Enter your phone number"
              required
            />
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: '15px', textAlign: 'left' }}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '10px', borderRadius: '5px' }}
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Role Selection */}
          <div style={{ marginBottom: '15px', textAlign: 'left' }}>
            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleRoleChange}
              style={{ width: '100%', padding: '10px', borderRadius: '5px' }}
              required
            >
              <option value="user">User</option>
              <option value="hospital">Hospital</option>
            </select>
          </div>

          {/* Address Input for Hospital */}
          {isHospital && (
            <div style={{ marginBottom: '15px', textAlign: 'left' }}>
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', borderRadius: '5px' }}
                placeholder="Enter hospital address"
              />
            </div>
          )}

          <button type="submit" style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            Sign Up
          </button>
        </form>

        {/* Center the Google Login button */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          marginBottom: '20px'
        }}>
          <GoogleLogin
            onSuccess={handleGoogleSignUpSuccess}
            onError={handleGoogleLoginFailure}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginTop: '10px' }}>
          <span>Already have an account? </span>
          <a href="/login" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>Login</a>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
