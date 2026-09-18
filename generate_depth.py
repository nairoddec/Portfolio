import os
import torch
import requests
from PIL import Image
from transformers import GLPNImageProcessor, GLPNForDepthEstimation

def generate_depth_map(image_path, output_path):
    print(f"Loading image from {image_path}")
    image = Image.open(image_path).convert("RGB")
    
    print("Loading AI model...")
    # Using a fast, lightweight depth model
    processor = GLPNImageProcessor.from_pretrained("vinvino02/glpn-nyu")
    model = GLPNForDepthEstimation.from_pretrained("vinvino02/glpn-nyu")
    
    print("Processing image...")
    inputs = processor(images=image, return_tensors="pt")
    
    with torch.no_grad():
        outputs = model(**inputs)
        predicted_depth = outputs.predicted_depth
        
    print("Generating depth map...")
    # Interpolate to original size
    prediction = torch.nn.functional.interpolate(
        predicted_depth.unsqueeze(1),
        size=image.size[::-1],
        mode="bicubic",
        align_corners=False,
    )
    
    # Normalize depth map
    output = prediction.squeeze().cpu().numpy()
    formatted = (output * 255 / np.max(output)).astype("uint8")
    
    # Invert the depth map (for WebGL parallax, closer objects should be whiter usually, depends on model output, GLPN outputs farther objects as larger values, so closer is smaller. We want closer to be white (255))
    formatted = 255 - formatted
    
    depth_image = Image.fromarray(formatted)
    depth_image.save(output_path)
    print(f"Success! Depth map saved to {output_path}")

if __name__ == "__main__":
    import numpy as np
    input_file = "public/picture/accueil.png"
    output_file = "public/picture/accueil-depth.png"
    if os.path.exists(input_file):
        generate_depth_map(input_file, output_file)
    else:
        print(f"File not found: {input_file}")
