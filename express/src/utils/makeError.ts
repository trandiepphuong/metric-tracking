export type ResponseError = {
	status: number;
	name: string;
	message: string;
	details?: unknown;
};

export const makeError = (
	status: number,
	name: string,
	message: string,
	details?: unknown,
): ResponseError => {
	return {
		status,
		name,
		message,
		details,
	};
};
