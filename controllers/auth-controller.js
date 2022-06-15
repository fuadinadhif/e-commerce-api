const UserModel = require("../models/user-model");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../errors");
const { StatusCodes } = require("http-status-codes");
const validator = require("email-validator");
const { attachCookiesToResponse, createTokenPayload } = require("../utils");

const register = async (req, res, next) => {
  try {
    const { email } = req.body;
    const emailAlreadyExist = await UserModel.findOne({ email });
    if (emailAlreadyExist) {
      throw new BadRequestError(
        "email has been used. Please use another address"
      );
    }

    const isFirstAccount = (await UserModel.countDocuments({})) === 0;
    const role = isFirstAccount ? "admin" : "user";
    const user = await UserModel.create({ ...req.body, role });

    const tokenPayload = createTokenPayload(user);
    attachCookiesToResponse(res, tokenPayload);

    res.status(StatusCodes.CREATED).json({ user: tokenPayload });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError("please provide a valid email and password");
    }

    const isEmail = validator.validate(email);
    if (!isEmail) {
      throw new BadRequestError("Please provide a valid email");
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new NotFoundError(`${email} has not been registered yet`);
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedError("wrong password. try Again");
    }

    const tokenPayload = createTokenPayload(user);
    attachCookiesToResponse(res, tokenPayload);

    res.status(StatusCodes.OK).json({ user: tokenPayload });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.cookie("accessToken", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });

    res.status(StatusCodes.OK).json({ message: "user has been logged out" });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout };
