// uses your existing Redis client
const { pub } = require("./redis");

const WINDOW = 10; // seconds
const LIMIT = 5;   // max messages per window

async function canSend(userId) {
  const key = `rate:${userId}`;

  // INCR + set expiry (only when key is new)
  const count = await pub.incr(key);
  if (count === 1) {
    await pub.expire(key, WINDOW);
  }

  return count <= LIMIT;
}

module.exports = { canSend };