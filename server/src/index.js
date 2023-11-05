import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import todoRouter from "./routers/todo.routes.js";
import socket from "./socket.js";
import redis from "./redis.js";

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
const [io, pubClient, subClient] = socket.setup(server, {
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

// cleanup code
let isExiting = false;
const cleanup = () => {
  if (isExiting) {
    return;
  }
  isExiting = true;
  console.log("Closing socket.io and server...");
  io.close(() => {
    console.log("Closing redis...");
    redis.quit(() => {
      pubClient.quit(() => {
        subClient.quit(() => {
          console.log("Bye!");
          process.exit(0);
        });
      });
    });
  });
};

process.on("SIGTERM", cleanup);
process.on("SIGINT", cleanup);
