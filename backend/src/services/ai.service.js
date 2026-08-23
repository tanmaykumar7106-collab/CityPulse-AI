import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const cleanJson = (text = "") => {
    const cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    const match = cleaned.match(/\{[\s\S]*\}/);

    if (!match) {
        throw new Error("AI did not return valid JSON");
    }

    return JSON.parse(match[0]);
};

const imageUrlToGeminiPart = async (imageUrl) => {
    const response = await fetch(imageUrl);

    if (!response.ok) {
        throw new Error("Unable to fetch uploaded image");
    }

    const mimeType = response.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    return {
        inlineData: {
            mimeType,
            data: base64Image,
        },
    };
};

export const analyzeComplaint = async ({ title, description, images = [] }) => {
    const prompt = `
You are an AI assistant for CityPulse AI, a smart civic complaint management system.

Your task is to analyze the citizen complaint using BOTH:
1. Complaint text
2. Uploaded image evidence, if available

Important rule:
Do NOT blindly trust the citizen's selected priority.
You must decide the priority yourself based on actual risk, urgency, public safety impact, and image evidence.

Complaint Title:
${title}

Complaint Description:
${description}

Choose ONE category only:
Roads
Water Supply
Street Lights
Garbage
Traffic
Parks
Drainage
Other

Choose ONE priority only:
Low
Medium
High
Critical

Priority rules:
Low = minor inconvenience, no safety risk
Medium = visible issue, needs attention, but no immediate danger
High = can cause injury, traffic disruption, leakage, exposed damage, unsafe public condition
Critical = immediate danger to life, open manhole, live wire, severe flooding, road collapse, major accident risk, emergency condition

If the complaint text says "critical" but the image or description shows a minor issue, reduce the priority.
If the image shows serious public danger, increase the priority even if the text is simple.

Choose ONE department only:
Public Works
Water Department
Electrical Department
Sanitation Department
Traffic Department
Parks Department

Return ONLY valid JSON in this format:

{
  "category": "",
  "priority": "",
  "department": "",
  "confidence": 0,
  "explanation": ""
}
`;

    const imageParts = await Promise.all(
        images.slice(0, 2).map((image) => imageUrlToGeminiPart(image.url))
    );

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            {
                role: "user",
                parts: [
                    { text: prompt },
                    ...imageParts,
                ],
            },
        ],
    });

    return cleanJson(response.text);
};