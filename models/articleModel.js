const mongoose = require("mongoose");
const slugify = require("slugify");
const marked = require("marked");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");
// const User = require("./userModel");

const dompurify = createDomPurify(new JSDOM().window);

const articleSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "An Article must have a title"],
      unique: true,
    },
    abstract: {
      type: String,
      required: [true, "An Article must have an abstract"],
    },
    slug: {
      type: String,
    },
    tags: {
      type: [String],
      required: [true, "A article must have a tags"],
      enum: {
        values: [
          "science",
          "technology",
          "gaming",
          "entertainment",
          "general",
          "programming",
          "movies",
          "anime",
          "computer",
          "events",
        ],
        message: "Article must have tags",
      },
    },
    views: {
      type: Number,
      default: 0,
    },
    typeFace: {
      type: String,
    },
    category: {
      type: String,
      required: [true, "A article must have a category"],
      enum: {
        values: [
          "science",
          "technology",
          "gaming",
          "entertainment",
          "general",
          "programming",
          "movies",
          "anime",
          "computer",
          "events",
        ],
        message: "Article must have tags",
      },
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      // select: false,
    },
    markdown: {
      type: String,
      required: true,
    },
    sanitizedHtml: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "An Article must have a author"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

articleSchema.index({ slug: 1 });

// // VIRTUAL PROPERTY NOT VISIBLE OUTSIDE (BUSINESSS LOGIC)

articleSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "article",
  localField: "_id",
});

// DOCUMENT MIDDLEWARE
//this - keyword represents current document
articleSchema.pre("validate", function (next) {
  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(
      marked.parse(this.markdown)
    );
  }
  next();
});

articleSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

articleSchema.pre(/^find/, function (next) {
  this.populate({
    path: "author",
    select: ["name", "photo", "about"],
  });
  next();
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
