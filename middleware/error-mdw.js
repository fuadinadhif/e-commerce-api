const { StatusCodes } = require("http-status-codes");

const errorMDW = (error, req, res, next) => {
  let customError = {
    statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: error.message || `unexpected error. goodluck figure it out.`,
  };

  if (error.name === "CastError") {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.message = `invalid URL parameters. (${error.value}) does not meet the parameters criteria`;
  }

  if (error.code && error.code === 11000) {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.message = `duplicated value entered for ${Object.keys(
      error.keyValue
    )} field, please choose another value`;
  }

  if (error.name === "ValidationError") {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.message = Object.values(error.errors)
      .map((error) => error.message)
      .join(" and ");
  }

  return res
    .status(customError.statusCode)
    .json({ message: customError.message });
};

module.exports = errorMDW;
