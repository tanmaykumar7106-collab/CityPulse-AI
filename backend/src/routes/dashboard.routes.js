import express from "express";

import auth from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import {
    getCitizenDashboard,
    getAdminDashboard,
} from "../controllers/dashboard.controller.js";
import { USER_ROLES } from "../utils/constants.js";

const router = express.Router();

router.get("/me", auth, getCitizenDashboard);

router.get(
    "/admin",
    auth,
    authorize(USER_ROLES.OFFICER, USER_ROLES.ADMIN),
    getAdminDashboard
);

export default router;