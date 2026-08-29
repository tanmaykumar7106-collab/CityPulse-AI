import Complaint from "../models/Complaint.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendResponse } from "../helpers/response.js";

const buildDistribution = (items, key, defaultValue = "Other") => {
    const grouped = {};

    items.forEach((item) => {
        const value = item[key] || defaultValue;
        grouped[value] = (grouped[value] || 0) + 1;
    });

    return Object.entries(grouped).map(([name, value]) => ({
        name,
        value,
    }));
};

export const getCitizenDashboard = asyncHandler(async (req, res) => {
    const complaints = await Complaint.find({ citizen: req.user._id })
        .sort({ createdAt: -1 });

    const totalComplaints = complaints.length;

    const resolvedComplaints = complaints.filter(
        (complaint) => complaint.status === "Resolved"
    ).length;

    const pendingComplaints = complaints.filter((complaint) =>
        ["Pending", "Assigned", "In Progress"].includes(complaint.status)
    ).length;

    const criticalComplaints = complaints.filter(
        (complaint) => complaint.priority === "Critical"
    ).length;

    const resolutionRate =
        totalComplaints > 0
            ? Number(((resolvedComplaints / totalComplaints) * 100).toFixed(1))
            : 0;

    const dashboard = {
        totalComplaints,
        resolvedComplaints,
        pendingComplaints,
        criticalComplaints,
        resolutionRate,
        priorityDistribution: buildDistribution(complaints, "priority", "Medium"),
        categoryDistribution: buildDistribution(complaints, "category", "Other"),
        statusDistribution: buildDistribution(complaints, "status", "Pending"),
        latestComplaints: complaints.slice(0, 8),
    };

    return sendResponse(
        res,
        200,
        "Citizen dashboard fetched successfully",
        dashboard
    );
});

export const getAdminDashboard = asyncHandler(async (req, res) => {
    const complaints = await Complaint.find()
        .sort({ createdAt: -1 })
        .populate("citizen", "fullName email role")
        .populate("assignedOfficer", "fullName email role");

    const totalComplaints = complaints.length;

    const resolvedComplaints = complaints.filter(
        (complaint) => complaint.status === "Resolved"
    ).length;

    const pendingComplaints = complaints.filter((complaint) =>
        ["Pending", "Assigned", "In Progress"].includes(complaint.status)
    ).length;

    const criticalComplaints = complaints.filter(
        (complaint) => complaint.priority === "Critical"
    ).length;

    const resolutionRate =
        totalComplaints > 0
            ? Number(((resolvedComplaints / totalComplaints) * 100).toFixed(1))
            : 0;

    const dashboard = {
        totalComplaints,
        resolvedComplaints,
        pendingComplaints,
        criticalComplaints,
        resolutionRate,
        priorityDistribution: buildDistribution(complaints, "priority", "Medium"),
        categoryDistribution: buildDistribution(complaints, "category", "Other"),
        statusDistribution: buildDistribution(complaints, "status", "Pending"),
        latestComplaints: complaints.slice(0, 10),
    };

    return sendResponse(
        res,
        200,
        "Admin dashboard fetched successfully",
        dashboard
    );
});