import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
	const { socket } = useSocketContext(); // Access the socket instance from the SocketContext
	const { messages, setMessages } = useConversation(); // Access the current messages and the function to update them from Zustand global state

	useEffect(() => {
		// Listen for the 'newMessage' event from the server
		socket?.on("newMessage", (newMessage) => { // If socket is null or undefined, this line would throw an error, so '?'
			newMessage.shouldShake = true; // Add a flag to the new message to indicate it should shake (used for UI purposes) // managed in Message.jsx

			// Add a flag to the new message to indicate it should shake (used for UI purposes)
			const sound = new Audio(notificationSound);
			sound.play();

			// Add the new message to the existing list of messages
			setMessages([...messages, newMessage]);
		});

		// Clean up the event listener when the component is unmounted or dependencies change
		return () => socket?.off("newMessage"); // IMP - does not multiply the sound, old one is gone off
	}, [socket, setMessages, messages]); // The effect depends on socket, setMessages, and messages
};
export default useListenMessages;

// This hook returns Nothing