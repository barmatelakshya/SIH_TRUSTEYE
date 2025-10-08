#!/bin/bash

echo "Starting TrustEye Full Stack Application..."

# Start backend in background
echo "Starting Flask backend on port 5001..."
python3 backend.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "Starting React frontend..."
npm run dev

# Cleanup: kill backend when frontend stops
trap "kill $BACKEND_PID" EXIT
