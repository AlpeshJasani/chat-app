import { create } from "zustand";

const useConversation = create((set) => ({
	selectedConversation: null, // Initial state for the selected conversation // SelectedConversation -> have 1 fullName || null
	setSelectedConversation: (selectedConversation) => set({ selectedConversation }), // Action to update selectedConversation
	messages: [], // Initial state for messages
	setMessages: (messages) => set({ messages }), // Action to update messages
}));

export default useConversation;	

// useConversation: This is the custom hook created by Zustand to manage the state related to conversations.

// create Function: It initializes the Zustand store with the provided function. This function receives set, 
// which is a function used to update the state.