# Render Deployment - Copy These Settings

## Step 1: Go to Render
https://render.com → Sign up with GitHub

## Step 2: Create Web Service
- Click "New +" → "Web Service"
- Connect GitHub → Select "SIH_TRUSTEYE" repository

## Step 3: Copy These Exact Settings
```
Name: sih-trusteye-backend
Environment: Python 3
Region: Oregon (US West)
Branch: main
Build Command: pip install -r requirements.txt
Start Command: python backend.py
Instance Type: Free
```

## Step 4: Advanced Settings (Optional)
```
Environment Variables:
PORT = 10000
PYTHON_VERSION = 3.11.0
```

## Step 5: Deploy
- Click "Create Web Service"
- Wait 3-5 minutes for deployment

## Step 6: Your URLs Will Be
- Backend: https://sih-trusteye-backend.onrender.com
- Frontend: https://barmatelakshya.github.io/SIH_TRUSTEYE/

## Step 7: Test Integration
Visit your frontend URL and test the scam detection - it will automatically use the deployed backend!

---
Everything is pre-configured. Just copy the settings above! 🚀
