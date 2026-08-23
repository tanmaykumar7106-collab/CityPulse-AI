import ApiResponse from "../utils/ApiResponse.js";

export const sendResponse = (
    res,
    statusCode,
    message,
    data = null
) => {
    return res
        .status(statusCode)
        .json(new ApiResponse(statusCode, data, message));
};