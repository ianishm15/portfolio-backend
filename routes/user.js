import express from "express";
import multer from "multer"
import {
  refreshAccessToken, login, logout, myProfile, updateUser,
  getUser,
  addTimeline,
  addProject,
  deleteTimeline,
  deleteProject,
  addSkill,
  deleteSkill,
  sendContact,
  getMessages,
  deleteMessage
} from "../controllers/user.js";
import validate from "../middlewares/validate.middleware.js";
import { loginValidator } from "../validators/auth.validator.js";
import { updateUserValidator } from "../validators/user.validators.js"
import { addProjectValidator } from "../validators/project.validator.js"
import { authenticate } from "../middlewares/auth.middleware.js"
import { authorize } from "../middlewares/role.middleware.js"
import { loginLimiter } from "../middlewares/rateLimit.middleware.js"

const upload = multer({ dest: "uploads/" });
export const userRouter = express.Router();


userRouter.post("/refresh", refreshAccessToken);

userRouter.post("/login", loginLimiter, loginValidator, validate, login);

userRouter.post("/logout", authenticate, logout);

userRouter.get("/user", getUser);

userRouter.get("/me", authenticate, myProfile);

userRouter.post("/contact", sendContact);

userRouter.use("/admin", authenticate, authorize("admin"));

userRouter.put("/admin/about", upload.single("avatar"), updateUserValidator,
  validate, updateUser);

userRouter.post("/admin/projects", upload.single("image"), addProjectValidator, validate,
  addProject
);

userRouter.delete("/admin/projects/:id", deleteProject);

userRouter.post("/admin/timelines", addTimeline);

userRouter.delete("/admin/timelines/:id", deleteTimeline);

userRouter.post("/admin/skills", upload.single("image"), addSkill);

userRouter.delete("/admin/skills/:id", deleteSkill);

userRouter.get("/admin/messages", getMessages);

userRouter.delete("/admin/messages/:id", deleteMessage);
