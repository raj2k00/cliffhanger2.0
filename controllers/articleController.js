const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const Article = require("../models/articleModel");
const factory = require("./factoryHandler");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// const multerStorage = multer.memoryStorage();
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `public/img/cover`);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `cover-${req.user.id}-${Date.now()}.${ext}`);
  },
});

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

exports.uploadArticleCover = upload.single("imageCover");

exports.resizeCoverPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  let imgCover = "";

  // File upload to cloud
  await cloudinary.uploader.upload(
    `public/img/cover/${req.file.filename}`,
    { width: 2000, crop: "fill", gravity: "auto" },
    (err, image) => {
      // console.log("** File Upload");
      if (err) {
        console.warn(err);
      }
      // console.log(`${image.public_id}`);
      // console.log(`${image.url}`);
      imgCover = image.url;
    }
  );
  req.body.imageCover = imgCover;
  next();
});

exports.getAllArticle = factory.getAllDoc(Article);

exports.getOneArticle = factory.getOne(
  Article,
  {
    path: "comments",
    select: "comment",
  },
  {
    path: "author",
    select: ["name", "photo", "about"],
  }
);

exports.createOne = factory.createOne(Article);
exports.updateOne = factory.updateOne(Article);
exports.deleteOne = factory.deleteOne(Article);
