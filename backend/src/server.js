require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/database");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 BuildTwin AI server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server failed to start");
  }
};

startServer();