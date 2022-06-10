const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const path = require("path");
const ProductModel = require("../models/product-model");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const getAllProducts = async (req, res, next) => {
  try {
    const products = await ProductModel.find({});
    res.status(StatusCodes.OK).json({ count: products.length, products });
  } catch (error) {
    next(error);
  }
};

const getSingleProduct = async (req, res, next) => {
  try {
    const product = await ProductModel.findOne({ _id: req.params.id }).populate(
      "reviews"
    );
    if (!product) {
      throw new NotFoundError("Product does not exist");
    }
    res.status(StatusCodes.OK).json({ product });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const product = await ProductModel.create(req.body);
    res.status(StatusCodes.CREATED).json({ product });
  } catch (error) {
    next(error);
  }
};

const uploadImage = async (req, res, next) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      use_filename: true,
      folder: "e-commerce-api",
    });
    fs.unlinkSync(req.file.path);
    return res.status(200).json({ image: { src: result.secure_url } });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await ProductModel.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!product) {
      throw new NotFoundError("The product you want to update does not exist");
    }
    res.status(StatusCodes.OK).json({ message: "Product has been updated" });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await ProductModel.findOne({ _id: req.params.id });
    await product.remove();
    res.status(StatusCodes.OK).json({ message: "Product has been deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  uploadImage,
  updateProduct,
  deleteProduct,
};
