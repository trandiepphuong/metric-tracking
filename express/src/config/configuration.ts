import dotenv from "dotenv";

dotenv.config();

export const App = {
	Port: process.env.PORT,
	NodeEnv: process.env.NODE_ENV,
};

export const Database = {
	MONGO_URI: process.env.MONGO_URI
};
