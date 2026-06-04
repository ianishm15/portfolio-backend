import {
  ENV,
} from "../config/env.js";

/* ---------------------------- */
/* Access Token Cookie          */
/* ---------------------------- */

export const accessOptions = {

  httpOnly: true,

  secure:
    ENV.NODE_ENV === "production",

  sameSite:
    ENV.NODE_ENV === "production"

      ? "none"

      : "lax",
  path: "/",


  maxAge:
    15 * 60 * 1000,

};

/* ---------------------------- */
/* Refresh Token Cookie         */
/* ---------------------------- */

export const refreshOptions = {

  httpOnly: true,

  secure:
    ENV.NODE_ENV === "production",

  sameSite:
    ENV.NODE_ENV === "production"

      ? "none"

      : "lax",
  path: "/",


  maxAge:
    7 * 24 * 60 * 60 * 1000,

};