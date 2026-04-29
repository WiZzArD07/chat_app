require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// socket setup
require("./socket/socket")(io);

const PORT = process.env.PORT || 3000;

//  Start server only after connections
async function startServer() {
  try {
    await connectDB();
    // console.log("MongoDB Connected");

    //  OPTIONAL (since Redis giving issue)
    try {
      await connectRedis();
    } catch (err) {
      console.log("Redis failed, continuing without cache...");
    }

    server.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });

  } catch (err) {
    console.error("Startup error:", err);
  }
}

startServer();