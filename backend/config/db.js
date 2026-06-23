const mongoose = require("mongoose");

// This function connects our backend to MongoDB Atlas
// We call it once when the server starts (see server.js)
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Exit the process if we can't connect to the database
    // There's no point running a server that can't reach its DB
    process.exit(1);
  }
};

module.exports = connectDB;
