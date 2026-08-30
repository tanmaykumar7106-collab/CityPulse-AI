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

export const analyzeComplaint = async ({
    title,
    description,
    files = [],
    yoloResult = null,
}) => {
    const prompt = `
You are CityPulse AI, a civic infrastructure risk analysis system.

Your job is to analyze a citizen complaint using:
1. Complaint title
2. Complaint description
3. Uploaded image evidence
4. YOLO object detection result

You must decide:
- civic issue category
- public risk score
- priority
- responsible department
- confidence
- explanation
- image observation

Complaint Title:
${title}

Complaint Description:
${description}

YOLO Image Detection Result:
${JSON.stringify(yoloResult, null, 2)}

Important rules:

1. Do not blindly trust the citizen's text.
If the citizen writes "critical" but the image/YOLO result shows a minor issue, reduce the risk.

2. Do not blindly trust YOLO either.
YOLO is visual evidence only. Use it with complaint text and image understanding.

3. If YOLO detects open_manhole with confidence >= 0.50:
Treat it as a serious safety issue.
Usually priority should be Critical unless the image/text clearly shows it is not dangerous.

4. If YOLO detects pothole with confidence >= 0.50:
Usually priority should be High.
Make it Critical only if text/image suggests busy road, night danger, deep pothole, accident risk, school zone, market area, rain, or two-wheeler risk.

5. If YOLO detects road_damage with confidence >= 0.50:
Usually priority should be Medium or High depending on traffic danger.
Do not make it Critical unless severe collapse or immediate accident risk is present.

6. If YOLO detects garbage with confidence >= 0.50:
Usually priority should be Medium.
Make it High if it is near school, hospital, residential area, public market, drainage, or creates health risk.

7. If complaint text and YOLO result conflict:
Mention the conflict in explanation and choose the safer realistic category.

Risk score rules:

0 to 25 = Low
- Minor inconvenience
- No public safety risk
- Cosmetic damage
- Small garbage pile
- Small crack or minor road surface issue

26 to 50 = Medium
- Visible civic issue
- Needs attention
- Low immediate danger
- Small pothole
- Moderate garbage accumulation
- Minor road damage
- Small drainage or hygiene issue

51 to 75 = High
- Unsafe public condition
- Can cause injury
- Traffic disruption
- Large pothole
- Damaged road affecting movement
- Garbage near school/residential/market area
- Broken or hazardous infrastructure
- Water or drainage issue affecting road users

76 to 100 = Critical
- Immediate danger to life or serious injury
- Open manhole
- Deep pothole on busy road
- Road collapse
- Live electric wire
- Severe flooding
- Serious sewage overflow
- Accident already likely or reported

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

Priority must strictly match riskScore:
0-25 = Low
26-50 = Medium
51-75 = High
76-100 = Critical

Return ONLY valid JSON in this exact format:

{
  "category": "",
  "riskScore": 0,
  "priority": "",
  "department": "",
  "confidence": 0,
  "explanation": "",
  "imageObservation": ""
}
`;

    const imageParts = files.slice(0, 3).map(imageFileToGeminiPart);

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
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