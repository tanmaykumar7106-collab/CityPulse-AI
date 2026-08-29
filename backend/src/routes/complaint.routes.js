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

router.post(
    "/",
    auth,
    upload.array("images", 5),
    createComplaintValidation,
    validate,
    create
);

router.get("/", auth, getMyComplaints);

router.get(
    "/admin/all",
    auth,
    authorize(USER_ROLES.OFFICER, USER_ROLES.ADMIN),
    getAll
);

router.patch(
    "/:id/status",
    auth,
    authorize(USER_ROLES.OFFICER, USER_ROLES.ADMIN),
    updateStatusValidation,
    validate,
    changeStatus
);

router.get("/:id", auth, getOneComplaint);

router.put("/:id", auth, update);

router.delete("/:id", auth, remove);

export default router;