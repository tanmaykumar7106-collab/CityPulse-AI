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

const detectCategoryFromText = (text = "") => {
    const lowerText = text.toLowerCase();

    if (
        lowerText.includes("pothole") ||
        lowerText.includes("road") ||
        lowerText.includes("manhole") ||
        lowerText.includes("road damage") ||
        lowerText.includes("road collapse")
    ) {
        return "Roads";
    }

    if (
        lowerText.includes("drain") ||
        lowerText.includes("drainage") ||
        lowerText.includes("sewage") ||
        lowerText.includes("water logging") ||
        lowerText.includes("flooding")
    ) {
        return "Drainage";
    }

    if (
        lowerText.includes("garbage") ||
        lowerText.includes("waste") ||
        lowerText.includes("dustbin") ||
        lowerText.includes("trash")
    ) {
        return "Garbage";
    }

    if (
        lowerText.includes("streetlight") ||
        lowerText.includes("street light") ||
        lowerText.includes("electric") ||
        lowerText.includes("wire") ||
        lowerText.includes("light not working")
    ) {
        return "Street Lights";
    }

    if (
        lowerText.includes("water leakage") ||
        lowerText.includes("pipe") ||
        lowerText.includes("water supply")
    ) {
        return "Water Supply";
    }

    if (
        lowerText.includes("traffic") ||
        lowerText.includes("vehicle") ||
        lowerText.includes("jam")
    ) {
        return "Traffic";
    }

    if (
        lowerText.includes("park") ||
        lowerText.includes("playground") ||
        lowerText.includes("garden")
    ) {
        return "Parks";
    }

    return "Other";
};

const getDepartmentFromCategory = (category) => {
    switch (category) {
        case "Roads":
            return "Public Works";
        case "Drainage":
            return "Water Department";
        case "Garbage":
            return "Sanitation Department";
        case "Street Lights":
            return "Electrical Department";
        case "Water Supply":
            return "Water Department";
        case "Traffic":
            return "Traffic Department";
        case "Parks":
            return "Parks Department";
        default:
            return "Public Works";
    }
};

const getRiskScoreFromRules = (text = "") => {
    const lowerText = text.toLowerCase();

    const criticalKeywords = [
        "open manhole",
        "manhole open",
        "uncovered manhole",
        "live wire",
        "electric wire",
        "road collapse",
        "severe flooding",
        "heavy flooding",
        "fire",
        "accident happened",
        "life danger",
        "death risk",
        "sewage overflow",
        "deep pothole",
        "hole in middle of road",
    ];

    const highKeywords = [
        "large pothole",
        "big pothole",
        "busy road",
        "main road",
        "traffic jam",
        "injury risk",
        "can cause accident",
        "dangerous",
        "overflowing drain",
        "broken streetlight",
        "dark street",
        "water leakage on road",
        "road damaged",
        "blocked drainage",
    ];

    const mediumKeywords = [
        "garbage",
        "small leakage",
        "minor leakage",
        "broken dustbin",
        "dirty area",
        "streetlight not working",
        "drainage issue",
    ];

    if (criticalKeywords.some((keyword) => lowerText.includes(keyword))) {
        return 88;
    }

    if (highKeywords.some((keyword) => lowerText.includes(keyword))) {
        return 68;
    }

    if (mediumKeywords.some((keyword) => lowerText.includes(keyword))) {
        return 42;
    }

    return null;
};

const validateAI = (result = {}, context = {}) => {
    const complaintText = `${context.title || ""} ${context.description || ""} ${result.explanation || ""
        } ${result.imageObservation || ""}`;

    let aiRiskScore = Number(result.riskScore);

    if (Number.isNaN(aiRiskScore)) {
        aiRiskScore = 50;
    }

    aiRiskScore = Math.max(0, Math.min(100, aiRiskScore));

    const ruleRiskScore = getRiskScoreFromRules(complaintText);

    let finalRiskScore = aiRiskScore;

    if (ruleRiskScore !== null) {
        finalRiskScore = Math.max(aiRiskScore, ruleRiskScore);
    }

    let category = findMatchingValue(
        result.category,
        CATEGORIES,
        ""
    );

    if (!category) {
        category = detectCategoryFromText(complaintText);
    }

    let department = findMatchingValue(
        result.department,
        DEPARTMENTS,
        ""
    );

    if (!department) {
        department = getDepartmentFromCategory(category);
    }

    const priority = getPriorityFromRiskScore(finalRiskScore);

    return {
        category,
        priority,
        department,
        riskScore: finalRiskScore,
        confidence: Number(result.confidence) || 75,
        explanation:
            result.explanation ||
            "AI analyzed the complaint and assigned priority based on risk level.",
        imageObservation:
            result.imageObservation ||
            "Image evidence was submitted and used for complaint verification.",
    };
};

export default validateAI;