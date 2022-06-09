const OrderModel = require("../models/order-model");
const ProductModel = require("../models/product-model");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { checkPermission } = require("../utils");

// *NOT A CONTROLLER/Fake Stripe API - Try to change it.
const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = "someRandomValue";
  return { client_secret, amount };
};

const createOrder = async (req, res, next) => {
  try {
    const { items: cartItems, tax, shippingFee } = req.body;
    if (!cartItems || cartItems.length < 1) {
      throw new BadRequestError("No items in cart");
    }

    if (!tax || !shippingFee) {
      throw new BadRequestError("Please provide tax and shipping fee");
    }

    let orderItems = [];
    let subTotal = 0;

    for (const item of cartItems) {
      const dbProduct = await ProductModel.findOne({ _id: item.product });
      if (!dbProduct) {
        throw new NotFoundError(
          `Product with ID: ${item.product} does not exist`
        );
      }

      const { name, price, image, _id } = dbProduct;
      const singleOrderItem = {
        name,
        price,
        image,
        amount: item.amount,
        product: _id,
      };

      orderItems = [...orderItems, singleOrderItem];
      subTotal += item.amount * price;
    }

    const total = tax + shippingFee + subTotal;
    const paymentIntent = await fakeStripeAPI({
      amount: total,
      currency: "usd",
    });

    const order = await OrderModel.create({
      tax,
      shippingFee,
      subTotal,
      total,
      orderItems,
      user: req.user.id,
      clientSecret: paymentIntent.client_secret,
    });

    res
      .status(StatusCodes.CREATED)
      .json({ order, clientSecret: order.clientSecret });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await OrderModel.find({});
    res.status(StatusCodes.OK).json({ count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

const getSingleOrder = async (req, res, next) => {
  try {
    const order = await OrderModel.findOne({ _id: req.params.id });
    if (!order) {
      throw new NotFoundError("Product you search for does not exist");
    }
    checkPermission(req.user, order.user);
    res.status(StatusCodes.OK).json({ order });
  } catch (error) {
    next(error);
  }
};

const getCurrentUserOrders = async (req, res, next) => {
  try {
    const order = await OrderModel.find({ user: req.user.id });
    if (!order || order.length < 1) {
      throw new NotFoundError("User didn't order anything yet");
    }
    res.status(StatusCodes.OK).json({ order });
  } catch (error) {
    next(error);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const { paymentIntentID } = req.body;

    const order = await OrderModel.findOne({ _id: req.params.id });
    if (!order) {
      throw new NotFoundError(`No order with this ID: ${req.params.id}`);
    }

    checkPermission(req.user, order.user);

    order.paymentIntentID = paymentIntentID;
    order.status = "paid";
    await order.save();

    res.status(StatusCodes.OK).json({ order });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  updateOrder,
};
