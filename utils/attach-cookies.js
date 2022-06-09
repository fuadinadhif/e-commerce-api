const { createToken } = require("./create-validate-token");

const attachCookiesToResponse = (res, tokenPayload) => {
  const token = createToken(tokenPayload);

  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("accessToken", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

module.exports = attachCookiesToResponse;
