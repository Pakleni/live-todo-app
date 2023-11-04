require("dotenv").config();

const express = require("express");
const Redis = require("ioredis");
const cors = require("cors");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3000;
const CORS_OPTIONS = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST"],
};

// create express app
const app = express();
// register express app as http handler
const server = createServer(app);
// create socket.io instance
const io = new Server(server, {
  cors: CORS_OPTIONS,
});
// create redis instance
const redis = new Redis(process.env.REDIS_URL);
// register cors
app.use(cors(CORS_OPTIONS));
// add socket connection listener
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
// start server
server.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});

// Test redis
redis.set("test", "1234");

app.get("/", async (req, res) => {
  try {
    const response = await redis.get("test");
    res.send(response);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});
// End Test redis
