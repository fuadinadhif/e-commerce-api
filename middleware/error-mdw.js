const { StatusCodes } = require("http-status-codes");

const errorMDW = (error, req, res, next) => {
  console.log(error);

  let customError = {
    statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: error.message || `Unexpected Error. Goodluck figure it out.`,
  };

  return res
    .status(customError.statusCode)
    .json({ message: customError.message });
};

module.exports = errorMDW;
