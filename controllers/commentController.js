const Comment = require("../models/commentModel");
const factory = require("./factoryHandler");

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.article) req.body.article = req.params.articleId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAllDoc(Comment);
exports.getOneReview = factory.getOne(Comment);
exports.createReview = factory.createOne(Comment);
exports.updateReview = factory.updateOne(Comment);
exports.deleteReview = factory.deleteOne(Comment);
