const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getSingleProduct,
  createProduct,
  uploadImage,
  updateProduct,
  deleteProduct,
} = require("../controllers/product-controller");
const { getSingleProductReviews } = require("../controllers/review-controller");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/auth-mdw");

router
  .route("/")
  .get(getAllProducts)
  .post(authenticateUser, authorizePermissions("admin"), createProduct);
router
  .route("/uploadImage")
  .post(authenticateUser, authorizePermissions("admin"), uploadImage);
router
  .route("/:id")
  .get(getSingleProduct)
  .patch(authenticateUser, authorizePermissions("admin"), updateProduct)
  .delete(authenticateUser, authorizePermissions("admin"), deleteProduct);
router.route("/:id/reviews").get(getSingleProductReviews);

module.exports = router;
