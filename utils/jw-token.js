const jwt = require("jsonwebtoken");

const createJWToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

const validateJWToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { createJWToken, validateJWToken };
