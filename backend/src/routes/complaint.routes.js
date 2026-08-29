import express from "express";
import { validationResult } from "express-validator";

import auth from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";

import {
    create,
    getMyComplaints,
    getOneComplaint,
    update,
    remove,
    getAll,
    changeStatus,
} from "../controllers/complaint.controller.js";

import {
    createComplaintValidation,
    updateStatusValidation,
} from "../validators/complaint.validator.js";

import { USER_ROLES } from "../utils/constants.js";

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

// Citizen only: create complaint
router.post(
    "/",
    auth,
    authorize(USER_ROLES.CITIZEN),
    upload.array("images", 5),
    createComplaintValidation,
    validate,
    create
);

// Citizen only: own complaints
router.get(
    "/",
    auth,
    authorize(USER_ROLES.CITIZEN),
    getMyComplaints
);

// Admin/Officer only: view all complaints
router.get(
    "/admin/all",
    auth,
    authorize(USER_ROLES.OFFICER, USER_ROLES.ADMIN),
    getAll
);

// Admin/Officer only: update status
router.patch(
    "/:id/status",
    auth,
    authorize(USER_ROLES.OFFICER, USER_ROLES.ADMIN),
    updateStatusValidation,
    validate,
    changeStatus
);

// Citizen can view own complaint, admin/officer can view any complaint
router.get("/:id", auth, getOneComplaint);

// Citizen only: update own complaint
router.put(
    "/:id",
    auth,
    authorize(USER_ROLES.CITIZEN),
    update
);

// Citizen only: delete own complaint
router.delete(
    "/:id",
    auth,
    authorize(USER_ROLES.CITIZEN),
    remove
);

export default router;