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

const imageFileToGeminiPart = (file) => {
    return {
        inlineData: {
            mimeType: file.mimetype,
            data: file.buffer.toString("base64"),
        },
    };
};

export const analyzeComplaint = async ({ title, description, files = [] }) => {
    const prompt = `
You are an AI civic infrastructure risk analyst for CityPulse AI.

Your job is to analyze a citizen complaint using:
1. Complaint title
2. Complaint description
3. Uploaded image evidence, if available

IMPORTANT:
Do not put everything in Medium.
You must carefully estimate the actual public safety risk.

Complaint Title:
${title}

Complaint Description:
${description}

Analyze the image evidence carefully if provided.

You must return a riskScore between 0 and 100.

Risk score rules:

0 to 25 = Low
- Minor inconvenience
- No public safety risk
- Cosmetic damage
- Small garbage pile
- Minor park maintenance
- Small road crack not affecting movement

26 to 50 = Medium
- Visible civic issue
- Needs attention
- Low immediate danger
- Small water leakage
- Broken but non-dangerous public asset
- Moderate garbage accumulation
- Minor drainage blockage

51 to 75 = High
- Unsafe public condition
- Can cause injury
- Traffic disruption
- Large pothole
- Overflowing drainage
- Broken streetlight in dark public area
- Exposed damaged road
- Water leakage affecting road/pedestrians

76 to 100 = Critical
- Immediate danger to life or serious injury
- Open manhole
- Live electric wire
- Severe flooding
- Road collapse
- Fire hazard
- Accident already happening or very likely
- Large obstruction on busy road
- Deep pothole in high traffic area
- Sewage overflow creating serious health hazard

Category options:
Roads
Water Supply
Street Lights
Garbage
Traffic
Parks
Drainage
Other

Department options:
Public Works
Water Department
Electrical Department
Sanitation Department
Traffic Department
Parks Department

Return ONLY valid JSON.

{
  "category": "",
  "riskScore": 0,
  "priority": "",
  "department": "",
  "confidence": 0,
  "explanation": "",
  "imageObservation": ""
}

Priority must match riskScore:
0-25 Low
26-50 Medium
51-75 High
76-100 Critical

If text says critical but image shows minor issue, reduce riskScore.
If image shows dangerous condition, increase riskScore.
`;

    const imageParts = files.slice(0, 2).map(imageFileToGeminiPart);

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            {
                role: "user",
                parts: [{ text: prompt }, ...imageParts],
            },
        ],
    });

    const text = response.text || "";
    return cleanJson(text);
};