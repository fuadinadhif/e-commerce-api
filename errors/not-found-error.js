const { StatusCodes } = require("http-status-codes");

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.StatusCodes = StatusCodes.NOT_FOUND;
  }
}

module.exports = NotFoundError;
