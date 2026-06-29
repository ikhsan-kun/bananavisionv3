import os
from dotenv import load_dotenv

# Muat variabel environment dari file .env
load_dotenv()

import numpy as np
import tensorflow as tf
from PIL import Image
import io
import base64
from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="BananaVision API", description="AI-powered banana disease detection", version="1.0.0")


# Model configuration
MODEL_DIR = os.environ.get("MODEL_DIR", os.path.dirname(os.path.abspath(__file__)))
ACTIVE_MODEL_JSON = os.path.join(MODEL_DIR, "active_model.json")

# Node.js backend URL
NODE_BACKEND_URL = os.environ.get("NODE_BACKEND_URL", "http://localhost:5000/api").rstrip("/")

MODEL_CONFIG = {
    "mobilenetv2": {
        "path": os.path.join(MODEL_DIR, "model_mobilenetv2_final.keras"),
        "imagenet_loader": lambda: tf.keras.applications.MobileNetV2(
            weights="imagenet", include_top=True, input_shape=(224, 224, 3)
        ),
        "preprocess_input": tf.keras.applications.mobilenet_v2.preprocess_input,
        "decode_predictions": tf.keras.applications.mobilenet_v2.decode_predictions,
    },
    "resnet50": {
        "path": os.path.join(MODEL_DIR, "model_resnet50_final.keras"),
        "imagenet_loader": lambda: tf.keras.applications.ResNet50(
            weights="imagenet", include_top=True, input_shape=(224, 224, 3)
        ),
        "preprocess_input": tf.keras.applications.resnet50.preprocess_input,
        "decode_predictions": tf.keras.applications.resnet50.decode_predictions,
    },
}

# Determine default model type and path on startup
MODEL_TYPE = os.environ.get("MODEL_TYPE", "mobilenetv2").lower().strip()
ACTIVE_FILENAME = None
ACTIVE_URL = None

import json
if os.path.exists(ACTIVE_MODEL_JSON):
    try:
        with open(ACTIVE_MODEL_JSON, "r") as f:
            active_cfg = json.load(f)
            MODEL_TYPE = active_cfg.get("model_type", "mobilenetv2").lower().strip()
            ACTIVE_FILENAME = active_cfg.get("filename", None)
            ACTIVE_URL = active_cfg.get("url", None)
            print(f"📖 Loaded active model config from JSON: {ACTIVE_FILENAME} ({MODEL_TYPE})")
    except Exception as e:
        print(f"⚠️ Failed to read active_model.json: {e}. Using defaults/env.")

if MODEL_TYPE not in MODEL_CONFIG:
    MODEL_TYPE = "mobilenetv2"

_cfg = MODEL_CONFIG[MODEL_TYPE]

# Will be populated at startup
disease_model = None
imagenet_model = None


@app.on_event("startup")
async def load_model():
    global disease_model, imagenet_model, MODEL_TYPE, ACTIVE_FILENAME, ACTIVE_URL, _cfg

    # Gunakan filename aktif jika dimuat dari JSON config, jika tidak gunakan path default
    model_path = os.path.join(MODEL_DIR, ACTIVE_FILENAME) if ACTIVE_FILENAME else _cfg["path"]

    # Attempt 1: Auto-download if we already have the URL from active_model.json
    if ACTIVE_FILENAME and not os.path.exists(model_path) and ACTIVE_URL:
        import urllib.request
        print(f"\U0001f4e5 Downloading active model from saved URL: {ACTIVE_URL}...")
        try:
            os.makedirs(os.path.dirname(model_path), exist_ok=True)
            urllib.request.urlretrieve(ACTIVE_URL, model_path)
            print("\u2705 Startup download complete!")
        except Exception as e:
            print(f"\u26a0\ufe0f Failed to download from saved URL: {e}")
            model_path = _cfg["path"]

    # Attempt 2: Query Node.js backend for the active model info (handles Railway restart)
    if not os.path.exists(model_path):
        print(f"Querying Node.js backend for active model info: {NODE_BACKEND_URL}/admin/models/active-info")
        try:
            import urllib.request as urlreq
            with urlreq.urlopen(f"{NODE_BACKEND_URL}/admin/models/active-info", timeout=15) as resp:
                data = json.loads(resp.read())
                model_info = data.get("data")
                if model_info and model_info.get("filename") and model_info.get("url"):
                    node_filename = model_info["filename"]
                    node_url = model_info["url"]
                    node_type = model_info.get("modelType", "mobilenetv2").lower()
                    print(f"Auto-downloading active model from backend: {node_filename} @ {node_url}")
                    target_path = os.path.join(MODEL_DIR, node_filename)
                    urlreq.urlretrieve(node_url, target_path)
                    print("Auto-download complete")
                    # Update globals
                    ACTIVE_FILENAME = node_filename
                    ACTIVE_URL = node_url
                    if node_type in MODEL_CONFIG:
                        MODEL_TYPE = node_type
                    _cfg = MODEL_CONFIG.get(MODEL_TYPE, MODEL_CONFIG["mobilenetv2"])
                    model_path = target_path
                    # Save active_model.json for future restarts
                    with open(ACTIVE_MODEL_JSON, "w") as f:
                        json.dump({"model_type": MODEL_TYPE, "filename": ACTIVE_FILENAME, "url": ACTIVE_URL}, f)
                else:
                    print("Node.js backend reports no active model")
        except Exception as e:
            print(f"Could not fetch active model from Node backend: {e}")

    # If model file still doesn't exist, start in standby mode instead of crashing
    if not os.path.exists(model_path):
        print(
            "No model file found. "
            "Server berjalan dalam mode STANDBY - unggah dan aktifkan model melalui panel admin."
        )
        disease_model = None
        imagenet_model = None
        return

    print(f"Loading disease model ({MODEL_TYPE}): {os.path.basename(model_path)}")
    disease_model = tf.keras.models.load_model(model_path)
    print(f"Disease model loaded: {MODEL_TYPE}")

    try:
        print(f"Loading ImageNet gatekeeper ({MODEL_TYPE})...")
        imagenet_model = _cfg["imagenet_loader"]()
        print(f"ImageNet gatekeeper loaded: {MODEL_TYPE}")
    except Exception as e:
        print(f"ImageNet gatekeeper failed (non-fatal): {e}")
        imagenet_model = None

DISEASE_MAP = {
    0: {'name': 'Black Sigatoka', 'category': 'Jamur', 'severity': 'Berat'},
    1: {'name': 'Bract Mosaic Virus', 'category': 'Virus', 'severity': 'Sedang'},
    2: {'name': 'Healthy Leaf', 'category': 'Sehat', 'severity': 'Ringan'},
    3: {'name': 'Insect Pest', 'category': 'Hama', 'severity': 'Sedang'},
    4: {'name': 'Moko Disease', 'category': 'Bakteri', 'severity': 'Berat'},
    5: {'name': 'Panama Disease', 'category': 'Jamur', 'severity': 'Berat'},
    6: {'name': 'Yellow Sigatoka', 'category': 'Jamur', 'severity': 'Sedang'},
}

BANANA_SPECIFIC_KEYWORDS = {
    'banana', 'plantain', 'banana_tree', 'banana_leaf', 'banana_plant',
}

# Keywords that are CLEARLY not plant-related.
# If these dominate the top-5 predictions (>= BLOCK_THRESHOLD % combined),
# the image is immediately rejected before plant scoring.
BLOCKED_KEYWORDS = {
    # People / body parts
    'person', 'people', 'man', 'woman', 'boy', 'girl', 'face', 'head',
    'hair', 'hand', 'arm', 'leg', 'foot', 'body', 'human', 'portrait',
    'selfie', 'suit', 'uniform', 'jersey', 'dress', 'bikini', 'swimsuit',
    # Animals (non-plant)
    'dog', 'cat', 'bird', 'fish', 'horse', 'cow', 'pig', 'sheep', 'goat',
    'chicken', 'duck', 'rabbit', 'bear', 'lion', 'tiger', 'elephant',
    'monkey', 'snake', 'lizard', 'turtle', 'frog', 'insect', 'bee',
    'butterfly', 'spider', 'crab', 'lobster', 'shrimp',
    # Vehicles / transport
    'car', 'truck', 'bus', 'motorcycle', 'bicycle', 'airplane', 'boat',
    'ship', 'train', 'vehicle', 'ambulance', 'taxi',
    # Buildings / structures
    'building', 'house', 'church', 'mosque', 'castle', 'tower', 'bridge',
    'street', 'road', 'wall', 'roof', 'window', 'door',
    # Electronics / objects
    'phone', 'computer', 'laptop', 'camera', 'keyboard', 'screen',
    'remote', 'clock', 'lamp', 'bottle', 'cup', 'glass', 'plate',
    'chair', 'table', 'sofa', 'bed',
    # Processed food (non-plant confusion)
    'pizza', 'burger', 'sandwich', 'cake', 'bread', 'sushi', 'noodle',
    'soup', 'fried', 'grilled', 'baked',
    'sky', 'cloud', 'ocean', 'sea', 'beach', 'sand', 'snow', 'ice',
    'mountain', 'rock', 'stone',
}

# If blocked keywords score exceeds this %, image is immediately rejected.
BLOCK_THRESHOLD = 15.0

PLANT_KEYWORDS = {
    # General leaf/plant terms
    'leaf', 'leaves', 'plant', 'foliage', 'frond',
    # Tropical vegetation (close to banana habitat)
    'palm', 'tropical', 'jungle', 'rainforest', 'vegetation', 'mangrove',
    # Tree parts that appear in close-up leaf/stem shots
    'twig', 'stem', 'stalk', 'bough', 'bark', 'trunk', 'bole',
    # Fungi/nature misclassifications of heavily diseased/yellowed leaves
    'mushroom', 'fungus', 'gyromitra', 'agaric', 'bolete',
    'coral_fungus', 'hen_of_the_woods',
    # Large-leaved tropical plant misclassifications
    'pot_plant', 'house_plant',
    'pineapple', 'jackfruit', 'custard_apple',
    'rapeseed', 'corn', 'ear',
}

PLANT_GATE_THRESHOLD = 3.0


ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}


class PredictionRequest(BaseModel):
    image: str  # base64 encoded image

class PredictionResult(BaseModel):
    disease: str
    confidence: float

class PredictionResponse(BaseModel):
    success: bool
    data: Optional[dict] = None
    message: Optional[str] = None


# Image processing helpers
def open_image(image_data):
    """Open image from base64 string or PIL Image, return PIL Image in RGB."""
    if isinstance(image_data, str):
        try:
            img_bytes = base64.b64decode(image_data)
        except Exception:
            raise HTTPException(status_code=400, detail="Format base64 tidak valid")
        try:
            img = Image.open(io.BytesIO(img_bytes))
        except Exception:
            raise HTTPException(status_code=400, detail="Data gambar tidak dapat dibaca")
    else:
        img = image_data
    return img.convert('RGB')


def preprocess_for_disease(img, target_size=(224, 224)):
    """Preprocess for the custom disease classifier depending on MODEL_TYPE."""
    img = img.resize(target_size)
    img_array = np.array(img, dtype=np.float32)
    img_array = np.expand_dims(img_array, axis=0)

    if MODEL_TYPE == "resnet50":
        # Standard ResNet50 preprocessing (BGR mean subtraction)
        img_array = tf.keras.applications.resnet50.preprocess_input(img_array)
    else:
        # Default MobileNetV2 preprocessing (scaled to 0-1)
        img_array = img_array / 255.0

    return img_array


def preprocess_for_imagenet(img, target_size=(224, 224)):
    img = img.resize(target_size)
    img_array = np.array(img, dtype=np.float32)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = _cfg["preprocess_input"](img_array)
    return img_array


# Gatekeeper: validate image is banana/plant-related via ImageNet
def check_is_banana_plant(img) -> dict:

    img_array = preprocess_for_imagenet(img)
    preds = imagenet_model.predict(img_array, verbose=0)
    decoded = _cfg["decode_predictions"](preds, top=10)[0]

    plant_score = 0.0
    matched_labels = []
    has_banana_keyword = False

    for (_id, label, score) in decoded:
        label_lower = label.lower().replace('-', '_').replace(' ', '_')

        # Check banana-specific keywords first (high-confidence boost)
        is_banana_match = any(kw in label_lower for kw in BANANA_SPECIFIC_KEYWORDS)
        if is_banana_match:
            weighted = score * 100 * 5  # 5x weight for banana-specific
            plant_score += weighted
            matched_labels.append(f"{label} [BANANA] ({score*100:.1f}% → weighted {weighted:.1f}%)") 
            has_banana_keyword = True
            continue

        # Check general plant keywords
        is_plant_match = any(kw in label_lower for kw in PLANT_KEYWORDS)
        if is_plant_match:
            plant_score += score * 100
            matched_labels.append(f"{label} ({score*100:.1f}%)")

    is_plant = plant_score >= PLANT_GATE_THRESHOLD
    print(f"[Gatekeeper] has_banana_keyword: {has_banana_keyword}, weighted_plant_score: {plant_score:.2f}%, threshold: {PLANT_GATE_THRESHOLD}%")

    return {
        'is_plant': is_plant,
        'plant_score': round(plant_score, 2),
        'has_banana_keyword': has_banana_keyword,
        'matched_labels': matched_labels,
        'top_predictions': [
            f"{label} ({score*100:.1f}%)"
            for (_id, label, score) in decoded[:5]
        ],
    }


# Main prediction pipeline

# Jika gatekeeper menolak tapi disease model yakin di atas threshold ini,
# percayai disease model. Dinaikkan ke 45.0 agar lebih sulit untuk gambar
# non-pisang melewati override (baseline 7 kelas = ~14%, threshold tinggi
# memastikan hanya gambar yang benar-benar pisang yang lolos override).
DISEASE_OVERRIDE_THRESHOLD = 45.0  # %


def run_prediction(image_data) -> dict:
    if disease_model is None or imagenet_model is None:
        raise HTTPException(
            status_code=503,
            detail="Server AI berjalan dalam mode STANDBY. Tidak ada model aktif. Silakan unggah dan aktifkan model melalui panel admin."
        )
    img = open_image(image_data)

    import hashlib
    img_bytes_for_hash = img.tobytes()
    img_hash = hashlib.md5(img_bytes_for_hash).hexdigest()
    print(f"\n[Prediction Request] Image size: {img.size}, Format: {img.format}, RGB Hash: {img_hash}")

    # Pass 1: Gatekeeper
    gate_result = check_is_banana_plant(img)
    print(f"[Gatekeeper] plant_score: {gate_result['plant_score']}%, is_plant: {gate_result['is_plant']}")
    print(f"[Gatekeeper] Top predictions: {gate_result['top_predictions']}")

    # Pass 2: Disease model
    image_array = preprocess_for_disease(img)
    print(f"[Preprocess Info] MODEL_TYPE: {MODEL_TYPE}, Pixel Min: {image_array.min():.2f}, Pixel Max: {image_array.max():.2f}")
    predictions = disease_model.predict(image_array, verbose=0)
    confidence_scores = predictions[0]
    predicted_class = int(np.argmax(confidence_scores))
    confidence = float(confidence_scores[predicted_class]) * 100

    print(f"[Model Predictions] Raw confidence array: {[round(float(x), 4) for x in confidence_scores]}")
    print(f"[Predicted Class]: {predicted_class} ({DISEASE_MAP.get(predicted_class, {}).get('name', 'Unknown')}) - confidence: {confidence:.2f}%")

    # Decision logic
    # Tolak hanya jika gatekeeper menolak DAN disease model ragu-ragu.
    if not gate_result['is_plant'] and confidence < DISEASE_OVERRIDE_THRESHOLD:
        print(
            f"[Gatekeeper] REJECTED — plant_score={gate_result['plant_score']:.1f}%, "
            f"disease_conf={confidence:.1f}% < {DISEASE_OVERRIDE_THRESHOLD}%"
        )
        return {
            'is_banana': False,
            'detectedDisease': 'Bukan Daun/Batang Pisang',
            'category': 'Tidak Dikenali',
            'severity': 'unknown',
            'confidence': 0,
            'gate_info': {
                'top_predictions': gate_result['top_predictions'],
                'plant_score': gate_result['plant_score'],
            },
            'predictions': []
        }

    if not gate_result['is_plant']:
        # Gatekeeper ragu, tapi disease model cukup yakin → override
        print(
            f"[Gatekeeper] OVERRIDE — plant_score={gate_result['plant_score']:.1f}%, "
            f"disease_conf={confidence:.1f}% >= {DISEASE_OVERRIDE_THRESHOLD}% "
            f"→ trusting disease model (likely diseased/dried/yellowed leaf)"
        )

    disease_info = DISEASE_MAP.get(predicted_class, {
        'name': 'Unknown',
        'category': 'Unknown',
        'severity': 'Unknown'
    })

    return {
        'is_banana': True,
        'detectedDisease': disease_info['name'],
        'category': disease_info['category'],
        'severity': disease_info['severity'],
        'confidence': round(confidence, 2),
        'predictions': [
            {
                'disease': DISEASE_MAP.get(i, {}).get('name', f'Class {i}'),
                'confidence': round(float(confidence_scores[i]) * 100, 2)
            }
            for i in range(len(confidence_scores))
        ]
    }


# API Endpoints
@app.post("/api/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """ML prediction endpoint (base64 image)"""
    try:
        if not request.image:
            raise HTTPException(status_code=400, detail="No image provided")

        result = run_prediction(request.image)
        return PredictionResponse(success=True, data=result)

    except HTTPException:
        raise
    except Exception as e:
        import traceback
        tb = traceback.format_exc()
        print(f"Prediction error:\n{tb}")
        raise HTTPException(status_code=500, detail=f'Prediction failed: {str(e)}\nTraceback:\n{tb}')


@app.post("/api/predict-file", response_model=PredictionResponse)
async def predict_file(file: UploadFile = File(...)):
    """ML prediction endpoint with file upload"""
    contents = None
    try:
        # Validate file type
        content_type = file.content_type or ""
        # Accept even if content_type is missing/wrong by trying to open as image
        if content_type and content_type not in ALLOWED_CONTENT_TYPES:
            # Allow if content_type starts with image/ (e.g. image/heic)
            if not content_type.startswith("image/"):
                raise HTTPException(
                    status_code=400,
                    detail=f"Tipe file tidak didukung: {content_type}. Gunakan JPG, PNG, atau WEBP."
                )

        # Read and open image
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="File kosong atau tidak dapat dibaca")

        try:
            img = Image.open(io.BytesIO(contents))
            img.load()  # Force full decode to catch corrupt images early
        except Exception as img_err:
            raise HTTPException(status_code=400, detail=f"File gambar tidak dapat dibaca: {str(img_err)}")

        result = run_prediction(img)
        return PredictionResponse(success=True, data=result)

    except HTTPException:
        raise
    except Exception as e:
        import traceback
        tb = traceback.format_exc()
        print(f"predict_file error:\n{tb}")
        raise HTTPException(status_code=500, detail=f'Prediction failed: {str(e)}\nTraceback:\n{tb}')
    finally:
        # Always close the upload file to free resources
        await file.close()


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "model_type": MODEL_TYPE,
        "model_loaded": disease_model is not None,
        "gatekeeper_loaded": imagenet_model is not None,
    }

@app.get("/")
async def root():
    return {
        "message": "BananaVision API",
        "version": "1.0.0",
        "status": "running",
        "model_type": MODEL_TYPE,
    }

class ReloadRequest(BaseModel):
    filename: str
    model_type: str  # "mobilenetv2" or "resnet50"
    url: Optional[str] = None  # Optional URL untuk download (None = file sudah ada lokal)

@app.post("/api/reload")
async def reload_model(request: ReloadRequest):
    global disease_model, imagenet_model, MODEL_TYPE, ACTIVE_FILENAME, ACTIVE_URL, _cfg

    model_type = request.model_type.lower().strip()
    if model_type not in MODEL_CONFIG:
        raise HTTPException(status_code=400, detail=f"Model type '{model_type}' tidak didukung.")

    model_path = os.path.join(MODEL_DIR, request.filename)
    if not os.path.exists(model_path):
        if request.url:
            import urllib.request
            print(f"Downloading model from {request.url} to {model_path}...")
            try:
                os.makedirs(os.path.dirname(model_path), exist_ok=True)
                urllib.request.urlretrieve(request.url, model_path)
                print("Download complete")
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Gagal mendownload model dari Cloud Storage: {str(e)}")
        else:
            raise HTTPException(status_code=404, detail=f"File model '{request.filename}' tidak ditemukan")

    try:
        # Load disease model
        print(f"Loading disease model: {request.filename} ({model_type})...")
        new_disease_model = tf.keras.models.load_model(model_path)
        print("Disease model loaded")

        new_cfg = MODEL_CONFIG[model_type]

        # Load ImageNet gatekeeper
        new_imagenet_model = None
        try:
            print(f"Loading ImageNet gatekeeper ({model_type})...")
            new_imagenet_model = new_cfg["imagenet_loader"]()
            print("ImageNet gatekeeper loaded")
        except Exception as gk_err:
            print(f"ImageNet gatekeeper failed to load (non-fatal): {gk_err}")

        # Update globals
        disease_model = new_disease_model
        imagenet_model = new_imagenet_model
        MODEL_TYPE = model_type
        ACTIVE_FILENAME = request.filename
        ACTIVE_URL = request.url
        _cfg = new_cfg

        # Save active model config
        with open(ACTIVE_MODEL_JSON, "w") as f:
            json.dump({
                "model_type": model_type,
                "filename": request.filename,
                "url": None
            }, f)

        print(f"Reload complete: {request.filename}")
        return {
            "success": True,
            "message": f"Model berhasil dimuat: {request.filename}",
            "model_type": model_type,
            "filename": request.filename,
            "gatekeeper_loaded": new_imagenet_model is not None
        }
    except Exception as e:
        import traceback
        print(f"Failed to reload model:\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Gagal memuat model: {str(e)}")

@app.get("/api/models")
async def list_available_models():
    """List all available .keras model files inside python/ directory"""
    try:
        files = os.listdir(MODEL_DIR)
        model_files = [f for f in files if f.endswith(".keras")]
        return {
            "success": True,
            "models": model_files,
            "active_model": {
                "filename": ACTIVE_FILENAME if disease_model is not None else None,
                "model_type": MODEL_TYPE if disease_model is not None else None
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)