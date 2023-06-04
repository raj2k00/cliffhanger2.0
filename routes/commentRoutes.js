const express = require("express");

const router = express.Router({ mergeParams: true });

const {
  protect,
  restrictTo,
} = require("../controllers/authController");

const {
  getAllComments,
  createComment,
  deleteComment,
  updateComment,
  setArticleUserIds,
  getOneComment,
} = require("../controllers/commentController");

router.use(protect);

router
  .route("/")
  .get(getAllComments)
  .post(
    restrictTo("user", "admin"),
    setArticleUserIds,
    createComment
  );

router
  .route("/:id")
  .get(getOneComment)
  .patch(restrictTo("user", "admin"), updateComment)
  .delete(restrictTo("user", "admin"), deleteComment);

module.exports = router;
