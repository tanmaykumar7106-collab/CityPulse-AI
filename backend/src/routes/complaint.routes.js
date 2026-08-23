import express from "express";
import { validationResult } from "express-validator";

import auth from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

import {
    create,
    getMyComplaints,
    getOneComplaint,
    update,
    remove,
} from "../controllers/complaint.controller.js";

import { createComplaintValidation } from "../validators/complaint.validator.js";

const router = express.Router();

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }

    next();
};
router.post(
    "/",
    auth,
    upload.array("images", 5),
    createComplaintValidation,
    validate,
    create
);

router.get("/", auth, getMyComplaints);

router.get("/:id", auth, getOneComplaint);

router.put("/:id", auth, update);


router.delete("/:id", auth, remove);

export default router;