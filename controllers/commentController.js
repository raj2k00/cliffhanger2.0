const Comment = require("../models/commentModel");
const factory = require("./factoryHandler");

exports.setArticleUserIds = (req, res, next) => {
  if (!req.body.article) req.body.article = req.params.articleId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllComments = factory.getAllDoc(Comment);
exports.getOneComment = factory.getOne(Comment);
exports.createComment = factory.createOne(Comment);
exports.updateComment = factory.updateOne(Comment);
exports.deleteComment = factory.deleteOne(Comment);
