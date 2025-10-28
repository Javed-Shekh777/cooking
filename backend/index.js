require("dotenv").config();
const app = require("./src/app");
const DB = require("./src/config/db");
const { PORT } = require("./src/constants");

// ----------------- Handle uncaught exceptions -----------------
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

let server; // yaha store karenge

// ----------------- Connect Database & Start Server -----------------
DB()
  .then(() => {
    server = app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1); // DB connect na ho to server band karo
  });

// ----------------- Handle unhandled promise rejections -----------------
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION 💥 Shutting down...");
  console.error(err.name, err.message);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
