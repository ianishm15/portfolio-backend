import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";

import errorMiddleware from "./middlewares/error.middleware.js";

import { userRouter } from "./routes/user.js";
import requestLogger from "./middlewares/request.middleware.js"
export const app = express();
app.set("trust proxy", 1);
import { apiLimiter } from "./middlewares/rateLimit.middleware.js";

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));


const allowedOrigins = [
  "http://localhost:5173",
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(
    process.env.FRONTEND_URL
  );
}

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(requestLogger);
app.use(cookieParser());
app.use("/api", apiLimiter);

app.use(morgan("dev"));


app.use("/api/v1", userRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running successfully 🚀",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorMiddleware);