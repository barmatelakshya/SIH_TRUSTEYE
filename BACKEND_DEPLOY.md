# Backend Deployment Options

## Option 1: Railway (Free)
1. Go to https://railway.app
2. Connect your GitHub repo
3. Deploy the backend folder
4. Update API_BASE_URL in src/services/api.ts

## Option 2: Render (Free)
1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repo
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `python backend.py`

## Option 3: Heroku
1. Install Heroku CLI
2. Create Procfile: `web: python backend.py`
3. Deploy to Heroku
4. Update API URL

## Quick Fix for Demo
Update src/services/api.ts to use client-side only:
- Comment out backend calls
- Use only analyzeText() and analyzeURL() functions
