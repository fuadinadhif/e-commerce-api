const { StatusCodes } = require("http-status-codes");

const errorMDW = (error, req, res, next) => {
  let customError = {
    statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: error.message || `Unexpected Error. Goodluck figure it out.`,
  };

  if (error.name === "CastError") {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.message = `Invalid URL parameters. (${error.value}) does not meet the parameters criteria`;
  }

  return res
    .status(customError.statusCode)
    .json({ message: customError.message });
};

module.exports = errorMDW;
