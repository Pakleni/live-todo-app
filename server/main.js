require("dotenv").config();

const express = require("express");
const Redis = require("ioredis");

const app = express();
const port = 3000;

const redis = new Redis(process.env.REDIS_URL);

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
