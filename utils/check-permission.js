const { ForbiddenError } = require("../errors");

const checkPermission = (userRequester, userTarget) => {
  if (userRequester.role === "admin") return;
  if (userRequester.id === userTarget.toString()) return;

  throw new ForbiddenError(
    "restricted access. you do not have enough permission to access this page"
  );
};

module.exports = checkPermission;
