import { body }
from "express-validator";

export const updateUserValidator = [

  body("name")
    .optional()
    .trim()
    .isLength({
      min: 2,
      max: 50,
    })
    .withMessage(
      "Name must be between 2 and 50 characters"
    ),

  body("title")
    .optional()
    .trim()
    .isLength({
      max: 100,
    })
    .withMessage(
      "Title too long"
    ),

  body("subtitle")
    .optional()
    .trim()
    .isLength({
      max: 200,
    })
    .withMessage(
      "Subtitle too long"
    ),

];