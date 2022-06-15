const { UnauthorizedError, ForbiddenError } = require("../errors");
const { validateJWToken } = require("../utils");

const authenticateUser = (req, res, next) => {
  try {
    const token = req.signedCookies.accessToken;
    if (!token) {
      throw new UnauthorizedError("no token provided. please log in first");
    }

    const validTokenPayload = validateJWToken(token);
    req.user = {
      id: validTokenPayload.id,
      name: validTokenPayload.name,
      email: validTokenPayload.email,
      role: validTokenPayload.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        throw new ForbiddenError(
          "restricted access. please log in as an admin to access this page"
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { authenticateUser, authorizePermissions };
