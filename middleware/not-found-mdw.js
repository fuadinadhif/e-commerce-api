const { StatusCodes } = require("http-status-codes");

const notFoundMDW = (req, res) => {
  return res
    .status(StatusCodes.NOT_FOUND)
    .send("The page you searching for does not exist");
};

module.exports = notFoundMDW;
