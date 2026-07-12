const dns = require("dns");
const mongoose = require("mongoose");

// Set DNS servers to Google's public DNS to resolve mongodb+srv records correctly.
dns.setServers(["8.8.8.8", "8.8.4.4"]);


async function connectToMongoDB() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set in the environment");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("You successfully connected to MongoDB!");
  console.log("database name:", mongoose.connection.name);
  return mongoose;
}

async function disconnectFromMongoDB() {
  await mongoose.disconnect();
}

module.exports = {
  connectToMongoDB,
  disconnectFromMongoDB,
};
