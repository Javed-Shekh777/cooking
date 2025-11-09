const express = require("express");
const app = express();
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { allowedOrigins } = require("./constants");
const errorHandler = require("./util/errorHandler");
const authRoute = require("./routes/authRoute");
const recipeRoute = require("./routes/recipeRoute");
const Schh = require("./models/recipeCategorySchema");
const path = require("path");



// default 
app.use(helmet());
const corsOptionsDelegate = (req, callback) => {
  const origin = req.header("Origin");
  let corsOptions;

  if (!origin || allowedOrigins.includes(origin)) {
    corsOptions = { origin: true, credentials: true };
  } else {
    corsOptions = { origin: false };
    console.log("❌ CORS blocked:", origin);
  }

  callback(null, corsOptions);
};

// ✅ CORS middleware
app.use(cors(corsOptionsDelegate));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'images')));



app.use(cookieParser());





// User Defined Routes
app.use("/api/auth", authRoute);
app.use("/api/recipe", recipeRoute);

app.get("/", (req, res) => {
  res.json({ message: "Server working fine ✅" });
});

app.all("/{*any}", (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
});



// Global error handler 
app.use(errorHandler);

module.exports = app;



