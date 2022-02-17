const multer = require("multer");
const sharp = require("sharp");

const Article = require("../models/articleModel");
const factory = require("./factoryHandler");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

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

exports.uploadArticleCover = upload.single("imageCover");

exports.resizeCoverPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.body.imageCover = `article-${
    req.user.id
  }-${Date.now()}-cover.jpeg`;

  await sharp(req.file.buffer)
    .resize({
      width: 2000,
    })
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/cover/${req.body.imageCover}`);
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
