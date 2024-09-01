import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages); // /api/messages/:id // protectRoute middleware is for authentication
router.post("/send/:id", protectRoute, sendMessage); // meassge _id

export default router;
