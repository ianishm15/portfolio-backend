import { body }
    from "express-validator";

export const timelineValidator = [

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

    body("date")
        .notEmpty()
        .withMessage(
            "Date is required"
        ),

];