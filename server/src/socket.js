import { createAdapter } from "@socket.io/redis-adapter";
import { Server } from "socket.io";
import redis from "./redis.js";

const setup = (server, config) => {
  const io = new Server(server, config);

  // create redis instances
  const pubClient = redis.duplicate();
  const subClient = redis.duplicate();

  // register redis adapter
  io.adapter(createAdapter(pubClient, subClient));

  // add socket connection listener
  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  return [io, pubClient, subClient];
};

export default {
  setup,
};
