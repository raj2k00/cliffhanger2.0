require("dotenv").config();
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

process.on("uncaughtException", (err) => {
  console.log("uncaught Exception 💥💥 Server shutting down");
  console.log(err);
  process.exit(1);
});

const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected to Cloud Database"));

//Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`server started on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log(
    "unhandled Rejection 💥💥 Server shutting down gracefully"
  );
  console.log(err.name, err.message);
  server.close(() => {
    process.exit();
  });
});

process.on("SIGTERM", () => {
  console.log("🤐 SIGTERM RECEIVED, Shutting down server gracefully");
  server.close(() => {
    console.log("🧨 process terminated");
  });
});
