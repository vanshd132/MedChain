import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FileUpload = () => {
    const [userName, setUserName] = useState('');
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.post('http://localhost:4000/check-token', { token })
                .then((response) => {
                    if (response.data.valid) {
                        setUserName(response.data.user.name);
                    } else {
                        localStorage.removeItem('token');
                        navigate('/login');
                    }
                })
                .catch((error) => {
                    localStorage.removeItem('token');
                    navigate('/login');
                });
        }
    }, [navigate]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setMessage('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`http://localhost:4000/api/hospitals/users/${userName}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                setMessage('File uploaded and user updated successfully');
                setFile(null);
            } else {
                setMessage('Failed to upload file');
            }
        } catch (error) {
            setMessage('Error uploading file: ' + error.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-semibold mb-6 text-center text-blue-600">
                    Upload Your File, {userName}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col">
                        <label className="block text-lg font-medium text-gray-700 mb-2">Select a file</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            required
                            className="px-4 py-2 w-full text-gray-600 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white text-lg font-semibold rounded-md shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Upload File
                    </button>
                </form>

                {message && (
                    <p className={`mt-4 text-center text-sm ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
