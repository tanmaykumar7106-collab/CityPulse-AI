import { body } from "express-validator";

export const createComplaintValidation = [

    body("title")
        .notEmpty()
        .withMessage("Title is required"),

    body("description")
        .notEmpty()
        .withMessage("Description is required"),

];