import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessages = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation(); // Accessing state and actions from Zustand store

	useEffect(() => {
		const getMessages = async () => {
			setLoading(true);
			try {
				const res = await fetch(`/api/messages/${selectedConversation._id}`); // 
				const data = await res.json();
				if (data.error) throw new Error(data.error);
				setMessages(data);  // Set the messages in the Zustand store
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};
		
		// Only fetch messages if a conversation is selected (i.e., has an _id)
		if (selectedConversation?._id) getMessages();
	}, [selectedConversation?._id, setMessages]);

	return { messages, loading };
};
export default useGetMessages;
