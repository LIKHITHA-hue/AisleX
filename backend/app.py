from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from PIL import Image
import time
import os

app = Flask(__name__)
CORS(app)

# Load YOLO model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "best.pt")
model = YOLO(MODEL_PATH)

print("YOLO model loaded successfully!")
print("Classes:", model.names)


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "running",
        "message": "AisleX YOLO backend is running"
    })


@app.route("/api/vision/analyze", methods=["POST"])
def analyze_image():

    if "image" not in request.files:
        return jsonify({
            "error": "No image uploaded"
        }), 400

    image_file = request.files["image"]

    try:
        # Open uploaded image
        image = Image.open(image_file).convert("RGB")

        image_width, image_height = image.size

        # Start timer
        start_time = time.time()

        # Run YOLO
        results = model.predict(
            source=image,
            conf=0.25,
            verbose=False
        )

        processing_time = int((time.time() - start_time) * 1000)

        detections = []

        result = results[0]

        if result.boxes is not None:

            for i, box in enumerate(result.boxes):

                # Bounding box in pixel coordinates
                x1, y1, x2, y2 = box.xyxy[0].tolist()

                # Convert to normalized x, y, width, height
                x = x1 / image_width
                y = y1 / image_height
                width = (x2 - x1) / image_width
                height = (y2 - y1) / image_height

                confidence = float(box.conf[0])

                class_id = int(box.cls[0])

                # Get class name from YOLO
                class_name = model.names[class_id]

                detections.append({
                    "id": f"d{i + 1}",
                    "productId": str(class_name),
                    "box": [
                        round(x, 4),
                        round(y, 4),
                        round(width, 4),
                        round(height, 4)
                    ],
                    "confidence": round(confidence, 4)
                })

        return jsonify({
            "imageWidth": image_width,
            "imageHeight": image_height,
            "processingTimeMs": processing_time,
            "modelVersion": "AisleX-YOLO",
            "detections": detections
        })

    except Exception as e:

        print("ERROR:", str(e))

        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )