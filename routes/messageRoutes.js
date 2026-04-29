const router = require("express").Router();
const Message = require("../models/Message");

// GET messages with pagination
router.get("/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;
  const page = parseInt(req.query.page) || 0;
  const limit = 20;

  const messages = await Message.find({
    $or: [
      { senderId: user1, receiverId: user2 },
      { senderId: user2, receiverId: user1 }
    ]
  })
    .sort({ timestamp: -1 }) // latest first
    .skip(page * limit)
    .limit(limit);

  res.json(messages.reverse()); // oldest → newest
});

module.exports = router;