const express = require("express");
const app = express();
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { allowedOrigins } = require("./constants");
const errorHandler = require("./util/errorHandler");
const authRoutes = require("./routes/auth.routes");
const recipeRoutes = require("./routes/recipe.routes");
const adminRoutes = require("./routes/admin.routes");
const chefRoutes = require("./routes/chef.routes");
const userRoutes = require("./routes/user.routes");
const categoryRoutes = require("./routes/category.routes");
const commentRoutes = require("./routes/comment.routes");


const path = require("path");



// default 
app.use(helmet());


if (process.env.NODE_ENV === "development") {
  app.use(cors({
    origin: [/http:\/\/localhost:\d+/, /http:\/\/127\.0\.0\.1:\d+/],
    credentials: true,
  }));
} else {
  app.use(cors({
    origin: allowedOrigins,
    credentials: true,
  }));
}


// ✅ CORS middleware
// app.use(cors(corsOptionsDelegate));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'images')));



app.use(cookieParser());





// User Defined Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chef", chefRoutes);
app.use("/api/user", userRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/comments", commentRoutes);



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



