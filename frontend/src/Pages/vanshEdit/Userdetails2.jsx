import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Chatbot from '../../components/vansh/Chatbot';
import Navbar from '../../components/Navbar'

const UserDetails2 = () => {
    const { name } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        handleFetchUserDetails();
    }, [name]);

    const handleFetchUserDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:4000/user-details1', {
                params: { name }
            });
            setUser(response.data);
            setError('');
        } catch (error) {
            setError('Error fetching user details.');
            setUser(null);
            toast.error('Error fetching user details.');
            console.error('Error fetching user details:', error);
        }
        setLoading(false);
    };

    const isPdf = (fileName) => fileName.endsWith('.pdf');

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-100 via-white to-blue-100">
            <Navbar />
            {/* Header Section */}
            <header className="bg-gradient-to-r from-purple-500 to-blue-600 text-white text-center py-12">
                <h1 className="text-5xl font-extrabold mb-4 overflow-hidden">User Details</h1>
                <p className="text-xl mb-6">Detailed information and uploaded files</p>
            </header>

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-md p-6 hidden lg:block">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Additional Info</h2>
                    <p className="text-gray-700 mb-4">This section provides additional details and insights related to the user and their files.</p>
                    <ul className="space-y-2">
                        <li><a href="#images" className="text-blue-600 hover:underline">Uploaded Images</a></li>
                        <li><a href="#pdfs" className="text-blue-600 hover:underline">Uploaded PDFs</a></li>
                    </ul>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8 max-w-9xl mx-auto">
                    <Chatbot />

                    {/* Content Area */}
                    <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                        {/* Error Handling */}
                        {error && (
                            <div className="mb-6">
                                {toast.error(error)}
                            </div>
                        )}

                        {/* Main Content Division */}
                        {user ? (
                            <div className="flex flex-col gap-8">
                                {/* Top Half: Horizontal Division */}
                                <div className="flex flex-col md:flex-row gap-8 mb-8">
                                    

                                    {/* Left Side: User Info and PDFs */}
                                    <div className="flex-1 flex flex-col gap-8">
                                        {/* User Info */}
                                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                            <h3 className="text-2xl font-semibold mb-4 text-gray-800">User Information</h3>
                                            <p className="text-lg font-medium text-gray-700 mb-2">Name: <span className="font-semibold">{user.name}</span></p>
                                            <p className="text-lg font-medium text-gray-700 mb-2">Phone: <span className="font-semibold">{user.phone}</span></p>
           
                                            <p className="text-lg font-medium text-gray-700 mb-4">Doctor: <span className="font-semibold">{user.doctor}</span></p>
                                        </div>

                                        {/* Uploaded PDFs */}
                                        <div id="pdfs" className="min-h-80 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                            <h3 className="text-xl font-semibold mb-3 text-gray-800">Uploaded PDFs:</h3>
                                            <div>
                                                {user.files && user.files.length > 0 ? (
                                                    user.files.filter(file => isPdf(file)).map((file, index) => (
                                                        <div key={index} className="mb-2">
                                                            <a
                                                                href={`http://localhost:4000/uploads/${file}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                {file}
                                                            </a>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-600">No PDF files uploaded.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Right Side: User Images */}
                                    <div className="flex-1 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                        <h3 className="text-xl font-semibold mb-3 text-gray-800">Uploaded Images:</h3>
                                        <div className="flex flex-wrap gap-4">
                                            {user.files && user.files.length > 0 ? (
                                                user.files.filter(file => !isPdf(file)).map((file, index) => (
                                                    <div key={index} className="w-40 h-40 bg-gray-200 rounded-md overflow-hidden">
                                                        <a 
                                                            href={`http://localhost:4000/uploads/${file}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="block w-full h-full"
                                                        >
                                                            <img 
                                                                src={`http://localhost:4000/uploads/${file}`} 
                                                                alt={file}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        </a>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-600">No images uploaded.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Half: Loading Spinner or No Details */}
                                {loading && (
                                    <div className="flex justify-center items-center mt-6">
                                        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0z"></path>
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ) : (
                            !loading && <p className="text-center text-gray-600">No user details available.</p>
                        )}
                    </div>
                </main>
            </div>

            {/* Footer */}
            <footer id="footer" className="bg-blue-600 text-white text-center py-6 mt-8">
                <p className="text-lg mb-2">© 2024 Your Company. All rights reserved.</p>
                <a
                    href="mailto:contact@yourcompany.com"
                    className="text-blue-200 hover:underline"
                >
                    contact@yourcompany.com
                </a>
            </footer>

            {/* Render Chatbot component */}
            <Chatbot />
        </div>
    );
};

export default UserDetails2;
