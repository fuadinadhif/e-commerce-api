const { ForbiddenError } = require("../errors");

const checkPermission = (userRequester, userTarget) => {
  console.log(userRequester, userTarget);
  if (userRequester.role === "admin") return;
  if (userRequester.id === userTarget.toString()) return;
  throw new ForbiddenError("Restricted access. You can do NOTHING");
};

module.exports = checkPermission;
