import Redis from "ioredis";
import { UPSTASH_REDIS_URL } from "../config/config.js";

export const redis = new Redis(UPSTASH_REDIS_URL);
// key-value store
await redis.set("foo", "bar");
