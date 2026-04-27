import app from "./src/app";
import { connectDB } from "./src/config/database";
import { createServer } from "http";
import { initializeSocketServer } from "./src/utils/socket";

const PORT = process.env.PORT || 3000;
const httpServer = createServer(app);

initializeSocketServer(httpServer);

connectDB()
	.then(() => {
		httpServer.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	})
	.catch((error) => {
		console.error("Failed to connect to the database:", error);
		process.exit(1);
	});
