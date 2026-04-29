const Message = require("../models/Message");
const { pub, sub } = require("../config/redis");
const jwt = require("jsonwebtoken");
const { canSend } = require("../config/rateLimiter");

const onlineUsers = new Map();

// helper
function broadcastOnlineUsers(io) {
  io.emit("onlineUsers", Array.from(onlineUsers.keys()));
}

module.exports = (io) => {

  //  JWT AUTH MIDDLEWARE
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) return next(new Error("No token"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // { id, username }
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  //  REDIS SUBSCRIBER
  sub.subscribe("chat", async (message) => {
    const data = JSON.parse(message);

    const receiverSocket = onlineUsers.get(data.receiverId);

    if (receiverSocket) {
      io.to(receiverSocket).emit("receiveMessage", data);

      // mark delivered
      await Message.updateMany(
        {
          receiverId: data.receiverId,
          $or: [
            { delivered: false },
            { delivered: { $exists: false } }
          ]
        },
        { $set: { delivered: true } }
      );
    }
  });

  io.on("connection", async (socket) => {
    console.log("User connected:", socket.id);

    const userId = socket.user.username;

    //  user online
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} is online`);

    broadcastOnlineUsers(io);

    //  OFFLINE MESSAGES
    const offlineMessages = await Message.find({
      receiverId: userId,
      $or: [
        { delivered: false },
        { delivered: { $exists: false } }
      ]
    });

    console.log("Offline messages:", offlineMessages);

    offlineMessages.forEach((msg) => {
      socket.emit("receiveMessage", {
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        message: msg.message,
        status: "delivered"
      });
    });

    // mark delivered
    await Message.updateMany(
      {
        receiverId: userId,
        $or: [
          { delivered: false },
          { delivered: { $exists: false } }
        ]
      },
      { $set: { delivered: true } }
    );

    //  SEND MESSAGE
    socket.on("sendMessage", async ({ receiverId, message }) => {
      const senderId = userId;

      // 🚦 RATE LIMIT
      const allowed = await canSend(senderId);
      if (!allowed) {
        return socket.emit("rateLimit", {
          message: "Too many messages. Slow down 🚦"
        });
      }

      const receiverSocket = onlineUsers.get(receiverId);

      // store message
      const newMessage = await Message.create({
        senderId,
        receiverId,
        message,
        delivered: !!receiverSocket
      });

      //  receiver offline
      if (!receiverSocket) {
        console.log("User offline → message stored");

        return socket.emit("messageStatus", {
          messageId: newMessage._id,
          status: "sent"
        });
      }

      //  publish via Redis
      await pub.publish("chat", JSON.stringify({
        senderId,
        receiverId,
        message,
        status: "delivered"
      }));

      // notify sender
      socket.emit("messageStatus", {
        messageId: newMessage._id,
        status: "delivered"
      });
    });

    //  TYPING
    socket.on("typing", ({ receiverId }) => {
      const receiverSocket = onlineUsers.get(receiverId);

      if (receiverSocket) {
        io.to(receiverSocket).emit("typing", { senderId: userId });
      }
    });

    //  DISCONNECT
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      for (let [id, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(id);
          break;
        }
      }

      broadcastOnlineUsers(io);
    });
  });
};