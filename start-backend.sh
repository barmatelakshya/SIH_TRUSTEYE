#!/bin/bash
cd "$(dirname "$0")"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install requirements if needed
pip install flask flask-cors requests > /dev/null 2>&1

echo "Starting TrustEye Backend Server on port 5001..."
python backend.py
