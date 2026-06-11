import tensorflow as tf
import os

model_path = "/home/project/bananavisionv3/models/model_resnet50_final.keras"

if not os.path.exists(model_path):
    # Try local models folder
    model_path = os.path.join(os.path.dirname(__file__), "../models/model_resnet50_final.keras")

if not os.path.exists(model_path):
    print(f"Model file not found at: {model_path}")
    exit(1)

print(f"Inspecting model: {model_path}")
try:
    model = tf.keras.models.load_model(model_path, compile=False)
    
    print("\n--- Model Summary Details ---")
    print(f"Input Shape: {model.input_shape}")
    print(f"Output Shape: {model.output_shape}")
    
    print("\n--- Layer Architecture ---")
    for i, layer in enumerate(model.layers[:15]):
        print(f"Layer {i}: {layer.name} ({layer.__class__.__name__})")
        if "rescaling" in layer.name.lower() or "normalization" in layer.name.lower():
            print(f"   -> Config: {layer.get_config()}")
            
    print("\n... (skipping intermediate layers) ...")
    
    for i, layer in enumerate(model.layers[-10:]):
         print(f"Layer {len(model.layers)-10+i}: {layer.name} ({layer.__class__.__name__})")
         
    # Check if there is any Rescaling layer in the entire model
    rescaling_layers = [l for l in model.layers if "rescaling" in l.name.lower()]
    if rescaling_layers:
        print("\nFound Rescaling/Normalization layer(s) inside the model:")
        for rl in rescaling_layers:
            print(f"   - Name: {rl.name}, Config: {rl.get_config()}")
    else:
        print("\nℹNo Rescaling layers found inside the model. Preprocessing must be done externally.")

except Exception as e:
    print(f"Error inspecting model: {e}")
