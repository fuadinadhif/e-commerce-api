const { StatusCodes } = require("http-status-codes");

const notFoundMDW = (req, res) => {
  return res
    .status(StatusCodes.NOT_FOUND)
    .send("The route you searching for does not exist");
};

module.exports = notFoundMDW;
