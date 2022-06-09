const { createToken, validateToken } = require("./create-validate-token");
const attachCookiesToResponse = require("./attach-cookies");
const createTokenPayload = require("./create-token-payload");
const checkPermission = require("./check-permission");

module.exports = {
  createToken,
  validateToken,
  attachCookiesToResponse,
  createTokenPayload,
  checkPermission,
};
