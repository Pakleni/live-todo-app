import "dotenv/config";
import { promisify } from "node:util";

import server from "./server.js";
import redis from "./redis.js";
import io, { pubClient, subClient } from "./socket.js";

const PORT = process.env.PORT || 3000;

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
