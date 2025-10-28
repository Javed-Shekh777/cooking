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

 

// default 
app.use(helmet());
const corsOptions = {
  credentials: true,
  methods: ["POST", "GET", "DELETE", "PUT", "PATCH"],
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



// User Defined Routes
app.use("/api/auth", authRoute);
app.use("/api/recipe", recipeRoute);


app.all("/{*any}", (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
});



// Global error handler 
app.use(errorHandler);

module.exports = app;