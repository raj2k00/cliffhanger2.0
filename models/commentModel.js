const mongoose = require("mongoose");
const Article = require("./articleModel");

const commentSchema = mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "Comment should not be empty"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "comment must be created by a user"],
    },
    article: {
      type: mongoose.Schema.ObjectId,
      ref: Article,
      required: [true, "comment must belong to the article"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
commentSchema.pre(/^find/, function (next) {
  //   this.populate({
  //     path: "article",
  //     select: "title",
  //   }).populate({
  //     path: "user",
  //     select: "name",
  //   });
  this.populate({
    path: "user",
    select: ["name", "photo"],
  }).sort({ createdAt: -1 });
  next();
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
