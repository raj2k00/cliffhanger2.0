const express = require("express");

const router = express.Router({ mergeParams: true });

const {
  protect,
  restrictTo,
} = require("../controllers/authController");

const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  setTourUserIds,
  getOneReview,
} = require("../controllers/commentController");

router.use(protect);

router
  .route("/")
  .get(getAllReviews)
  .post(restrictTo("user", "admin"), setTourUserIds, createReview);

router
  .route("/:id")
  .get(getOneReview)
  .patch(restrictTo("user", "admin"), updateReview)
  .delete(restrictTo("user", "admin"), deleteReview);

module.exports = router;
