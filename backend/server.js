import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js"; // imported express server and app


dotenv.config(); // call the fun // init. to exess environment variable.

const __dirname = path.resolve();  // absolute path to the current directory
// PORT should be assigned after calling dotenv.config() because we need to access the env variables. Didn't realize while recording the video. Sorry for the confusion.
const PORT = process.env.PORT || 5000;

app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser()); // use middleware // to parse the incoming cookies from req.cookies 

app.use("/api/auth", authRoutes); // used middleware (app.use())
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")));  // dist folder is created in during Build 

app.get("*", (req, res) => { // wild card'*' -> all other than above Route
	res.sendFile(path.join(__dirname, "frontend", "dist", "index.html")); // __dirname/frontend/dist/index.html
});

server.listen(PORT, () => { // Edit: app -> server 
	connectToMongoDB();
	console.log(`Server Running on port ${PORT}`); // "running on 8000"
});

