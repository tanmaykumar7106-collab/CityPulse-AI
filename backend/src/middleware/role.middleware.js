import ApiError from "../utils/ApiError.js";

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            throw new ApiError(403, "Access denied. You are not authorized.");
        }

        next();
    };
};

export default authorize;