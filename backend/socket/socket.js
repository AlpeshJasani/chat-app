import { Server } from "socket.io"; 
import http from "http";            
import express from "express";      

const app = express();  // Creating an Express application

// Creating an HTTP server using the Express app
const server = http.createServer(app);

// Creating a Socket.IO server and attaching it to the HTTP server
const io = new Server(server, {
	cors: { // Cross-Origin Resource Sharing - security feature
		origin: ["http://localhost:3000"], // Allow requests from the frontend app
		methods: ["GET", "POST"],          // Allow GET and POST methods
	},
});

// Function to get the socket ID of a specific user by their user ID
export const getReceiverSocketId = (receiverId) => { // used in message contoller to send message to receiver
	return userSocketMap[receiverId];  // Returns the socket ID for the given user ID
};

// Object to map user IDs to their socket IDs
const userSocketMap = {}; // { userId: socketId }

// Handling a new client connection
io.on("connection", (socket) => {
	console.log("A user connected", socket.id);  // Log the connection with the socket ID

	// Retrieve the user ID from the connection's query parameters(front-end) // i.e. {userId: authUser._id}
	const userId = socket.handshake.query.userId;

	// If the user ID is valid, map the user ID to the socket ID
	if (userId != "undefined") userSocketMap[userId] = socket.id;

	// Emit the list of currently online users to all connected clients
	io.emit("getOnlineUsers", Object.keys(userSocketMap)); // green Mark on profilePic 

	// socket.on() is used to listen to the events. can be used both on client and server side
	// Listen for the 'disconnect' event, which occurs when the client disconnects
	socket.on("disconnect", () => {
		console.log("User disconnected", socket.id);  // Log the disconnection with the socket ID
		
		delete userSocketMap[userId]; // Remove the user from the userSocketMap when they disconnect
		
		// Emit the updated list of online users to all connected clients
		io.emit("getOnlineUsers", Object.keys(userSocketMap));  // green Mark on profilePic 
	});
});

// Export the app, io (Socket.IO instance), and server for use in other files
export { app, io, server };



// CORS (Cross-Origin Resource Sharing) is a security feature implemented in web browsers that controls how web applications hosted on different origins (domains) can interact with each other. It is designed to prevent malicious websites from making unauthorized requests to a different domain than the one that served the web page.