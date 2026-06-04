import rateLimit
  from "express-rate-limit";

export const apiLimiter =
  rateLimit({

    windowMs:
      15 * 60 * 1000,

    max: 100,

    message:
      "Too many requests",

    standardHeaders: true,

  });


export const loginLimiter =
  rateLimit({

    windowMs:
      15 * 60 * 1000,

    max: 5,

    message:
      "Too many login attempts",

  });