import mongoose from "mongoose";
import { DB_NAME } from "../Constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    console.log(`mongodb connected !! DBHost ${connectionInstance.connection.host}`)
  } catch (error) {
    console.log(`mongodb connection error: ${error}`)
    process.exit(1)
  }
};

export default connectDB;


// ************ database connection error ***********
// when i was trying to connect with database it was giving error
// {MongoParseError: Invalid scheme, expected connection string to start with
//  "mongodb://" or "mongodb+srv://"}
// because dotenv file was not availabel globally it can we used by two methods:
// 1. use this {"server": "nodemon -r dotenv/config --experimental-json-modules src/server.js"}
// 2. or improt these two files at the top of the server.js
// {import dotenv from "dotenv";
// dotenv.config();}
