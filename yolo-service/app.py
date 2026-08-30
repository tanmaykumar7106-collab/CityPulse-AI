from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from typing import List
import tempfile
import os

app = FastAPI(title="CityPulse YOLO Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "models/best.pt"
model = YOLO(MODEL_PATH)

CLASS_NAMES = {
    0: "pothole",
    1: "road_damage",
    2: "open_manhole",
    3: "garbage",
}


@app.get("/")
def health_check():
    return {
        "success": True,
        "message": "CityPulse YOLO service is running"
    }


@app.post("/detect")
async def detect_issues(images: List[UploadFile] = File(...)):
    all_detections = []

    for image in images:
        suffix = os.path.splitext(image.filename)[1] or ".jpg"

        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            temp_file.write(await image.read())
            temp_path = temp_file.name

        try:
            results = model.predict(
                source=temp_path,
                conf=0.35,
                imgsz=640,
                verbose=False
            )

            for result in results:
                if result.boxes is None:
                    continue

                for box in result.boxes:
                    class_id = int(box.cls[0])
                    confidence = float(box.conf[0])

                    xyxy = box.xyxy[0].tolist()

                    all_detections.append({
                        "fileName": image.filename,
                        "classId": class_id,
                        "className": CLASS_NAMES.get(class_id, "unknown"),
                        "confidence": round(confidence, 3),
                        "box": {
                            "x1": round(xyxy[0], 2),
                            "y1": round(xyxy[1], 2),
                            "x2": round(xyxy[2], 2),
                            "y2": round(xyxy[3], 2),
                        }
                    })

        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)

    all_detections = sorted(
        all_detections,
        key=lambda item: item["confidence"],
        reverse=True
    )

    top_detection = all_detections[0] if all_detections else None

    return {
        "success": True,
        "totalDetections": len(all_detections),
        "topDetection": top_detection,
        "detections": all_detections[:10]
    }