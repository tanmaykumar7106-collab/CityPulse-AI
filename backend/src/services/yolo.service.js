import { Blob } from "buffer";

const YOLO_SERVICE_URL =
    process.env.YOLO_SERVICE_URL || "http://localhost:8000";

export const analyzeImagesWithYOLO = async (files = []) => {
    if (!files || files.length === 0) {
        return {
            totalDetections: 0,
            topDetection: null,
            detections: [],
            summary: "No image was provided for YOLO analysis.",
        };
    }

    try {
        const formData = new FormData();

        files.slice(0, 3).forEach((file, index) => {
            const blob = new Blob([file.buffer], {
                type: file.mimetype,
            });

            formData.append(
                "images",
                blob,
                file.originalname || `complaint-image-${index + 1}.jpg`
            );
        });

        const response = await fetch(`${YOLO_SERVICE_URL}/detect`, {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "YOLO service failed");
        }

        const topDetection = result.topDetection;

        return {
            totalDetections: result.totalDetections || 0,
            topDetection: topDetection || null,
            detections: result.detections || [],
            summary: topDetection
                ? `YOLO detected ${topDetection.className} with ${Math.round(
                    topDetection.confidence * 100
                )}% confidence.`
                : "YOLO did not detect a known civic issue clearly.",
        };
    } catch (error) {
        console.log("YOLO service failed:", error.message);

        return {
            totalDetections: 0,
            topDetection: null,
            detections: [],
            summary: "YOLO analysis was unavailable. Gemini and rule-based fallback were used.",
        };
    }
};