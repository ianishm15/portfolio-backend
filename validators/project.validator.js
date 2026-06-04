import { body }
from "express-validator";

export const addProjectValidator = [

  body("title")
    .notEmpty()
    .withMessage(
      "Title is required"
    ),

  body("description")
    .notEmpty()
    .withMessage(
      "Description is required"
    ),

  body("techStack")
    .notEmpty()
    .withMessage(
      "Tech stack is required"
    ),

  body("url")
    .notEmpty()
    .withMessage(
      "Project URL is required"
    ),

];