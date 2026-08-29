import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import errorHandler from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(helmet());

app.use(compression());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));

app.use("/api/complaints", complaintRoutes);

app.use(errorHandler);

app.use("/api/auth", authRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        project: "CityPulse AI Backend",
        status: "Running 🚀"
    });
});

export default app;