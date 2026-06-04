import dotenv from "dotenv";
dotenv.config();
import { ENV } from "./config/env.js"

import { app } from "./app.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import http from "http";
import initializeSocket from "./socket/socket.js";
import { logger } from "./logger/index.js";

const httpServer = http.createServer(app);

initializeSocket(httpServer);

let server;

process.on("uncaughtException", (error) => {
  logger.error(`${error.name}: ${error.message}\n`, error.stack);


  process.exit(1);
});


process.on("unhandledRejection", (error) => {
  logger.error(`${error.name}: ${error.message}\n`, error.stack);

  if (server) {
    server.close(() => {
      logger.info("🛑 HTTP server closed via unhandled rejection");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});


const requiredEnvVariables = [
  "NODE_ENV",

  "MONGO_URI",

  "JWT_SECRET",
  "JWT_REFRESH_SECRET",

  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];
requiredEnvVariables.forEach((key) => {
  if (!process.env[key]) {
    logger.error(`❌ Missing environment variable: ${key}`);
    process.exit(1);
  }
});


cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
  secure: true,
});


mongoose.set("strictQuery", true)
mongoose.connection.on(
  "error",
  (error) => {
    logger.error(`${error.name}: ${error.message}\n`,
      error.stack);
  }
);

mongoose.connection.on(
  "disconnected",
  () => {
    logger.warn(
      "MongoDB Disconnected"
    );
  }
);

const startServer = async () => {
  try {

    const connection = await mongoose.connect(ENV.MONGO_URI);
    logger.info(`✅ MongoDB Connected: ${connection.connection.host}`);

    server = httpServer.listen(ENV.PORT, () => {
      logger.info(`🚀 Server running on port ${ENV.PORT}`);
      logger.info(`🌍 Environment: ${ENV.NODE_ENV || "development"}`);
    });

  } catch (error) {
    logger.error(`${error.name}: ${error.message}`);
    process.exit(1);
  }
};


const shutdown = (signal) => {
  logger.info(`\n⚠️ ${signal} received. Starting graceful shutdown...`);

  if (!server) {

    mongoose.connection
      .close()
      .finally(() =>
        process.exit(0)
      );

    return;
  }


  server.close(async () => {
    logger.info("🛑 HTTP server closed.");
    try {
      await mongoose.connection.close();
      logger.info("🗄️ MongoDB connection closed cleanly.");
      process.exit(0);
    } catch (error) {
      logger.error(`${error.name}: ${error.message}\n`,
        error.stack);
      process.exit(1);
    }
  });


  setTimeout(() => {
    logger.error("❌ Force shutting down: Connections took too long to close.");
    process.exit(1);
  }, 10000);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();
