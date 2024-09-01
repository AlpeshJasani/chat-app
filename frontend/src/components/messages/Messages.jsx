import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";

const Messages = () => {
	const { messages, loading } = useGetMessages(); // Fetch messages and loading state
	useListenMessages(); // Set up a listener for incoming messages // Socket functionality // returns Nothing
	const lastMessageRef = useRef(); // Ref to track the last message in the list

	useEffect(() => {
		// Scroll to the last message whenever the messages array changes
		setTimeout(() => { 
			lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 100); // Delay added for smooth scrolling
	}, [messages]); // Dependency array to re-run the effect when messages change

	return (
		<div className='px-4 flex-1 overflow-auto'>
			{/* Render messages if not loading and messages exist */}
			{!loading && 
				messages.length > 0 &&
				messages.map((message) => (
					<div key={message._id} ref={lastMessageRef}> {/* Specify key,ref for go to the last message */}
						<Message message={message} /> {/* Render individual message */}
					</div>
				))}

			{/* Show skeleton loaders while messages are loading */}
			{loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}

			{/* Display a message if there are no messages after loading */}
			{!loading && messages.length === 0 && (
				<p className='text-center'>Send a message to start the conversation</p>
			)}
		</div>
	);
};
export default Messages;

// STARTER CODE SNIPPET
// import Message from "./Message";

// const Messages = () => {
// 	return (
// 		<div className='px-4 flex-1 overflow-auto'>
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 		</div>
// 	);
// };
// export default Messages;
