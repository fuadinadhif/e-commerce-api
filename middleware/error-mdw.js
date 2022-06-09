const { StatusCodes } = require("http-status-codes");

const errorMDW = (error, req, res, next) => {
  let customError = {
    statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: error.message || `Hehehe found unexpected error ye? Goodluck`,
  };

  return res
    .status(customError.statusCode)
    .json({ message: customError.message });
};

module.exports = errorMDW;
