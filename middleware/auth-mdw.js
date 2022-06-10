const { UnauthorizedError, ForbiddenError } = require("../errors");
const { validateToken } = require("../utils");

const authenticateUser = (req, res, next) => {
  try {
    const token = req.signedCookies.accessToken;
    if (!token) {
      throw new UnauthorizedError("No token provided. Please log in first");
    }

    const validTokenPayload = validateToken(token);

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
          "Restricted access. Please log in as Admin to access this page"
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { authenticateUser, authorizePermissions };
