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
        lowerText.includes("open manhole") ||
        lowerText.includes("manhole") ||
        lowerText.includes("sewage") ||
        lowerText.includes("drain") ||
        lowerText.includes("drainage") ||
        lowerText.includes("water logging") ||
        lowerText.includes("waterlogging") ||
        lowerText.includes("flooding")
    ) {
        return "Drainage";
    }

    if (
        lowerText.includes("pothole") ||
        lowerText.includes("road") ||
        lowerText.includes("crack") ||
        lowerText.includes("road damage") ||
        lowerText.includes("road collapse")
    ) {
        return "Roads";
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

const hasAnyKeyword = (text = "", keywords = []) => {
    const lowerText = text.toLowerCase();
    return keywords.some((keyword) => lowerText.includes(keyword));
};

const getRiskScoreFromTextRules = (text = "") => {
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
        "market area",
        "school",
        "hospital",
        "two-wheeler",
        "two wheeler",
        "night",
        "rain",
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
        "small pothole",
        "minor road damage",
    ];

    if (hasAnyKeyword(text, criticalKeywords)) {
        return 88;
    }

    if (hasAnyKeyword(text, highKeywords)) {
        return 68;
    }

    if (hasAnyKeyword(text, mediumKeywords)) {
        return 42;
    }

    return null;
};

const getTopYoloDetection = (yoloResult = {}) => {
    if (yoloResult?.topDetection) {
        return yoloResult.topDetection;
    }

    if (Array.isArray(yoloResult?.detections) && yoloResult.detections.length > 0) {
        return yoloResult.detections[0];
    }

    return null;
};

const getYoloSuggestion = (yoloResult = {}, text = "") => {
    const topDetection = getTopYoloDetection(yoloResult);

    if (!topDetection) {
        return {
            category: "",
            department: "",
            minRiskScore: null,
            reason: "No confident YOLO civic issue detection found.",
        };
    }

    const className = normalizeValue(topDetection.className);
    const confidence = Number(topDetection.confidence) || 0;

    if (confidence < 0.35) {
        return {
            category: "",
            department: "",
            minRiskScore: null,
            reason: "YOLO confidence is too low to influence final priority.",
        };
    }

    const dangerContext = hasAnyKeyword(text, [
        "busy road",
        "main road",
        "market",
        "school",
        "hospital",
        "night",
        "rain",
        "accident",
        "two-wheeler",
        "two wheeler",
        "deep",
        "large",
        "big",
        "middle of road",
        "traffic",
    ]);

    if (className === "open_manhole") {
        return {
            category: "Drainage",
            department: "Water Department",
            minRiskScore: confidence >= 0.5 ? 86 : 76,
            reason: "YOLO detected open manhole, which is a serious public safety risk.",
        };
    }

    if (className === "pothole") {
        return {
            category: "Roads",
            department: "Public Works",
            minRiskScore: dangerContext ? 78 : 62,
            reason: "YOLO detected pothole and risk was adjusted based on road safety context.",
        };
    }

    if (className === "road_damage") {
        return {
            category: "Roads",
            department: "Public Works",
            minRiskScore: dangerContext ? 64 : 46,
            reason: "YOLO detected road damage and priority was adjusted based on severity context.",
        };
    }

    if (className === "garbage") {
        const healthContext = hasAnyKeyword(text, [
            "school",
            "hospital",
            "residential",
            "market",
            "bad smell",
            "health",
            "hygiene",
            "children",
            "drain",
            "many days",
        ]);

        return {
            category: "Garbage",
            department: "Sanitation Department",
            minRiskScore: healthContext ? 58 : 38,
            reason: "YOLO detected garbage and risk was adjusted based on hygiene context.",
        };
    }

    return {
        category: "",
        department: "",
        minRiskScore: null,
        reason: "YOLO detected an unknown class.",
    };
};

const validateAI = (result = {}, context = {}) => {
    const yoloResult = context.yoloResult || {};

    const complaintText = `${context.title || ""} ${context.description || ""} ${result.explanation || ""
        } ${result.imageObservation || ""} ${yoloResult.summary || ""}`;

    let aiRiskScore = Number(result.riskScore);

    if (Number.isNaN(aiRiskScore)) {
        aiRiskScore = 50;
    }

    aiRiskScore = Math.max(0, Math.min(100, aiRiskScore));

    const textRuleRiskScore = getRiskScoreFromTextRules(complaintText);
    const yoloSuggestion = getYoloSuggestion(yoloResult, complaintText);

    let finalRiskScore = aiRiskScore;

    if (textRuleRiskScore !== null) {
        finalRiskScore = Math.max(finalRiskScore, textRuleRiskScore);
    }

    if (yoloSuggestion.minRiskScore !== null) {
        finalRiskScore = Math.max(finalRiskScore, yoloSuggestion.minRiskScore);
    }

    finalRiskScore = Math.max(0, Math.min(100, finalRiskScore));

    let category = findMatchingValue(result.category, CATEGORIES, "");

    if (yoloSuggestion.category) {
        category = yoloSuggestion.category;
    }

    if (!category) {
        category = detectCategoryFromText(complaintText);
    }

    let department = findMatchingValue(result.department, DEPARTMENTS, "");

    if (yoloSuggestion.department) {
        department = yoloSuggestion.department;
    }

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
            `AI analyzed the complaint using text, image evidence, and YOLO detection. ${yoloSuggestion.reason}`,
        imageObservation:
            result.imageObservation ||
            yoloResult.summary ||
            "Image evidence was submitted and used for complaint verification.",
    };
};

export default validateAI;