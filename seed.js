import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/User.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

await User.create({
  name: "Anish Kumar",
  email: "imanishm15@gmail.com",
  password: "asdfghjkl@15",
  role: "admin",
});

console.log("Admin created successfully");

process.exit();
