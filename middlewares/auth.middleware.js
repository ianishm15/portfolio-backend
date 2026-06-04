import jwt from "jsonwebtoken";

import ApiError from "../utils/ApiError.js";
import { ENV } from "../config/env.js";

export const authenticate =
  (req, res, next) => {

    const token =
      req.cookies?.accessToken;

    if (!token) {

      return next(
        new ApiError(
          401,
          "Authentication required"
        )
      );

    }

    try {

      const decoded =
        jwt.verify(
          token,
          ENV.JWT_SECRET
        );

      req.user = decoded;

      next();

    } catch (error) {

      return next(
        new ApiError(
          401,
          "Unauthorized"
        )
      );

    }

  };