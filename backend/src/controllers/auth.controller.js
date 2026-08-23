import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { generateToken } from "../helpers/jwt.js";
import { sendResponse } from "../helpers/response.js";

export const register = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }

    const user = await User.create({
        fullName,
        email,
        password,
    });

    const token = generateToken(user._id, user.role);

    return sendResponse(
        res,
        201,
        "User registered successfully",
        {
            token,
            user,
        }
    );
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        throw new ApiError(401, "Invalid email or password");
    }

    const token = generateToken(user._id, user.role);

    return sendResponse(
        res,
        200,
        "Login successful",
        {
            token,
            user,
        }
    );
});

export const profile = asyncHandler(async (req, res) => {
    return sendResponse(
        res,
        200,
        "Profile fetched successfully",
        req.user
    );
});