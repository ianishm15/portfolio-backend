import { User } from "../models/User.js";

export const findUserById = (userId) => User.findById(userId);
export const findUserByEmail = (email) => User.findOne({ email }).select("+password");
export const findUserForToken = (userId) => User.findById(userId).select("_id role");
export const findPortfolioUser = () =>User.findOne().select("-password -email").lean();
export const saveUser = (user) => user.save();