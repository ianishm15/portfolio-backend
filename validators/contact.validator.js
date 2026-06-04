import { body }
from "express-validator";

export const contactValidator = [

  body("name")
    .trim()
    .notEmpty()
    .withMessage(
      "Name is required"
    ),

  body("email")
    .trim()
    .isEmail()
    .withMessage(
      "Valid email required"
    ),

  body("message")
    .trim()
    .notEmpty()
    .withMessage(
      "Message is required"
    ),

];