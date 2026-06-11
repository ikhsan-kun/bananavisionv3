import tensorflow as tf
import numpy as np
import os

model_path = "/home/project/bananavisionv3/models/model_resnet50_final.keras"
if not os.path.exists(model_path):
    model_path = os.path.join(os.path.dirname(__file__), "../models/model_resnet50_final.keras")

if not os.path.exists(model_path):
    print(" Model file not found")
    exit(1)

print("Loading model...")
model = tf.keras.models.load_model(model_path, compile=False)

# Simulated Green Leaf Image (RGB)
img_green = np.ones((224, 224, 3), dtype=np.float32)
img_green[:, :, 0] = 50.0   # Red
img_green[:, :, 1] = 180.0  # Green
img_green[:, :, 2] = 50.0   # Blue

# Simulated Yellow/Brown Leaf Image (RGB)
img_yellow = np.ones((224, 224, 3), dtype=np.float32)
img_yellow[:, :, 0] = 210.0  # Red
img_yellow[:, :, 1] = 160.0  # Green
img_yellow[:, :, 2] = 40.0   # Blue

schemes = {
    "1. Raw Pixels [0, 255]": lambda x: np.expand_dims(x, axis=0),
    "2. Scaled [0, 1]": lambda x: np.expand_dims(x / 255.0, axis=0),
    "3. Scaled [-1, 1]": lambda x: np.expand_dims((x / 127.5) - 1.0, axis=0),
    "4. ResNet50 Standard preprocess_input (BGR mean subtraction)": lambda x: tf.keras.applications.resnet50.preprocess_input(np.expand_dims(x.copy(), axis=0))
}

for img_name, current_img in [("Green Leaf Image", img_green), ("Yellow Leaf Image", img_yellow)]:
    print(f"\n================ Test with {img_name} ================")
    for name, preprocess_fn in schemes.items():
        processed = preprocess_fn(current_img)
        preds = model.predict(processed, verbose=0)[0]
        max_idx = np.argmax(preds)
        formatted_preds = [round(float(v), 4) for v in preds]
        print(f"   Preprocessing: {name}")
        print(f"   Predictions: {formatted_preds}")
        print(f"   Max Class: {max_idx} (Conf: {preds[max_idx]*100:.2f}%)")
