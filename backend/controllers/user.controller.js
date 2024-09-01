import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id; // got from protectRoute middleware

		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password"); // ne - not equel // don't select passwords

		res.status(200).json(filteredUsers); // send to client
	} catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
