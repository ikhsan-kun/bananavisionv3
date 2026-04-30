import os
import json
import numpy as np
import tensorflow as tf
from PIL import Image
import io
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load model
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model_penyakit_pisang.h5')
model = tf.keras.models.load_model(MODEL_PATH)

# Disease mapping
DISEASE_MAP = {
    0: {'name': 'Black Sigatoka', 'category': 'Jamur', 'severity': 'Berat'},
    1: {'name': 'Bract Mosaic Virus', 'category': 'Virus', 'severity': 'Sedang'},
    2: {'name': 'Healthy Leaf', 'category': 'Sehat', 'severity': 'Ringan'},
    3: {'name': 'Insect Pest', 'category': 'Hama', 'severity': 'Sedang'},
    4: {'name': 'Moko Disease', 'category': 'Bakteri', 'severity': 'Berat'},
    5: {'name': 'Panama Disease', 'category': 'Jamur', 'severity': 'Berat'},
    6: {'name': 'Yellow Sigatoka', 'category': 'Jamur', 'severity': 'Sedang'},
}

def preprocess_image(image_data, target_size=(224, 224)):
    """Convert base64 or PIL image to preprocessed array"""
    if isinstance(image_data, str):
        # Base64 string
        img_bytes = base64.b64decode(image_data)
        img = Image.open(io.BytesIO(img_bytes))
    else:
        img = image_data
    
    img = img.convert('RGB')
    img = img.resize(target_size)
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

@app.route('/api/predict', methods=['POST'])
def predict():
    """ML prediction endpoint"""
    try:
        data = request.json
        
        if not data or 'image' not in data:
            return jsonify({'success': False, 'message': 'No image provided'}), 400
        
        # Preprocess image
        image_array = preprocess_image(data['image'])
        
        # Make prediction
        predictions = model.predict(image_array, verbose=0)
        confidence_scores = predictions[0]
        predicted_class = np.argmax(confidence_scores)
        confidence = float(confidence_scores[predicted_class]) * 100
        
        # Map to disease info
        disease_info = DISEASE_MAP.get(predicted_class, {
            'name': 'Unknown',
            'category': 'Unknown',
            'severity': 'Unknown'
        })
        
        # Return results
        return jsonify({
            'success': True,
            'data': {
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
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Prediction failed: {str(e)}'
        }), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'model': 'loaded'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5001)
