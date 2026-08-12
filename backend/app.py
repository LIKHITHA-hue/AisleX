from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from PIL import Image
import easyocr
import numpy as np
import time
import os

app = Flask(__name__)
CORS(app)

# Load YOLO model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "best.pt")
model = YOLO(MODEL_PATH)

# Load EasyOCR
reader = easyocr.Reader(["en"], gpu=False)

print("YOLO model loaded successfully!")
print("Classes:", model.names)
print("EasyOCR loaded successfully!")


# OCR corrections based on the working Colab results
OCR_CORRECTIONS = {
    "SaNTOOR": "Santoor",
    "NEScAFE Clssic": "Nescafé Classic",
    "Surf excel": "Surf Excel",
    "ARIel Matic]": "Ariel Matic",
    "Zin] Wheel": "Wheel",
    "Zizol": "Lizol",
    "Bizol": "Lizol",
    "Tde": "Tide",
    "Riq": "Rin",
    "kiskan)": "Kissan",
    "Milk: Dairy": "Dairy Milk",
    "(Pril)": "Pril",
    "(Shoulders": "Head & Shoulders",
    "Maggi Noo": "Maggi",
    "pacu Parle-G": "Parle-G",
    "Kurkure Chilli CHATKA": "Kurkure Chilli Chatka",
}


def clean_ocr_text(text):
    text = text.strip()

    if not text:
        return ""

    return OCR_CORRECTIONS.get(text, text)


def get_product_name(crop):
    """
    Run EasyOCR on one detected product crop.
    Returns the most useful detected text.
    """

    # Convert PIL image to numpy array
    crop_array = np.array(crop)

    ocr_results = reader.readtext(crop_array)

    texts = []

    for detection in ocr_results:
        text = detection[1]
        confidence = detection[2]

        if confidence >= 0.30:
            texts.append(text)

    if not texts:
        return "Unknown Product"

    # Combine text detected on the package
    product_text = " ".join(texts)

    return clean_ocr_text(product_text)


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "running",
        "message": "AisleX YOLO + OCR backend is running"
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

        result = results[0]

        detections = []

        if result.boxes is not None:

            for i, box in enumerate(result.boxes):

                # Bounding box coordinates
                x1, y1, x2, y2 = box.xyxy[0].tolist()

                # Keep coordinates inside image
                x1 = max(0, int(x1))
                y1 = max(0, int(y1))
                x2 = min(image_width, int(x2))
                y2 = min(image_height, int(y2))

                # Crop detected product
                crop = image.crop((x1, y1, x2, y2))

                # Run OCR
                product_name = get_product_name(crop)

                # Normalized bounding box
                x = x1 / image_width
                y = y1 / image_height
                width = (x2 - x1) / image_width
                height = (y2 - y1) / image_height

                confidence = float(box.conf[0])

                class_id = int(box.cls[0])
                class_name = model.names[class_id]

                detections.append({
                    "id": f"d{i + 1}",

                    # OCR product name
                    "productId": product_name,

                    # YOLO class
                    "className": str(class_name),

                    "box": [
                        round(x, 4),
                        round(y, 4),
                        round(width, 4),
                        round(height, 4)
                    ],

                    "confidence": round(confidence, 4),

                    # OCR text
                    "ocrText": product_name
                })

        processing_time = int((time.time() - start_time) * 1000)

        return jsonify({
            "imageWidth": image_width,
            "imageHeight": image_height,
            "processingTimeMs": processing_time,
            "modelVersion": "AisleX-YOLO11-OCR",
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