const { StatusCodes } = require("http-status-codes");

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;
