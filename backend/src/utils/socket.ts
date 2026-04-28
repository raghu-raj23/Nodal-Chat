import { Socket, Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyToken } from "@clerk/express";
import { User } from "../models/User";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";

interface AuthenticatedSocket extends Socket {
	userId: string; // This will hold the authenticated user's ID
}

// store online users in memory, the key is the user ID and the value is the socket ID
export const onlineUsers = new Map<string, string>();

export const initializeSocketServer = (httpServer: HttpServer) => {
	const allowedOrigins = [
		"http://localhost:5173",
		"https://localhost:8081",
		process.env.FRONTEND_URL as string,
	];

	const io = new SocketServer(httpServer, {
		cors: { origin: allowedOrigins },
	});

	// Verify the socket connection
	io.use(async (socket, next) => {
		const token = socket.handshake.auth.token; //This is the token sent from the client during the connection handshake
		if (!token) {
			return next(new Error("Authentication error: No token provided"));
		}
		try {
			const session = await verifyToken(token, {
				secretKey: process.env.CLERK_SECRET_KEY as string,
			});

			const clerkId = session.sub;
			const user = await User.findOne({ clerkId });
			if (!user) {
				return next(new Error("Authentication error: User not found"));
			}
			(socket as AuthenticatedSocket).userId = user._id.toString(); // Attach the user ID to the socket for later use
			next();
		} catch (error) {
			return next(new Error("Authentication error: Invalid token"));
		}
	});

	// connection is the event name and socket is the user that is connecting to the server
	io.on("connection", (socket) => {
		const userId = (socket as AuthenticatedSocket).userId;

		// send list of connected users to the client
		socket.emit("online-users", { userIds: Array.from(onlineUsers.keys()) });

		// add the user to the online users map
		onlineUsers.set(userId, socket.id);

		// broadcast to all other clients that a new user has connected
		socket.broadcast.emit("user-online", { userId });

		socket.join(`user:${userId}`);

		socket.on("leave-chat", (chatId: string) => {
			socket.leave(`chat:${chatId}`);
		});
		socket.on("join-chat", (chatId: string) => {
			socket.join(`chat:${chatId}`);
		});

		socket.on(
			"send-message",
			async (data: { chatId: string; text: string }) => {
				try {
					const { chatId, text } = data;
					const chat = await Chat.findOne({
						_id: chatId,
						participants: userId,
					});

					if (!chat) {
						socket.emit("socket-error", {
							message: "Chat not found or user not a participant",
						});
						return;
					}
					const message = await Message.create({
						chat: chatId,
						sender: userId,
						text,
					});

					chat.lastMessage = message._id;
					chat.lastMessageAt = new Date();
					await chat.save();

					await message.populate("sender", "name email");

					// emit to the participants in the chat
					io.to(`chat:${chatId}`).emit("new-message", message);

					// also emit to participants persnonal room
					for (const participantId of chat.participants) {
						io.to(`user:${participantId}`).emit("new-message", message);
					}
				} catch (error) {
					socket.emit("socket-error", { message: "Failed to send message" });
				}
			},
		);

		// TODO: implement typing indicator
		socket.on("typing", async (data) => {});

		socket.on("disconnect", () => {
			onlineUsers.delete(userId);
			socket.broadcast.emit("user-offline", { userId });
		});
	});
	return io;
};
