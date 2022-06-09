const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/auth-mdw");
const {
  getAllReviews,
  getSingleReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/review-controller");

router.route("/").get(getAllReviews).post(authenticateUser, createReview);
router
  .route("/:id")
  .get(getSingleReview)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview);

module.exports = router;
