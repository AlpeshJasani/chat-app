import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {  // save by _id for the user
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, { // JWT_SECRET is the key
		expiresIn: "15d",
	});

	res.cookie("jwt", token, { // properties
		maxAge: 15 * 24 * 60 * 60 * 1000, // in ms
		httpOnly: true, // prevent XSS attacks cross-site scripting attacks // user can't access this cookies via javascript
		sameSite: "strict", // CSRF attacks cross-site request forgery attacks
		secure: process.env.NODE_ENV !== "development", //true
	});
};

export default generateTokenAndSetCookie;


// cookies are used to store a JSON Web Token (JWT) on the client's browser, 
// and this token helps identify the user who sent the request in subsequent interactions with the server. 

// 1. Setting the Cookie with JWT
// When a user signs up or logs in, the server generates a JWT that includes the user's ID (userId) as part of its payload. 
// This JWT is then sent to the client's browser as a cookie.
// 2. Identifying the User from the Cookie
// In subsequent requests (like accessing a protected route or sending a message), the client's browser automatically 
// includes this JWT cookie in the request headers. The server can then decode this JWT to determine which user made the request.

// more in github Notes