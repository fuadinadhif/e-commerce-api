const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getSingleUser,
  getCurrentUser,
  updateUserProfile,
  updateUserPassword,
} = require("../controllers/user-controller");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/auth-mdw");

router
  .route("/")
  .get(authenticateUser, authorizePermissions("admin", "owner"), getAllUsers);
router.route("/getCurrentUser").get(authenticateUser, getCurrentUser);
router.route("/updateUserProfile").patch(authenticateUser, updateUserProfile);
router.route("/updateUserPassword").patch(authenticateUser, updateUserPassword);
router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = router;
