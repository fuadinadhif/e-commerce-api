const UserModel = require("../models/user-model");
const ProductModel = require("../models/product-model");
const ReviewModel = require("../models/review-model");
const OrderModel = require("../models/order-model");
const userData = require("../mock-data/users.json");
const productData = require("../mock-data/products.json");
const reviewData = require("../mock-data/reviews.json");
const orderData = require("../mock-data/orders.json");
const { StatusCodes } = require("http-status-codes");

const factoryReset = async (req, res, next) => {
  try {
    await UserModel.deleteMany({});
    await ProductModel.deleteMany({});
    await ReviewModel.deleteMany({});
    await OrderModel.deleteMany({});

    // populate users collection
    for (user of userData) {
      await UserModel.create(user);
    }

    // populate products collection
    const admin = await UserModel.findOne({ role: "admin" });
    for (product of productData) {
      await ProductModel.create({ ...product, user: admin._id });
    }

    // populate reviews collection
    for (review of reviewData) {
      const userName = review.user;
      const productName = review.product;

      const user = await UserModel.findOne({ name: userName });
      const product = await ProductModel.findOne({ name: productName });

      await ReviewModel.create({
        ...review,
        user: user._id,
        product: product._id,
      });
    }

    // populate orders collection
    for (order of orderData) {
      let subTotal = 0;
      for (item of order.cartItems) {
        subTotal += item.price * item.amount;
        const product = await ProductModel.findOne({ name: item.name });
        item.product = product._id;
      }
      const total = order.tax + order.shippingFee + order.subTotal;
      const userName = order.user;
      const user = await UserModel.findOne({ name: userName });

      await OrderModel.create({
        ...order,
        subTotal,
        total,
        user: user._id,
      });
    }

    res.status(StatusCodes.OK).json({
      message: "database has been reset back to the factory setting",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = factoryReset;
