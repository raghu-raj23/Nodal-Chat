import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";

export async function getMessages(req: AuthRequest, res: Response) {
	try {
		const userId = req.userId;
		const { chatId } = req.params;

		const chat = await Chat.findOne({ _id: chatId, participants: userId });
		if (!chat) {
			return res
				.status(404)
				.json({ message: "Chat not found or access denied" });
		}
		const messages = await Message.find({ chat: chatId })
			.populate("sender", "name email avatar") // populate sender details
			.sort({ createdAt: 1 }); // oldest first
		res.json(messages);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
}
