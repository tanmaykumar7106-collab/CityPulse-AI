import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import errorHandler from "./middleware/error.middleware.js";

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow Postman, server-to-server requests, and mobile apps
            if (!origin) {
                return callback(null, true);
            }

            // Allow exact frontend URL from env
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            // Allow Vercel deployed frontend domains
            if (origin.endsWith(".vercel.app")) {
                return callback(null, true);
            }

            return callback(new Error(`CORS blocked for origin: ${origin}`));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(helmet());
app.use(compression());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cookieParser());
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.json({
        success: true,
        project: "CityPulse AI Backend",
        status: "Running 🚀",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(errorHandler);

export default app;