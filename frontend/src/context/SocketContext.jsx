import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client"; // socket.io for the client

// SocketContext: This context will be used to share the Socket.IO connection and
// the list of online users throughout the React component tree.
const SocketContext = createContext();

export const useSocketContext = () => { // A custom hook to easily access the SocketContext within any component.
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);  // State to hold the socket instance
	const [onlineUsers, setOnlineUsers] = useState([]); // State to hold the list of online users
	const { authUser } = useAuthContext(); // Access the authenticated user

	useEffect(() => {
		if (authUser) {
			// Initialize the Socket.IO connection when there's an authenticated user

			const socket = io("https://chat-app-drag.onrender.com", { // backend URL
			// const socket = io("http://localhost:5000", { // backend URL
				query: {
					userId: authUser._id, // Send {userId: authUser._id} to the backend via query parameters
				},
			});

			setSocket(socket);

			// socket.on() is used to listen to the events. can be used both on client and server side
			// Listen for the 'getOnlineUsers' event from the server to update the online users list
			socket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			// Clean up the socket connection when the component unmounts or authUser changes
			return () => socket.close();
		} else {
			// If the user logs out, close the socket connection
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [authUser]); // Runs this effect whenever authUser changes

	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
