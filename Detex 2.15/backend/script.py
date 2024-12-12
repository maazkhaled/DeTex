import torch
from ultralytics import YOLO  # Import YOLO from ultralytics package
import cv2
import socketio  # For Socket.IO communication
import base64
import numpy as np

# Determine the device to use (GPU if available, otherwise CPU)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Using device:", device)

# Initialize the YOLO model with your weights
model = YOLO('//Users//macm1//Downloads//Detex 2.15//backend//model//best.pt')  # Ensure 'best.pt' is the correct path to your model weights
model.to(device)  # Move the model to the selected device

# Set the confidence threshold for predictions
conf_threshold = 0.7

# Initialize Socket.IO client
sio = socketio.Client()

@sio.event
def connect():
    print("Python script connected to the server.")

@sio.event
def disconnect():
    print("Python script disconnected from the server.")

# Connect to the Node.js server
sio.connect('http://localhost:5001')  # Adjust the URL and port as needed

# Use the webcam for live detection
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Perform detection
    results = model.predict(source=frame, conf=conf_threshold, verbose=False)

    # Process results
    detections = []

    for result in results:
        boxes = result.boxes
        if boxes:
            box_coords = boxes.xyxy.cpu().numpy().tolist()
            class_labels = boxes.cls.cpu().numpy().tolist()
            class_confidences = boxes.conf.cpu().numpy().tolist()
            class_names = result.names

            detection = {
                'box_coords': box_coords,
                'class_labels': class_labels,
                'class_confidences': class_confidences,
                'class_names': class_names,
                'image_width': frame.shape[1],
                'image_height': frame.shape[0]
            }
            detections.append(detection)

    # Annotate frame with detections
    annotated_frame = results[0].plot()

    # Encode the annotated frame as JPEG
    _, buffer = cv2.imencode('.jpg', annotated_frame)
    frame_base64 = f"data:image/jpeg;base64,{base64.b64encode(buffer).decode('utf-8')}"

    # Send detections and frame to the server
    sio.emit('detection', {
        'detections': detections,
        'frame': frame_base64
    })

    # Display the results locally (optional)
    cv2.imshow('YOLO Detection', annotated_frame)

    # Break the loop if 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
sio.disconnect()
