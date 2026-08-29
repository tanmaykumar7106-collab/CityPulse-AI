import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { sendResponse } from "../helpers/response.js";
import getImageUrls from "../services/cloudinary.service.js";
import { analyzeComplaint } from "../services/ai.service.js";
import validateAI from "../helpers/aiValidator.js";

import {
    createComplaint,
    getComplaintsByCitizen,
    getComplaintById,
    updateComplaint,
    deleteComplaint,
    getAllComplaints,
    updateComplaintStatus,
} from "../services/complaint.service.js";

export const create = asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
        throw new ApiError(400, "At least one issue image is required.");
    }

    const uploadedImages = await getImageUrls(req.files || []);

    const complaint = await createComplaint({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category || "",
        priority: "Medium",
        department: "",
        referenceUrl: req.body.referenceUrl || "",
        location: {
            address: req.body.address || "",
        },
        images: uploadedImages,
        citizen: req.user._id,
    });

    let aiResult = {};

    try {
        aiResult = await analyzeComplaint({
            title: complaint.title,
            description: complaint.description,
            files: req.files || [],
        });

        console.log("Raw Gemini Result:", aiResult);
    } catch (error) {
        console.log("Gemini AI failed, using rule-based fallback:", error.message);
    }

    aiResult = validateAI(aiResult, {
        title: complaint.title,
        description: complaint.description,
    });

    console.log("Final AI Result:", aiResult);

    complaint.category = aiResult.category;
    complaint.priority = aiResult.priority;
    complaint.department = aiResult.department;

    complaint.aiAnalysis = {
        category: aiResult.category,
        priority: aiResult.priority,
        riskScore: aiResult.riskScore,
        confidence: aiResult.confidence,
        explanation: aiResult.explanation,
        imageObservation: aiResult.imageObservation,
        processedAt: new Date(),
    };

    await complaint.save();

    return sendResponse(res, 201, "Complaint submitted successfully", complaint);
});

export const getMyComplaints = asyncHandler(async (req, res) => {
    const complaints = await getComplaintsByCitizen(req.user._id);

    return sendResponse(res, 200, "Complaints fetched successfully", complaints);
});

export const getOneComplaint = asyncHandler(async (req, res) => {
    const complaint = await getComplaintById(req.params.id);

    if (!complaint) {
        throw new ApiError(404, "Complaint not found");
    }

    if (complaint.citizen._id.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Access denied");
    }

    return sendResponse(res, 200, "Complaint fetched successfully", complaint);
});

export const update = asyncHandler(async (req, res) => {
    const complaint = await getComplaintById(req.params.id);

    if (!complaint) {
        throw new ApiError(404, "Complaint not found");
    }

    if (complaint.citizen._id.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Access denied");
    }

    const updatedComplaint = await updateComplaint(req.params.id, req.body);

    return sendResponse(
        res,
        200,
        "Complaint updated successfully",
        updatedComplaint
    );
});

export const remove = asyncHandler(async (req, res) => {
    const complaint = await getComplaintById(req.params.id);

    if (!complaint) {
        throw new ApiError(404, "Complaint not found");
    }

    if (complaint.citizen._id.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Access denied");
    }

    await deleteComplaint(req.params.id);

    return sendResponse(res, 200, "Complaint deleted successfully");
});

export const getAll = asyncHandler(async (req, res) => {
    const complaints = await getAllComplaints();

    return sendResponse(
        res,
        200,
        "All complaints fetched successfully",
        complaints
    );
});

export const changeStatus = asyncHandler(async (req, res) => {
    const { status, remarks } = req.body;

    const complaint = await updateComplaintStatus(
        req.params.id,
        status,
        remarks,
        req.user._id
    );

    if (!complaint) {
        throw new ApiError(404, "Complaint not found");
    }

    return sendResponse(
        res,
        200,
        "Complaint status updated successfully",
        complaint
    );
});