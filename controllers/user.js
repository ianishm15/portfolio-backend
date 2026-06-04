import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import { accessOptions, refreshOptions } from "../utils/cookieOptions.js";
import asyncHandler from "../utils/asynHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js"
import {
    loginUserService, getProfile, updateProfile, deleteTimelineService, refreshTokenService, addTimelineService,
    addProjectService, deleteProjectService, addSkillService, deleteSkillService,
    getPortfolioUserService
} from "../services/user.service.js";

import { sendContactService, getMessagesService, deleteMessageService } from "../services/message.service.js"
export const refreshAccessToken = asyncHandler(async (req, res) => {
    const accessToken = await refreshTokenService(req.cookies?.refreshToken);
    res.cookie("accessToken", accessToken, accessOptions);
    return res.status(200).json(new ApiResponse(200, null, "Access token refreshed successfully"))
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await loginUserService(email, password);
    const accessToken = generateAccessToken({ userId: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user._id });
    res.cookie("accessToken", accessToken, accessOptions).cookie("refreshToken", refreshToken, refreshOptions);
    return res.status(200).json(new ApiResponse(200, { user: { _id: user._id, name: user.name, email: user.email, role: user.role } },
        "Logged in successfully"))
});


export const logout = asyncHandler(async (req, res) => {
    res.clearCookie("accessToken", accessOptions).clearCookie("refreshToken", refreshOptions);
    return res.status(200).json(new ApiResponse(200, null, "Logged out successfully"))
});

export const getUser = asyncHandler(async (req, res) => {
    const user = await getPortfolioUserService()
    res.status(200).json(new ApiResponse(200, { user }, "User fetched successfully"))
})

export const myProfile = asyncHandler(async (req, res) => {
    const user = await getProfile(req.user.userId);
    return res.status(200).json(new ApiResponse(200, { user },
        "Profile fetched successfully"))
})


export const updateUser = asyncHandler(async (req, res) => {
    const user = await updateProfile(req.user.userId, req.body);
    return res.status(200).json(new ApiResponse(200, { user }, "Profile updated"));
});

export const addTimeline = asyncHandler(async (req, res) => {
	
    await addTimelineService(req.user.userId, req.body);
    return res.status(201).json(new ApiResponse(201, null, "Timeline added successfully"));
});

export const addProject = asyncHandler(async (req, res) => {
    const { title, description, techStack, githubUrl, url, } = req.body;
    if (!title || !description || !techStack || !url || !req.file) {
        throw new ApiError(400, "All fields are required")
    }

    await addProjectService(req.user.userId, {
        title, description, techStack, githubUrl,
        url,
    }, req.file);
    return res.status(201).json(new ApiResponse(201, null, "Project added successfully"));

});

export const deleteProject = asyncHandler(async (req, res) => {
    await deleteProjectService(req.user.userId, req.params.id);
    return res.status(200).json(new ApiResponse(200, null, "Project deleted successfully"));

});


export const deleteTimeline = asyncHandler(async (req, res) => {
    await deleteTimelineService(req.user.userId, req.params.id);

    res.status(200).json(new ApiResponse(200, null, "Timeline deleted successfully"));

});


export const addSkill = asyncHandler(async (req, res) => {
    await addSkillService(req.user.userId, req.file);
    res.status(201).json(new ApiResponse(201, null, "Skill added successfully"));
})


export const deleteSkill = asyncHandler(async (req, res) => {
    await deleteSkillService(req.user.userId, req.params.id);
    res.status(200).json(new ApiResponse(200, null, "Skill deleted"));
});

export const sendContact = asyncHandler(async (req, res) => {
    await sendContactService(req.body);
    res.status(201).json(new ApiResponse(201, null, "Message sent successfully"));
});

export const getMessages = asyncHandler(async (req, res) => {
    const messages = await getMessagesService();
    res.status(200).json(new ApiResponse(200, { messages }, "Messages fetched"));
});

export const deleteMessage = asyncHandler(async (req, res) => {
    await deleteMessageService(req.params.id);
    res.status(200).json(new ApiResponse(200, null, "Message deleted"));
})
