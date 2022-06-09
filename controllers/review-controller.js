const ReviewModel = require("../models/review-model");
const ProductModel = require("../models/product-model");
const { NotFoundError, BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { checkPermission } = require("../utils");

const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await ReviewModel.find({}).populate({
      path: "product",
      select: "name price category",
    });
    res.status(StatusCodes.OK).json({ count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};

const getSingleReview = async (req, res, next) => {
  try {
    const review = await ReviewModel.findOne({ _id: req.params.id });
    if (!review) {
      throw new NotFoundError("Review does not exist");
    }

    res.status(StatusCodes.OK).json({ review });
  } catch (error) {
    next(error);
  }
};

const getSingleProductReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findOne({ _id: id });
    if (!product) {
      throw new NotFoundError(`Product with ID: ${id} does not exist`);
    }

    const reviews = await ReviewModel.find({ product: id });
    res.status(StatusCodes.OK).json({ count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};

const createReview = async (req, res, next) => {
  try {
    const { product: productID } = req.body; // product required by ReviewSchema
    const isValidProduct = await ProductModel.findOne({ _id: productID });
    if (!isValidProduct) {
      throw new NotFoundError("Product you wanna review does not exist");
    }

    const alreadySubmitted = await ReviewModel.findOne({
      product: productID,
      user: req.user.id,
    });

    if (alreadySubmitted) {
      throw new BadRequestError("User already gave review for this product");
    }

    req.body.user = req.user.id;
    const review = await ReviewModel.create(req.body);
    res.status(StatusCodes.CREATED).json({ review });
  } catch (error) {
    next(error);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const { title, rating, comment } = req.body;

    const review = await ReviewModel.findOne({ _id: req.params.id });
    if (!review) {
      throw new NotFoundError("Cannot update a review that does not exist");
    }

    checkPermission(req.user, review.user);

    review.title = title;
    review.rating = rating;
    review.comment = comment;

    await review.save();
    res
      .status(StatusCodes.OK)
      .json({ message: "Review has been updated bommbayah" });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await ReviewModel.findOne({ _id: req.params.id });
    if (!review) {
      throw new NotFoundError("Review you wanna delete does not exist");
    }

    checkPermission(req.user, review.user);
    await review.remove();
    res.status(StatusCodes.OK).json({ message: "Review has been deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllReviews,
  getSingleReview,
  getSingleProductReviews,
  createReview,
  updateReview,
  deleteReview,
};
