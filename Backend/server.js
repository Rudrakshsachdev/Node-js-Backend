const express = require("express");

const dotenv = require("dotenv");

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

const { connectToMongoDB } = require("./config/db");

const contactRoute = require("./routes/contactRoute");

app.use(express.json());

app.use("/api/contact", contactRoute);

app.use("/api/users", require("./routes/userRoute"));

const errorHandler = require("./middleware/errorHandler");

app.use(errorHandler);

async function startServer() {
  await connectToMongoDB();

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
