import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import axios from 'axios'; // To make HTTP requests

const OCRComponent = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [aiResponse, setAiResponse] = useState(''); // Store AI response here
  const [loading, setLoading] = useState(false); // General loading state for OCR
  const [aiLoading, setAiLoading] = useState(false); // Specific loading state for AI

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setOcrText(''); // Reset the OCR text on new image selection
      setAiResponse(''); // Reset AI response on new image selection
    }
  };

  const handleOcr = async () => {
    if (!selectedImage) {
      alert('Please select an image first.');
      return;
    }

    setLoading(true);
    setOcrText('Processing...');
    setAiResponse(''); // Reset AI response before processing

    try {
      // Use Tesseract.js to recognize text from the selected image
      const result = await Tesseract.recognize(selectedImage, 'eng', {
        logger: (info) => console.log(info), // Log OCR progress
      });

      const extractedText = result.data.text;
      setOcrText(extractedText);

      // Send OCR result to AI for analysis
      setAiLoading(true); // Start AI loading
      const aiResult = await axios.post('http://localhost:4000/prescription', {
        userInput: extractedText
      });

      setAiResponse(aiResult.data.ai); // Update with AI response
    } catch (error) {
      setOcrText('An error occurred while processing the image.');
    } finally {
      setLoading(false);
      setAiLoading(false); // End AI loading
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-white p-6">
      <div className="max-w-lg w-full p-8 bg-white shadow-2xl rounded-xl transition-transform duration-500 hover:shadow-xl">
        <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-8">OCR with Med-Chain</h1>

        {/* Image upload input */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fileUpload">
            Upload Medical Report:
          </label>
          <input
            type="file"
            accept="image/*"
            id="fileUpload"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300"
          />
        </div>

        {/* Show selected image */}
        {selectedImage ? (
          <div className="mb-6">
            <img
              src={selectedImage}
              alt="Selected"
              className="w-auto h-auto max-h-65 object-cover border-2 border-gray-200 rounded-lg shadow-md"
            />
          </div>
        ) : (
          <div className="mb-6 p-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-center text-gray-500">
            <p className="text-lg font-medium">No image selected</p>
            <p>Upload your medical report to start the OCR process</p>
          </div>
        )}

        {/* OCR Button */}
        <button
          onClick={handleOcr}
          className={`w-full px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-green-400 rounded-lg hover:from-blue-600 hover:to-green-500 transition duration-300 ${
            loading ? 'cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <span className="loader"></span>
              <span>Processing...</span>
            </div>
          ) : (
            'Run OCR'
          )}
        </button>

        {/* OCR result */}
        {ocrText ? (
          <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-inner">
            <h2 className="text-xl font-bold text-gray-700 mb-4">OCR Result:</h2>
            <pre className="whitespace-pre-wrap break-words text-gray-600">{ocrText}</pre>
          </div>
        ) : (
          !loading && (
            <div className="mt-8 p-6 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-center text-gray-500">
              <p className="text-lg font-medium">No OCR results</p>
              <p>Your OCR results will be shown here after processing</p>
            </div>
          )
        )}

        {/* AI response */}
        {aiLoading ? (
          <div className="mt-8 p-6 bg-blue-50 border border-dashed border-blue-300 rounded-lg text-center text-blue-500">
            <p className="text-lg font-medium">AI Analysis in Progress...</p>
            <div className="flex items-center justify-center space-x-2">
              <span className="loader"></span>
              <span>Processing...</span>
            </div>
          </div>
        ) : aiResponse ? (
          <div className="mt-8 p-6 bg-blue-100 rounded-lg shadow-inner">
            <h2 className="text-xl font-bold text-gray-700 mb-4">AI Analysis:</h2>
            <pre className="whitespace-pre-wrap break-words text-gray-600">{aiResponse}</pre>
          </div>
        ) : (
          !loading && (
            <div className="mt-8 p-6 bg-blue-50 border border-dashed border-blue-300 rounded-lg text-center text-blue-500">
              <p className="text-lg font-medium">No AI analysis yet</p>
              <p>Once OCR is complete, AI analysis will appear here</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default OCRComponent;
