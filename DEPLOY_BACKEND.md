# Backend Deployment Guide

## Option 1: Render (Recommended - Free)
1. Go to https://render.com
2. Connect your GitHub account
3. Create "New Web Service"
4. Connect this repository
5. Use these settings:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python backend.py`
   - Environment: Python 3
6. Deploy and copy the URL
7. Update `API_BASE_URL` in `src/services/api.ts`

## Option 2: Railway
1. Go to https://railway.app
2. Deploy from GitHub
3. Select this repository
4. Railway will auto-detect Python and deploy

## Option 3: Heroku
1. Install Heroku CLI
2. Run: `heroku create sih-trusteye-backend`
3. Run: `git push heroku main`
4. Backend will be at: `https://sih-trusteye-backend.herokuapp.com`

## Current Configuration
- Backend URL: https://sih-trusteye-backend.onrender.com/api
- Frontend will automatically use this in production
- Local development still uses localhost:5001
