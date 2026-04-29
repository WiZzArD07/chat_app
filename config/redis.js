const { createClient } = require("redis");

const pub = createClient();
const sub = createClient();

async function connectRedis() {
  await pub.connect();
  await sub.connect();

  console.log("Redis Connected");
}

module.exports = { pub, sub, connectRedis };