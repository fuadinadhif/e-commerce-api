const { StatusCodes } = require("http-status-codes");
const {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} = require("../errors");
const UserModel = require("../models/user-model");
const {
  attachCookiesToResponse,
  createTokenPayload,
  checkPermission,
} = require("../utils");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find({ role: "user" }).select("-password");

    res.status(StatusCodes.OK).json({ users });
  } catch (error) {
    next(error);
  }
};

const getSingleUser = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ _id: req.params.id }).select(
      "-password"
    );
    if (!user) {
      throw new NotFoundError(`user with ID: ${req.params.id} does not exist`);
    }

    checkPermission(req.user, user._id);

    res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    res.status(StatusCodes.OK).json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      throw new BadRequestError("please provide the new user name and email");
    }

    const user = await UserModel.findOne({ _id: req.user.id });
    user.name = name;
    user.email = email;

    await user.save();

    const tokenPayload = createTokenPayload(user);
    attachCookiesToResponse(res, tokenPayload);

    res
      .status(StatusCodes.OK)
      .json({ message: "user profile has been updated" });
  } catch (error) {
    next(error);
  }
};

const updateUserPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      throw new BadRequestError("please fill in the old and new password");
    }

    const user = await UserModel.findOne({ _id: req.user.id });
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
      throw new UnauthorizedError("incorrect old password");
    }

    user.password = newPassword;

    await user.save();

    res.status(StatusCodes.OK).json({ message: "password has been changed" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getSingleUser,
  getCurrentUser,
  updateUserProfile,
  updateUserPassword,
};
