import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
	// console.log("message sent", req.params.id);
	try {
		// 3 objects -> req.params,req.body,req.user
		// req.params,req.body -> came with req from client // req.user came from middleware..
		const { message } = req.body; // The message content is extracted from the body of the request.
		// This line uses destructuring to extract the message property from the req.body object.
		// req.body contains the data sent by the client in the body of the request, typically in a POST or PUT request.
		const { id: receiverId } = req.params; // req.params.id -> to get id of route // extracted from the URL parameter 
		// const id = req.params.id; <=> const { id: receiverId } = req.params; // Here, id renamed to receiverId to avoid confusion 
		const senderId = req.user._id; // The senderId is extracted from the authenticated user's details (assuming req.user is populated by some authentication middleware). This represents the ID of the user sending the message.
		// This line retrieves the _id property from the req.user object and assigns it to senderId.
		// req.user typically contains the authenticated user’s information, assuming you’re using 
		// a middleware like Passport.js or a custom authentication middleware that populates req.user.

		// res.send(`Message from ${senderId} to ${receiverId}: "${message}"`);

		let conversation = await Conversation.findOne({ // store in conversation variable
			participants: { $all: [senderId, receiverId] }, // mongoose's syntex
		}); 

		if (!conversation) { // if there is no conversation , create one
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		const newMessage = new Message({
			senderId, // same as senderId : senderId,
			receiverId,
			message,
		});

		if (newMessage) { // if newMessage successfully created..
			conversation.messages.push(newMessage._id);
		}

		// await conversation.save();
		// await newMessage.save();

		// this will run in parallel
		await Promise.all([conversation.save(), newMessage.save()]);

		// SOCKET IO FUNCTIONALITY WILL GO HERE // message is saved in database, and now send it to receiver
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) { // if this User is online
			// io.to(<socket_id>).emit() used to send events to specific client // io.emit() for Broadcast
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params; // id field -> renamed to userToChatId // got from url // id of user that we chating with.
		const senderId = req.user._id; // that is us // coming from protectRoute middleware.

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] }, // Have all message's _id(REFERENCE)
		}).populate("messages"); // now, NOT REFERENCE BUT ACTUAL MESSAGES.

		if (!conversation) return res.status(200).json([]); // if conversation not exist

		const messages = conversation.messages; // only messages

		res.status(200).json(messages); // send to client
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
