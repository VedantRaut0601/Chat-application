import './Chat.css';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Initialize the socket connection outside the component to avoid reconnecting on every render
const socket = io('http://localhost:5000');  // Match backend URL

const Chat = () => {
  const [message, setMessage] = useState('');  // State for the input message
  const [messages, setMessages] = useState([]);  // State for all messages in the chat
  const username = localStorage.getItem('username');  // Retrieve username from localStorage

  useEffect(() => {
    // Join the room and listen for messages
    socket.emit('joinRoom', { username, room: 'room1' });

    // Listen for messages from the server and update the messages state
    socket.on('message', (msg) => {
      console.log('Received message:', msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Clean up the socket listener when the component unmounts
    return () => {
      socket.off('message');
    };
  }, [username]);

  const sendMessage = () => {
    if (message.trim()) {
      // Emit the message to the server with username and room info
      socket.emit('message', { room: 'room1', message, username });
      setMessage('');  // Clear the input field after sending the message
    }
  };

  return (
    <div>
      <h2>Chat Room</h2>
      <div className="chat-box">
        <ul className="messages-list">
          {messages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.username}: </strong> {msg.message}
            </li>
          ))}
        </ul>
      </div>
      <div className="input-box">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
