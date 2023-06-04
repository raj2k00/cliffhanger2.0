const multer = require("multer");
const sharp = require("sharp");

const Article = require("../models/articleModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Email = require("../utils/email");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Please upload images", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadArticleImages = upload.fields([
  { name: "images", maxCount: 20 },
]);

exports.resizeArticleImages = catchAsync(async (req, res, next) => {
  if (!req.files.images) return next();
  console.log("it goes into sharp");

  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `upload-${file.originalname}-${Date.now()}-${
        i + 1
      }.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 100 })
        .toFile(`public/img/uploads/${filename}`);

      const path = `public/img/uploads/${filename}`;
      req.body.images.push({ filename, path });
    })
  );
  // console.log(req.body.images);
  next();
});

exports.homePage = catchAsync(async (req, res, next) => {
  const features = await Article.find({ typeFace: "feature" });
  const posts = res.paginatedResults;
  const trends = await Article.find({ typeFace: "main" })
    .sort({ views: -1 })
    .limit(3);
  // res.status(200).json(posts);
  res.status(200).render("homePage", {
    title: "Home",
    features,
    posts,
    trends,
  });
});

exports.writeArticle = (req, res) => {
  res.status(200).render("userArticle", {
    title: "Let's Write",
  });
};
exports.composeArticle = (req, res) => {
  res.status(200).render("compose", {
    title: "Compose",
    post: new Article(),
  });
  console.log(new Article());
};
exports.getArticle = catchAsync(async (req, res, next) => {
  //Find the article using slug!
  const findPost = { slug: req.params.slug };
  //Increment its views count!
  const updateViews = { $inc: { views: 1 } };
  //Return the updated field
  const returnUpdated = { new: true };

  const post = await Article.findOneAndUpdate(
    findPost,
    updateViews,
    returnUpdated
  ).populate({
    path: "comments",
    select: ["comment", "createdAt"],
  });

  if (!post)
    return next(
      new AppError("There is no Article with that name", 404)
    );

  const morePosts = await Article.find({ category: post.category });
  res.status(200).render("post", {
    title: post.slug,
    post,
    morePosts,
  });
});

exports.specificPosts = catchAsync(async (req, res, next) => {
  const posts = res.paginatedResults;
  const category = Object.keys(posts.category)[0];
  const value = Object.values(posts.category)[0];
  // res.status(200).json(posts);
  res.status(200).render("specificPosts", {
    title: `more from ${value}`,
    posts,
    category,
    value,
  });
});

exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render("login", {
    title: "login",
  });
});

exports.getSignUpForm = catchAsync(async (req, res, next) => {
  res.status(200).render("signup", {
    title: "Signup",
  });
});

exports.getForgetPassword = catchAsync(async (req, res, next) => {
  res.status(200).render("forgetPassword", {
    title: "Forget Password?",
  });
});

exports.getResetPassword = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  res.status(200).render("resetPassword", {
    title: "Reset Password",
    id,
  });
});

exports.aboutMe = catchAsync(async (req, res, next) => {
  res.status(200).render("profile", {
    title: "Profile",
  });
});

exports.editArticle = catchAsync(async (req, res, next) => {
  const post = await Article.findById(req.params.id);
  res.status(200).render("compose", {
    title: "Edit",
    post,
  });
  // res.status(200).json(post);
});

exports.sendArticle = catchAsync(async (req, res, next) => {
  const { title, abstract, markdown } = req.body;
  const body = `<h1>${title}</h1></br><h2>${abstract}</h2></br><p>${markdown}</p>`;
  const attachment = req.body.images;

  const { user } = req;
  const url = `${req.protocol}://${req.get("host")}/compose`;

  await new Email(user, url, body, attachment).sendPost();

  res.status(200).json({
    status: "success",
  });
});
