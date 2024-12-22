import type { NextFunction, Request, Response } from "express";
import type { ResponseError } from "../utils/makeError";
import { App } from "../config/configuration";

export const errorHandler = (err: ResponseError, _r: Request, res: Response, _n: NextFunction) => {
	const status = err.status || 500;
	const responseData = {
		status,
		error: status === 500 ? "Internal Server Error" : err.name,
		message: err.message,
		...(App.NodeEnv === "development" && { details: err.details }),
	};

	console.error(err.details || err.message);
	res.status(status).json(responseData);
};
