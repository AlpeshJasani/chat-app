import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;

		if (!token) { // if no token
			return res.status(401).json({ error: "Unauthorized - No Token Provided" });
		}

		// if there is a token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) { // if decoded = false
			return res.status(401).json({ error: "Unauthorized - Invalid Token" });
		}

		const user = await User.findById(decoded.userId).select("-password"); // remove password

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		req.user = user;

		next(); // call next fun // that is gonna be sendMessage.. in route

	} catch (error) {
		console.log("Error in protectRoute middleware: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export default protectRoute;
