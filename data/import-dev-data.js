const fs = require("fs");
const mongoose = require("mongoose");
require("dotenv").config();
const Article = require("../models/articleModel");
const User = require("../models/userModel");
const Comment = require("../models/commentModel");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB connection successful!"));

// READ JSON FILE
const article = JSON.parse(
  fs.readFileSync(`${__dirname}/articles.json`, "utf-8")
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/users.json`, "utf-8")
);
const comment = JSON.parse(
  fs.readFileSync(`${__dirname}/comments.json`, "utf-8")
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Article.create(article);
    await User.create(users, { validateBeforeSave: false });
    await Comment.create(comment);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Article.deleteMany();
    await User.deleteMany();
    await Comment.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
