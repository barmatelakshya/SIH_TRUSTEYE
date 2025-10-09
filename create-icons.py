#!/usr/bin/env python3
from PIL import Image, ImageDraw
import os

# Create icons directory
os.makedirs('/Users/barmate_lakshya/Documents/SIH_NEW/extension/icons', exist_ok=True)

# Icon sizes
sizes = [16, 32, 48, 128]

for size in sizes:
    # Create image
    img = Image.new('RGBA', (size, size), (79, 70, 229, 255))  # Blue background
    draw = ImageDraw.Draw(img)
    
    # Draw simple eye shape (circle with center dot)
    margin = size // 8
    eye_size = size - 2 * margin
    
    # Outer eye circle
    draw.ellipse([margin, margin, size-margin, size-margin], 
                outline=(255, 255, 255, 255), width=max(1, size//32), fill=None)
    
    # Inner pupil
    pupil_margin = size // 3
    draw.ellipse([pupil_margin, pupil_margin, size-pupil_margin, size-pupil_margin], 
                fill=(255, 255, 255, 255))
    
    # Save icon
    img.save(f'/Users/barmate_lakshya/Documents/SIH_NEW/extension/icons/icon-{size}.png')
    print(f"Created icon-{size}.png")

print("All icons created successfully!")
