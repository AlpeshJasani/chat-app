import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);  // call 'signup' function.. when user visit /api/auth/signup
// router.get("/signup",(req,res) => {
//     res.send("Login Route");
// });
// (req, res) => { ... }: This is the callback function that will be executed when the route is hit. It has two parameters:
// req: The request object, containing information about the HTTP request (e.g., query parameters, body, headers).
// res: The response object, which is used to send a response back to the client.

router.post("/login", login);

router.post("/logout", logout);

export default router;
