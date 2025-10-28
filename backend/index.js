require("dotenv").config();
const app = require("./src/app");
const DB = require("./src/config/db");
const { PORT, NODE_ENV } = require("./src/constants");

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("💥 UNCAUGHT EXCEPTION — Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

let server;

// Connect Database
DB()
  .then(() => {
    console.log("✅ Database connected successfully");
    if (NODE_ENV !== "production") {
      // local dev ke liye
      server = app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  });

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
  console.error("💥 UNHANDLED REJECTION — Shutting down...");
  console.error(err.name, err.message);

  if (server) server.close(() => process.exit(1));
  else process.exit(1);
});

// ✅ Vercel ke liye export kar do (serverless handler)
module.exports = app;
