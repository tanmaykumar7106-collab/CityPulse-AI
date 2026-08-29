import { body } from "express-validator";

export const createComplaintValidation = [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
];

export const updateStatusValidation = [
    body("status")
        .isIn(["Pending", "Assigned", "In Progress", "Resolved", "Rejected"])
        .withMessage("Invalid complaint status"),

    body("remarks")
        .optional()
        .isString()
        .withMessage("Remarks must be text"),
];