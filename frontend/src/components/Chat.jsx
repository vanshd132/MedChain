import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000'); // Adjust URL as necessary

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('private message', (data) => {
      console.log('Received private message:', data); // Debugging line
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: data.sender,
          recipient: data.recipient,
          message: data.message,
          timestamp: new Date(data.timestamp),
        },
      ]);
    });

    socket.on('user list', (userList) => {
      setUsers(userList);
    });

    return () => {
      socket.off('private message');
      socket.off('user list');
    };
  }, []);

  const registerUser = () => {
    if (username) {
      socket.emit('register', { username });
    }
  };

  const sendMessage = () => {
    if (message && selectedUser) {
      console.log('Sending message:', { sender: username, recipient: selectedUser, message }); // Debugging line
      socket.emit('private message', {
        sender: username,
        recipient: selectedUser,
        message,
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: username, recipient: selectedUser, message, timestamp: new Date() },
      ]);
      setMessage('');
    }
  };

  return (
    <div className="App p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={registerUser}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Register
        </button>
      </div>
      <div className="mb-4">
        <select
          onChange={(e) => setSelectedUser(e.target.value)}
          value={selectedUser}
          className="border p-2 rounded"
        >
          <option value="">Select User</option>
          {users.map(user => (
            <option key={user} value={user}>{user}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <textarea
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 rounded w-full h-32"
        />
        <button
          onClick={sendMessage}
          className="bg-green-500 text-white p-2 rounded mt-2"
        >
          Send
        </button>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Messages</h2>
        <div className="border p-2 rounded">
          {messages.map((msg, index) => (
            <div key={index} className="mb-2 p-2 border border-gray-300 rounded">
              <div><strong>From:</strong> {msg.sender}</div>
              <div><strong>To:</strong> {msg.recipient}</div>
              <div><strong>Message:</strong> {msg.message}</div>
              <div><em>{new Date(msg.timestamp).toLocaleTimeString()}</em></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Chat;