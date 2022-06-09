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
      throw new NotFoundError(`User with ID: ${req.params.id} does not exist`);
    }
    checkPermission(req.user, user._id);
    res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    next(error);
  }
};

const showCurrentUser = async (req, res, next) => {
  try {
    res.status(StatusCodes.OK).json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

// * Update Password Using findOneAndUpdate
// const updateUser = async (req, res, next) => {
//   try {
//     const { name, email } = req.body;
//     if (!name || !email) {
//       throw new BadRequestError("Please fill in the new user name and email");
//     }

//     const user = await UserModel.findOneAndUpdate(
//       { _id: req.user.id },
//       { name, email },
//       { new: true, runValidators: true }
//     );
//     const tokenPayload = createTokenPayload(user);
//     attachCookiesToResponse(res, tokenPayload);
//     res
//       .status(StatusCodes.OK)
//       .json({ message: "User profile has been updated" });
//   } catch (error) {
//     next(error);
//   }
// };
// * Update User Using documents.prototype.save()
const updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      throw new BadRequestError("Please provide both new user name and email");
    }

    const user = await UserModel.findOne({ _id: req.user.id });
    user.name = name;
    user.email = email;
    await user.save();

    const tokenPayload = createTokenPayload(user);
    attachCookiesToResponse(res, tokenPayload);
    res
      .status(StatusCodes.OK)
      .json({ message: "User profile has been updated" });
  } catch (error) {
    next(error);
  }
};

const updateUserPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      throw new BadRequestError("Please fill in the old and new password");
    }

    const user = await UserModel.findOne({ _id: req.user.id });
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
      throw new UnauthorizedError("Wrong old password");
    }

    user.password = newPassword;
    await user.save();
    res.status(StatusCodes.OK).json({ message: "Password has been changed" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
