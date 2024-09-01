import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation(); // Access state and actions from Zustand store

	const sendMessage = async (message) => {
		setLoading(true);
		try {
			// Send message to the backend API
			const res = await fetch(`/api/messages/send/${selectedConversation._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json", // Specify that we're sending JSON
				},
				body: JSON.stringify({ message }), // Convert message to JSON format
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);

			setMessages([...messages, data]);  // Update messages in Zustand store with the newly sent message
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};
export default useSendMessage;
