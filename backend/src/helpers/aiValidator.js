import {
    CATEGORIES,
    DEPARTMENTS,
} from "../utils/constants.js";

const getPriorityFromRiskScore = (score) => {
    if (score >= 76) return "Critical";
    if (score >= 51) return "High";
    if (score >= 26) return "Medium";
    return "Low";
};

const normalizeValue = (value = "") => {
    return String(value).trim().toLowerCase();
};

const findMatchingValue = (value, allowedValues, fallback) => {
    const normalized = normalizeValue(value);

    const match = allowedValues.find(
        (item) => normalizeValue(item) === normalized
    );

    return match || fallback;
};

const validateAI = (result = {}) => {
    let riskScore = Number(result.riskScore);

    if (Number.isNaN(riskScore)) {
        riskScore = 50;
    }

    riskScore = Math.max(0, Math.min(100, riskScore));

    const category = findMatchingValue(
        result.category,
        CATEGORIES,
        "Other"
    );

    const department = findMatchingValue(
        result.department,
        DEPARTMENTS,
        "Public Works"
    );

    const priority = getPriorityFromRiskScore(riskScore);

    return {
        category,
        priority,
        department,
        riskScore,
        confidence: Number(result.confidence) || 70,
        explanation:
            result.explanation ||
            "AI analyzed the complaint and assigned priority based on risk level.",
        imageObservation:
            result.imageObservation ||
            "No detailed image observation available.",
    };
};

export default validateAI;