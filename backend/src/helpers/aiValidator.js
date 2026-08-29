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

const getRiskScoreFromRules = (text = "") => {
    const lowerText = text.toLowerCase();

    const criticalKeywords = [
        "open manhole",
        "manhole open",
        "uncovered manhole",
        "live wire",
        "electric wire",
        "current wire",
        "road collapse",
        "bridge collapse",
        "severe flooding",
        "heavy flooding",
        "deep water",
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
            "No detailed image observation available.",
    };
};

export default validateAI;