import { body } from "express-validator";

export const registerValidation = [

    body("fullName")
        .notEmpty()
        .withMessage("Full Name is required"),

    body("email")
        .isEmail()
        .withMessage("Valid email is required"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

];

export const loginValidation = [

    body("email")
        .isEmail(),

    body("password")
        .notEmpty(),

];