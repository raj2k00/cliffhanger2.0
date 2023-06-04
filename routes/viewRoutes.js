const express = require("express");
const Article = require("../models/articleModel");
const { paginatedResults } = require("../utils/appFeatures");
const {
  protect,
  restrictTo,
  isLoggedIn,
} = require("../controllers/authController");

const {
  homePage,
  specificPosts,
  getArticle,
  writeArticle,
  getLoginForm,
  getSignUpForm,
  getForgetPassword,
  getResetPassword,
  uploadArticleImages,
  resizeArticleImages,
  composeArticle,
  editArticle,
  sendArticle,
  aboutMe,
} = require("../controllers/viewController");

const router = express.Router();

router.get("/write", protect, writeArticle);
router.get("/profile", protect, aboutMe);
router.get("/compose", protect, restrictTo("admin"), composeArticle);
router.get("/edit/:id", protect, restrictTo("admin"), editArticle);
router.post(
  "/userArticle",
  protect,
  uploadArticleImages,
  resizeArticleImages,
  sendArticle
);
router.use(isLoggedIn);

router.get("/login", getLoginForm);
router.get("/signup", getSignUpForm);
router.get("/forgetPassword", getForgetPassword);
router.get("/users/resetPassword/:id", getResetPassword);

router.get("/", paginatedResults(Article), homePage);
router.get("/search/", paginatedResults(Article), specificPosts);
router.get("/posts/:slug", getArticle);

module.exports = router;
