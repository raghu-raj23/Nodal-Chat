import { Socket, Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyToken } from "@clerk/express";
import { User } from "../models/User";

interface AuthenticatedSocket extends Socket {
	userId: string; // This will hold the authenticated user's ID
}

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


	


};
