const { createJWToken, validateJWToken } = require("./jwt-token");
const attachCookiesToResponse = require("./attach-cookies");
const createTokenPayload = require("./create-token-payload");
const checkPermission = require("./check-permission");

module.exports = {
  createJWToken,
  validateJWToken,
  attachCookiesToResponse,
  createTokenPayload,
  checkPermission,
};
