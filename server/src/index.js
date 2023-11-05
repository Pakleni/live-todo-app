import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import todoRouter from "./routers/todo.routes.js";
import socket from "./socket.js";

const PORT = process.env.PORT || 3000;
const CORS_OPTIONS = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

// create express app
const app = express();
app.use(cors(CORS_OPTIONS));
app.use(express.json());

// register express app as http handler
const server = createServer(app);

// create socket.io instance
const io = socket.setup(server, {
  cors: CORS_OPTIONS,
});

// register routers
const router = express.Router();
router.use("/todo", todoRouter);
app.use("/", router);

// start server
server.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
