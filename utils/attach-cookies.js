const { createJWToken } = require("./jw-token");

const attachCookiesToResponse = (res, tokenPayload) => {
  const token = createJWToken(tokenPayload);
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("accessToken", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

module.exports = attachCookiesToResponse;
