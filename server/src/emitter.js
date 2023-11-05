import { Emitter } from "@socket.io/redis-emitter";
import redis from "./redis.js";

export default new Emitter(redis);
