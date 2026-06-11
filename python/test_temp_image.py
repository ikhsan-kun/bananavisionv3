import tensorflow as tf
import numpy as np
import os
from PIL import Image

model_path = "/home/project/bananavisionv3/models/model_resnet50_final.keras"
if not os.path.exists(model_path):
    model_path = os.path.join(os.path.dirname(__file__), "../models/model_resnet50_final.keras")

image_path = "/home/project/bananavisionv3/models/temp_debug.jpg"
if not os.path.exists(image_path):
    image_path = os.path.join(os.path.dirname(__file__), "../models/temp_debug.jpg")

if not os.path.exists(model_path):
    print("❌ Model file not found")
    exit(1)

if not os.path.exists(image_path):
    print("❌ temp_debug.jpg not found. Please upload/analyze a leaf photo first to generate it.")
    exit(1)

print("Loading model...")
model = tf.keras.models.load_model(model_path, compile=False)

print(f"Loading image: {image_path}")
img = Image.open(image_path).convert('RGB')
img = img.resize((224, 224))
img_array = np.array(img, dtype=np.float32)

DISEASE_MAP = {
    0: 'Black Sigatoka',
    1: 'Bract Mosaic Virus',
    2: 'Healthy Leaf',
    3: 'Insect Pest',
    4: 'Moko Disease',
    5: 'Panama Disease',
    6: 'Yellow Sigatoka',
}

schemes = {
    "1. Raw Pixels [0, 255]": lambda x: np.expand_dims(x, axis=0),
    "2. Scaled [0, 1]": lambda x: np.expand_dims(x / 255.0, axis=0),
    "3. Scaled [-1, 1]": lambda x: np.expand_dims((x / 127.5) - 1.0, axis=0),
    "4. ResNet50 Standard preprocess_input (BGR mean subtraction)": lambda x: tf.keras.applications.resnet50.preprocess_input(np.expand_dims(x.copy(), axis=0))
}

print(f"\n================ Test with Real Uploaded Image ================")
for name, preprocess_fn in schemes.items():
    processed = preprocess_fn(img_array)
    preds = model.predict(processed, verbose=0)[0]
    max_idx = np.argmax(preds)
    formatted_preds = [round(float(v), 4) for v in preds]
    print(f"\n👉 Preprocessing: {name}")
    print(f"   Predictions: {formatted_preds}")
    print(f"   Max Class: {max_idx} ({DISEASE_MAP.get(max_idx, 'Unknown')}) - Conf: {preds[max_idx]*100:.2f}%")
