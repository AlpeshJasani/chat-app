import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
	try {
		const { fullName, username, password, confirmPassword, gender } = req.body; // came from frontend

		if (password !== confirmPassword) {
			return res.status(400).json({ error: "Passwords don't match" });
		}

		const user = await User.findOne({ username });

		if (user) {
			return res.status(400).json({ error: "Username already exists" });
		}

		// HASH PASSWORD HERE
		const salt = await bcrypt.genSalt(10); // 10 digits
		const hashedPassword = await bcrypt.hash(password, salt);

		// Api -> https://avatar-placeholder.iran.liara.run/

		const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
		const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

		const newUser = new User({
			fullName,
			username,
			password: hashedPassword,
			gender,
			profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
		});

		if (newUser) {
			// Generate JWT token here and save the cookie
			generateTokenAndSetCookie(newUser._id, res); // mongoose created _id, we can access
			await newUser.save();

			res.status(201).json({  // to webpage i think // doesn't have password
				_id: newUser._id,
				fullName: newUser.fullName,
				username: newUser.username,
				profilePic: newUser.profilePic,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const login = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
		// user?.password || "" -> ? for what if user not exist in database, it will throw error, so use <|| ""> "or empty string"

		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" }); // on users pc
		}

		generateTokenAndSetCookie(user._id, res); 

		res.status(200).json({ // send to user's pc
			_id: user._id,
			fullName: user.fullName,
			username: user.username,
			profilePic: user.profilePic,
		});
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const logout = (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 }); // erace
		res.status(200).json({ message: "Logged out successfully" }); // on user's pc
	} catch (error) {
		console.log("Error in logout controller", error.message); // on server log
		res.status(500).json({ error: "Internal Server Error" }); // on user's pc
	}
};
