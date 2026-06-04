import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import ApiError from "../utils/ApiError.js";
import { generateAccessToken } from "../utils/generateTokens.js";
import { findUserById, findPortfolioUser,findUserByEmail, findUserForToken, saveUser } from "../repositories/user.repository.js";
import { uploadToCloudinary, deleteFromCloudinary, } from "../utils/cloudinary.js";

export const refreshTokenService = async (refreshToken) => {
    if (!refreshToken) { throw new ApiError(401, "Authentication required") }
    let decoded;
    try { decoded = jwt.verify(refreshToken, ENV.JWT_REFRESH_SECRET) }
    catch { throw new ApiError(401, "Invalid refresh token") }
    const user = await findUserForToken(decoded.userId);
    if (!user) { throw new ApiError(404, "User not found") }
    return generateAccessToken({ userId: user._id, role: user.role });
};

export const loginUserService = async (email, password) => {
    const user = await findUserByEmail(email);
    if (!user) { throw new ApiError(401, "Invalid email or password") };
    const isMatch = await user.comparePassword(password);
    if (!isMatch) { throw new ApiError(401, "Invalid email or password") } return user
};

export const getPortfolioUserService = async () => {
    const user = await findPortfolioUser();
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return user;
};
export const updateProfile = async (userId, updateData) => {
    const user = await findUserById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    user.about = { ...user.about, ...updateData, };
    await saveUser(user);
    return user
};

export const getProfile = async (userId) => {
    const user = await findUserById(userId);
    if (!user) { throw new ApiError(404, "User not found") }
    return user
};

export const addTimelineService = async (userId, timelineData) => {
    const { title, description, date } = timelineData;
    if (!title || !description || !date) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await findUserById(userId);
    if (!user) { throw new ApiError(404, "User not found") };
    user.timeline.unshift(timelineData);
    await saveUser(user);
    return user;

};

export const deleteTimelineService = async (userId, timelineId) => {
    const user = await findUserById(userId);
    if (!user) { throw new ApiError(404, "User not found") }
    const timeline = user.timeline.find((item) => item._id.toString() === timelineId);
    if (!timeline) { throw new ApiError(404, "Timeline not found") }

    user.timeline = user.timeline.filter((item) => item._id.toString() !== timelineId);
    await saveUser(user)
};

export const addProjectService = async (userId, projectData, file) => {
    const user = await findUserById(userId);
    if (!user) { throw new ApiError(404, "User not found") }
    const uploadedImage = await uploadToCloudinary(file.path, "portfolio/projects");
    if (!uploadedImage) {
        throw new ApiError(500, "Image upload failed");

    }
    user.projects.unshift({ ...projectData, image: uploadedImage, });
    await saveUser(user);
    return user;
};

export const deleteProjectService = async (userId, projectId) => {
    const user = await findUserById(userId);
    if (!user) { throw new ApiError(404, "User not found") }

    const project = user.projects.find((item) => item._id.toString() === projectId);
    if (!project) { throw new ApiError(404, "Project not found") }
    if (project.image?.public_id) { await deleteFromCloudinary(project.image.public_id) }
    user.projects = user.projects.filter((item) => item._id.toString() !== projectId);
    await saveUser(user);

};

export const addSkillService = async (userId, file) => {
    const user = await findUserById(userId);
    if (!user) { throw new ApiError(404, "User not found") }
    if (!file) { throw new ApiError(400, "Skill image required") }

    const uploadedSkill = await uploadToCloudinary(file.path, "portfolio/skills");
    if (!uploadedSkill) { throw new ApiError(500, "Skill upload failed") }

    user.skills.push(uploadedSkill);
    await saveUser(user);
    return uploadedSkill;
};

export const deleteSkillService = async (userId, skillId) => {
    const user = await findUserById(userId);
    if (!user) { throw new ApiError(404, "User not found") }
    const skill = user.skills.find((item) => item._id.toString() === skillId);
    if (!skill) { throw new ApiError(404, "Skill not found") }
    if (skill.public_id) { await deleteFromCloudinary(skill.public_id) }
    user.skills = user.skills.filter((item) => item._id.toString() !== skillId);
    await saveUser(user);

};
