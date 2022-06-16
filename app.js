require("dotenv").config();
// npm packages
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
// npm security packages
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
// database
const connectDB = require("./db/connectDB");
// middlewares
const notFoundMDW = require("./middleware/not-found-mdw");
const errorMWD = require("./middleware/error-mdw");
// routers
const authRouter = require("./routes/auth-route");
const userRouter = require("./routes/user-route");
const productRouter = require("./routes/product-route");
const reviewRouter = require("./routes/review-route");
const orderRouter = require("./routes/order-route");
// mock data
const userData = require("./mock-data/users.json");
const productData = require("./mock-data/products.json");
const reviewData = require("./mock-data/reviews.json");
const orderData = require("./mock-data/orders.json");

// express package routes and fuctions
app.use(xss());
app.set("trust proxy", 1);
app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 60 }));
app.use(helmet());
app.use(cors());
app.use(mongoSanitize());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json());
app.use(express.static("./public"));

// documentation routes and functions
const swaggerDocument = YAML.load("./e-commerce-api-docs.yaml");
const options = {
  customSiteTitle: "e-Commerce API Docs",
};
app.use("/", swaggerUI.serve);
app.get("/", swaggerUI.setup(swaggerDocument, options));

// reset and mock data routes and functions
const mockData = [
  { users: [...userData] },
  { products: [...productData] },
  { reviews: [...reviewData] },
  { orders: [...orderData] },
];
const factoryReset = require("./controllers/factory-reset-controller");
app.post("/api/v1/factory-reset", factoryReset);
app.get("/api/v1/mock-data", (req, res) => {
  res.status(200).send(mockData);
});

// main routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

// fallback routes
app.use(notFoundMDW);
app.use(errorMWD);

// connect server
const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server listening to port: ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
