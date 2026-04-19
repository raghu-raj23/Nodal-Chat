import type { Request, Response, NextFunction } from "express";

export const errorHandler = (
	error: Error,
	req: Request,
	res: Response,
	_next: NextFunction,
) => {
	console.error("Error:", error);
	const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
	res.status(statusCode).json({
		message: error.message || "Internal server error",
		...(process.env.NODE_ENV === "development" && { stack: error.stack }),
	});
};
