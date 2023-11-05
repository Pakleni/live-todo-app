import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import todoRouter from "./routers/todo.routes.js";
import socket from "./socket.js";
import redis from "./redis.js";
import { promisify } from "node:util";

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
let isCleaning = false;
const cleanup = async () => {
  if (isCleaning) {
    return;
  }
  isCleaning = true;

  // exit after 5 seconds if cleanup fails
  // or takes too long
  setTimeout(() => {
    process.exit(1);
  }, 5000);

  try {
    console.log("Closing socket.io and server ...");
    await promisify(io.close.bind(io))();
    console.log("Closing redis...");
    await Promise.all([redis.quit(), pubClient.quit(), subClient.quit()]);
  } catch (err) {
    console.error(err);
    return process.exit(1);
  }
  console.log("Bye!");
  process.exit(0);
};

process.on("SIGTERM", cleanup);
process.on("SIGINT", cleanup);
