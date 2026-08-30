import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            default: "",
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High", "Critical"],
            default: "Medium",
        },

        status: {
            type: String,
            enum: ["Pending", "Assigned", "In Progress", "Resolved", "Rejected"],
            default: "Pending",
        },

        department: {
            type: String,
            default: "",
        },

        referenceUrl: {
            type: String,
            default: "",
        },

        location: {
            address: {
                type: String,
                default: "",
            },
            latitude: Number,
            longitude: Number,
        },

        images: [
            {
                url: String,
                publicId: String,
            },
        ],

        citizen: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        assignedOfficer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        remarks: {
            type: String,
            default: "",
        },

        aiAnalysis: {
            category: String,
            priority: String,
            riskScore: Number,
            confidence: Number,
            explanation: String,
            imageObservation: String,
            yoloSummary: String,
            yoloDetections: [
                {
                    fileName: String,
                    classId: Number,
                    className: String,
                    confidence: Number,
                    box: {
                        x1: Number,
                        y1: Number,
                        x2: Number,
                        y2: Number,
                    },
                },
            ],
            processedAt: Date,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Complaint", complaintSchema);