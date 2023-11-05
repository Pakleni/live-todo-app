import { createAdapter } from "@socket.io/redis-adapter";
import { Server } from "socket.io";
import redis from "./redis.js";
import server from "./server.js";

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

// create redis instances
export const pubClient = redis.duplicate();
export const subClient = redis.duplicate();

// register redis adapter
io.adapter(createAdapter(pubClient, subClient));

// add socket connection listener
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

export default io;
