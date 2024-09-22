import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div style={{
            width: window.innerWidth*99/100
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: 'linear-gradient(135deg, #f9a8a8 20%, #d0eaff 100%)',
                textAlign: 'center',
                color: '#333',
                fontFamily: 'Arial, sans-serif'
            }}>
                <h1 style={{ fontSize: '4rem', margin: 0 }}>404</h1>
                <p style={{ fontSize: '1.5rem' }}>Oops! Page not found.</p>
                <p>The page you are looking for does not exist.</p>
                <Link to="/" style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    textDecoration: 'none',
                    borderRadius: '5px',
                    fontSize: '1rem'
                }}>
                    Go to Homepage
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
