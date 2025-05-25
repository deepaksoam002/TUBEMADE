import mongoose from "mongoose";
import { DB_NAME } from "../constents.js";

const connectDB = async () => {
  try {
    const connectedInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    console.log(
      ` \n mongodb connected ! db host: ${connectedInstance.connection.host}`
    );
  } catch (error) {
    console.log("Mongo Connection Error", error);
    process.exit(1);
  }
};

export default connectDB;
