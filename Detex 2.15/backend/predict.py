import torch
from PIL import Image
import sys
import json
from torchvision import transforms
from ultralytics import YOLO

# Load your YOLO model
model = YOLO('model/best.pt')

# Define transformation
transform = transforms.Compose([
    transforms.Resize((640, 640)),
    transforms.ToTensor(),
])

def predict(image_path):
    try:
        # Load and preprocess the image
        image = Image.open(image_path)
        input_tensor = transform(image).unsqueeze(0)

        # Perform the prediction
        with torch.no_grad():
            results = model(input_tensor)

        predictions = []

        # Parse results and prepare the JSON data
        for result in results:
            boxes = result.boxes if result.boxes else None
            if boxes:
                boxes = boxes.cpu().numpy()
                box_coords = boxes.xyxy.tolist() if boxes else None
                class_labels = boxes.cls.tolist() if boxes else None

                prediction = {
                    'box_coords': box_coords,
                    'class_labels': class_labels,
                    'class_names': result.names if result.names else None
                }
                predictions.append(prediction)

        # Print only JSON data
        print(json.dumps(predictions))
    except Exception as e:
        # Print an empty JSON array on error to avoid conflicts
        print(json.dumps([]), file=sys.stdout)

if __name__ == "__main__":
    image_path = sys.argv[1]
    predict(image_path)
