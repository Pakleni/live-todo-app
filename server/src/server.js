import app from "./app.js";
import { createServer } from "node:http";

// register express app as http handler
const server = createServer(app);

export default server;
