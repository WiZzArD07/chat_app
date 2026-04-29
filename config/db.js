const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.log("DB error, retrying...");
    setTimeout(connectDB, 3000);
  }
}

module.exports = connectDB;