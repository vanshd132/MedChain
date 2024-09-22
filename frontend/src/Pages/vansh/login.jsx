import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useEffect } from 'react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Retrieved token:', token);

        if (token) {
            axios.post('http://localhost:4000/check-token', { token })
                .then((response) => {
                    console.log('Token validation response:', response.data.user);

                    if (response.data.valid) {
                        navigate(`/user/${response.data.user.name}`); // Adjust based on your response
                    } else {
                        localStorage.removeItem('token');
                        navigate('/login');
                    }
                })
                .catch((error) => {
                    console.error('Error validating token:', error);
                    localStorage.removeItem('token');
                    navigate('/login');
                });
        }
    }, [navigate]);


    const handleLocalLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:4000/user-details1`, {
                params: { email }
            });
            if (response.data.exists) {
                if (response.data.role === "user") {
                    navigate(`/user/${response.data.name}`);
                } else {
                    navigate(`/hospital/${response.data.name}`);
                }
            } else {
                alert('Invalid email or password');
            }
        } catch (error) {
            console.error('Error checking email:', error);
            alert('Error checking email');
        }
    };

    const handleGoogleLoginSuccess = async (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);
            const email = decoded.email;
            const response = await axios.get(`http://localhost:4000/user-details1/${email}`)


                
            if (response.data.exists) {

                localStorage.setItem('token', response.data.token);  //toekn

                if (response.data.role === "user") {
                    navigate(`/user/${response.data.name}`);
                } else {
                    navigate(`/hospital/${response.data.name}`);
                }
            } else {
                alert('Invalid email or password');
            }
        } catch (error) {
            console.error('Error checking email:', error);
            alert('Error checking email');
        }
    };
    const handleGoogleLoginFailure = (error) => {
        console.error('Google Login Failed:', error);
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: 'linear-gradient(135deg, #d0eaff 20%, #f9a8a8 100%)',
            margin: 0,
            width: '100%'
        }}>
            <div style={{
                height: 'auto',
                maxWidth: '30%',
                backgroundColor: '#fff',
                padding: '20px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: '10px',
                textAlign: 'center',
                margin: 'auto'
            }}>
                <img src='https://st2.depositphotos.com/4362315/7819/v/450/depositphotos_78194048-stock-illustration-medical-logo-health-care-center.jpg'
                    style={{ width: '60%', borderRadius: '50%', margin: '0 auto' }} /> {/* Centering the image */}
                <h2 style={{ fontWeight: 'bold' }}>MED-CHAIN</h2> {/* Making MED-CHAIN bold */}

                <form onSubmit={handleLocalLogin} style={{ marginBottom: '20px' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '15px',
                        textAlign: 'left'
                    }}>
                        <label htmlFor="email" style={{
                            marginRight: '10px',
                            minWidth: '60px'
                        }}>Email</label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: '80%',
                                padding: '10px',
                                boxSizing: 'border-box',
                                border: '1px solid #ccc',
                                borderRadius: '5px'
                            }}
                            placeholder="Enter your email"
                        />
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '15px',
                        textAlign: 'left'
                    }}>
                        <label htmlFor="password" style={{
                            marginRight: '10px',
                            minWidth: '60px'
                        }}>Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '80%',
                                padding: '10px',
                                boxSizing: 'border-box',
                                border: '1px solid #ccc',
                                borderRadius: '5px'
                            }}
                            placeholder="Enter your password"
                        />
                    </div>
                    <button type="submit" style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}>
                        Login
                    </button>
                </form>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '10px',
                    width: '100%',
                    height: 'auto',
                    scrollbarWidth: 'none', // For Firefox
                    msOverflowStyle: 'none' // For IE and Edge
                }}>
                    <style>
                        {`
      ::-webkit-scrollbar {
        display: none;
      }
    `}
                    </style>
                    <GoogleLogin
                        onSuccess={handleGoogleLoginSuccess}
                        onError={handleGoogleLoginFailure}
                        style={{
                            width: '100%'
                        }}
                    >
                        <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%'
                        }}>
                            Sign in with Google
                        </span>
                    </GoogleLogin>
                </div>

                <div style={{ marginTop: '10px' }}>
                    <span>Don't have an account? </span>
                    <a href="/signup" style={{
                        color: '#007bff',
                        textDecoration: 'none',
                        fontWeight: 'bold'
                    }}>Sign Up</a>
                </div>
            </div>
        </div>
    );
}

export default Login;
