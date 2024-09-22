// Chatbot.js
import React, { useState, useRef } from 'react';

const Chatbot = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef(null);
  const chatHistoryRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInput = inputRef.current.value;
    if (!userInput.trim()) return;

    try {
      const response = await getGeminiResponse(userInput);
      setChatHistory((prev) => [
        ...prev,
        { user: userInput, ai: response.ai },
      ]);
      inputRef.current.value = '';
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getGeminiResponse = async (prompt) => {
    try {
      const response = await fetch('http://localhost:4000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching Gemini response:', error);
      throw error;
    }
  };

  const toggleChatbox = () => {
    setIsVisible((prevState) => !prevState);
  };

  return (
    <div>
      <button
        id="toggleChatBtn"
        onClick={toggleChatbox}
        style={{
          position: 'fixed',
          bottom: '2%',
          right: '2%',
          padding: '12px 24px', // Slightly larger padding for better visibility
          background: 'linear-gradient(to right, #ff6666, #9966ff)', // Darker gradient
          color: '#f0f0f0', // Lighter text color for better contrast
          fontWeight: 'bold', // Bold text to make it stand out
          fontSize: '16px', // Slightly larger font size for readability
          border: 'none',
          borderRadius: '8px', // Slightly larger border radius for a smoother button
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)', // Add shadow to make it pop
          cursor: 'pointer',
          zIndex: 1000,


        }}
      >
        {isVisible ? 'Close Chat' : 'Chat'}
      </button>

      {isVisible && (
        <div
          id="ai"
          style={{
            background: 'linear-gradient(to right, #ffcccc, #ccccff)',
            borderRadius: '5px',
            display: 'flex',
            flexDirection: 'column',
            width: '25%',
            height: '50%',
            border: '1px solid #ccc',
            boxSizing: 'border-box',
            overflow: 'hidden',
            position: 'fixed',
            bottom: '9%',
            right: '2%',
            zIndex: 1000,


          }}
        >
          <div
            id="chatHistory"
            ref={chatHistoryRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '10px',
              fontFamily: 'Roboto, sans-serif',
              fontSize: '16px', // Apply font size here
            }}
          >
            <p style={{ fontSize: '16px' }}>
              <strong>AI:</strong> Hello, how may I help you as an AI assistant?
            </p>
            {chatHistory.map((chat, index) => (
              <div key={index}>
                <p style={{ fontSize: '16px', color: '#333' }}>
                  <strong>You:</strong> {chat.user}
                </p>
                <p style={{ fontSize: '16px', color: '#333' }}>
                  <strong>AI:</strong>{' '}
                  {chat.ai.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </p>
              </div>
            ))}
          </div>
          <form
            id="chatForm"
            onSubmit={handleSubmit}
            style={{
              padding: '10px',
            }}
          >
            <input
              type="text"
              id="prompt"
              name="prompt"
              placeholder="Enter your message"
              ref={inputRef}
              required
              style={{
                width: 'calc(100% - 70px)',
                padding: '5px',
                boxSizing: 'border-box',
                borderRadius: '5px',
              }}
            />
            <button
              type="submit"
              style={{
                width: '60px',
                padding: '8px',
                background: 'linear-gradient(to right, #cc6666, #6666cc)', // Darker gradient
                color: 'white',
                fontWeight: 'bold', // Makes the text stand out
                border: 'none',
                borderRadius: '8px', // Smooths out the button's edges more
                cursor: 'pointer',
                margin: '5px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // Adds a shadow for a 3D effect
                transition: 'background 0.3s ease', // Smooth transition effect
                
              }}
              onMouseOver={(e) => (e.target.style.background = 'linear-gradient(to right, #b35555, #5555b3)')} // Darker hover effect
              onMouseOut={(e) => (e.target.style.background = 'linear-gradient(to right, #cc6666, #6666cc)')}
            >
              Send
            </button>

          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
