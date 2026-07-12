// this file is for running the node js application

const dotenv = require("dotenv").config();

const app = require("./app");
const { connectToMongoDB } = require("./config/Database");

const PORT = process.env.PORT;

async function startServer() {
  await connectToMongoDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
