import {
    PRIORITY,
    CATEGORIES,
    DEPARTMENTS,
} from "../utils/constants.js";

const validateAI = (result) => {

    if (!CATEGORIES.includes(result.category))
        result.category = "Other";

    if (!PRIORITY.includes(result.priority))
        result.priority = "Medium";

    if (!DEPARTMENTS.includes(result.department))
        result.department = "Public Works";

    if (!result.explanation)
        result.explanation = "AI could not generate explanation.";

    return result;
};

export default validateAI;