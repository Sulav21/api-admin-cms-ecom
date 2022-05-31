import mongoose from "mongoose";

export const dbconnect = () => {
  try {
    const conn = mongoose.connect(process.env.MONGO_CLIENT);
    conn && console.log("MongoDB is connected");
  } catch (err) {
    console.log(err);
  }
};
