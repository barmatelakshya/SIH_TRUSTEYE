#!/bin/bash
echo "Starting TrustEye Backend Server..."
cd /Users/barmate_lakshya/Documents/SIH_NEW
source venv/bin/activate
python3 backend.py &
sleep 2
echo "Opening TrustEye Frontend..."
open index.html
echo "TrustEye is now running!"
echo "Backend: http://localhost:5000"
echo "Press Ctrl+C to stop the server"
wait
