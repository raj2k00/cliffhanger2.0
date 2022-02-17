const express = require("express");

const router = express.Router();
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteAccount,
  getMe,
  userPhotoUpload,
  resizeUserPhoto,
} = require("../controllers/userController");

const {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
  restrictTo,
  logOut,
} = require("../controllers/authController");

// Get/POST ROUTES
// WORKING:
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logOut);
router.post("/forgotPassword", forgotPassword);

// PATCH ROUTES
// WORKING:
router.patch("/resetPassword/:token", resetPassword);

//below routes are protected so use protect middle ware before calling them
router.use(protect);

// WORKING:
router.patch("/updatePassword", updatePassword);

// WORKING:
// getMe route sets the user_id to next middleware(getUser)as its parameter
router.get("/aboutMe", getMe, getUser);

router.patch(
  "/updateProfile",
  userPhotoUpload,
  resizeUserPhoto,
  updateMe
);

// WORKING:
router.delete("/deleteAccount", deleteAccount);

router.use(restrictTo("admin"));

// WORKING:
// CreateUser route won't work use signup Instead!
// It is created for the sake of complete RESTapi architecture
router.route("/").get(getAllUsers).post(createUser);

// WORKING:
// This router takes the users _id as a parameter to get the information
// about user and perfrom various actions
router
  .route("/:id")
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
