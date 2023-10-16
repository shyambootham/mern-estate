import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Do not encode the entire connection string

mongoose
  .connect(process.env.Mongo)
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.listen(3000, () => {
  console.log("server is running in 3000!!!");
});
