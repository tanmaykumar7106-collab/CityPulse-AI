import express from "express";

import { register, login, profile, createDemoAdmin } from "../controllers/auth.controller.js";

import auth from "../middleware/auth.middleware.js";

import {
    registerValidation,
    loginValidation,
} from "../validators/auth.validator.js";

import { validationResult } from "express-validator";

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

router.post("/register", registerValidation, validate, register);

router.post("/login", loginValidation, validate, login);

router.post("/create-demo-admin", createDemoAdmin);

router.get("/profile", auth, profile);

export default router;