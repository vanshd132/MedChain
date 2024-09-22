import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const HospitalDetails = () => {
    const { name } = useParams(); // Extract hospital name from the URL
    const [hospital, setHospital] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        fetchHospitalDetails();
    }, [name]);

    const handleUserNameChange = (e) => {
        setUserName(e.target.value);
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const fetchHospitalDetails = async () => {
        setLoading(true);
        setError(null);
        setHospital(null);

        try {
            const response = await axios.get(`http://localhost:4000/api/hospitals/${name}`);
            setHospital(response.data);
        } catch (err) {
            setError(err.response ? err.response.data.error : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();

        if (!selectedFile || !userName) {
            setError('Please select a file and enter a user name');
            return;
        }

        if (!selectedFile.name.match(/\.(jpg|jpeg|png|pdf)$/)) {
            setError('Please select a valid file type (jpg, jpeg, png, pdf)');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            await axios.post(`http://localhost:4000/api/hospitals/${name}/users/${userName}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('File uploaded successfully');
            setSelectedFile(null);
            setUserName('');
            fetchHospitalDetails(); // Refresh the hospital details after upload
        } catch (err) {
            setError(err.response ? err.response.data.error : 'An error occurred');
        }
    };

    return (
        
        <div className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-lg overflow-hidden">
            
            <h1 className="text-5xl font-extrabold mb-10 text-center text-blue-700 underline overflow-hidden">Hospital Details</h1>

            {loading && (
                <div className="mb-6 p-4 bg-blue-200 text-blue-800 border border-blue-400 rounded-lg shadow-md">
                    <p>Loading hospital details...</p>
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-red-200 text-red-800 border border-red-400 rounded-lg shadow-md">
                    <p>Error: {error}</p>
                </div>
            )}

            {hospital && (
                <div>
                    <h2 className="text-4xl font-bold mb-6 text-center text-pink-600 overflow-hidden">{hospital.hospitalname}</h2>
                    <p className="text-xl mb-4"><strong>Address:</strong> {hospital.address}</p>

                    {/* Doctors Section */}
                    <div className="mb-8 p-6 bg-white shadow-lg rounded-lg">
                        <h3 className="text-2xl font-semibold mb-4 text-blue-600">Doctors</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Experience</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Speciality</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {hospital.doctors && hospital.doctors.length > 0 ? (
                                        hospital.doctors.map((doctor, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">{doctor.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">{doctor.experience} years</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">{doctor.speciality}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">No doctors available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Users Section */}
                    <div className="mb-8 p-6 bg-white shadow-lg rounded-lg">
                        <h3 className="text-2xl font-semibold mb-4 text-blue-600">Users</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Files</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {hospital.data && hospital.data.length > 0 ? (
                                        hospital.data.map((user, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">{user.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">{user.phone}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
                                                    <ul className="list-disc list-inside pl-4">
                                                        {user.filename && user.filename.length > 0 ? (
                                                            user.filename.map((file, fileIndex) => (
                                                                <li key={fileIndex}>
                                                                    <a 
                                                                        href={`http://localhost:4000/uploads/${file}`} 
                                                                        download
                                                                        className="text-blue-600 hover:underline"
                                                                    >
                                                                        {file}
                                                                    </a>
                                                                </li>
                                                            ))
                                                        ) : (
                                                            <p>No files available</p>
                                                        )}
                                                    </ul>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">No users available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Second Opinions Section */}
                    {hospital.secondOpinions && hospital.secondOpinions.length > 0 && (
                        <div className="mb-8 p-6 bg-white shadow-lg rounded-lg">
                            <h3 className="text-2xl font-semibold mb-4 text-blue-600">Second Opinions</h3>
                            <ul>
                                {hospital.secondOpinions.map((opinion, index) => (
                                    <li key={index} className="mb-4">
                                        <h4 className="text-xl font-semibold">{opinion.name}</h4>
                                        <p>{opinion.description}</p>
                                        {opinion.filename && (
                                            <img 
                                                src={`http://localhost:4000/uploads/${opinion.filename}`} 
                                                alt={`Second opinion image ${index}`} 
                                                className="mt-2 w-48 h-48 object-cover"
                                            />
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* File Upload Section */}
                    <div className="p-6 bg-white shadow-lg rounded-lg">
                        <h3 className="text-2xl font-semibold mb-4 text-blue-600">Upload File</h3>
                        <form onSubmit={handleFileUpload}>
                            <div className="flex flex-col md:flex-row gap-4 mb-6">
                                <input
                                    type="text"
                                    placeholder="Enter user name"
                                    value={userName}
                                    onChange={handleUserNameChange}
                                    required
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                />
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    required
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-500"
                            >
                                Upload File
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HospitalDetails;
