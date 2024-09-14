const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const authRoutes = require('./routes/auth');
const verifyToken = require('./middleware/verifyToken');
const cors = require('cors')

// initialize the app

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// middleware

app.use(express.json());  
app.use(cors());

app.use('/api/auth', authRoutes);

// test server

app.get('/', (req, res) => {
    res.send("Server is running");
});
app.get('/api/protected', verifyToken, (req, res) => {
    res.json({ message: 'This is a protected route' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// mongodb connection function

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch(err) {
        console.error(err.message);
        process.exit(1);
    }
};

connectDB();

// handle socket.io connections
io.on('connection', (socket) => {
    console.log('A user connected');
  
    // Listening for 'message' event from the client
    socket.on('message', ({ room, message, username }) => {
      console.log(`Message from ${username}: ${message}`);
      
      // Broadcast the message to everyone in the room
      io.to(room).emit('message', { username, message });
    });
  
    socket.on('joinRoom', (room) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);
      socket.to(room).emit('message', { username: 'System', message: `${socket.id} has joined the room.` });
    });
  
    socket.on('disconnect', () => {
      console.log('User has disconnected');
    });
  });
  
 
