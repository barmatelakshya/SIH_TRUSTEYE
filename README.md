# SIH Phishing Detection Prototype

## 📁 Organized Project Structure
```
SIH_NEW/
├── backend/              # FastAPI + ML models
│   ├── main.py          # API server
│   ├── models/          # ML detection models
│   └── requirements.txt # Python dependencies
├── extension/           # Chrome Extension (Manifest V3)
│   ├── manifest.json    # Extension config
│   └── src/             # Extension scripts
├── frontend/            # Next.js + Tailwind CSS
│   ├── package.json     # Node dependencies
│   └── src/app/         # React components
├── mobile-wrapper/      # Flutter WebView
│   ├── pubspec.yaml     # Flutter config
│   └── lib/main.dart    # Flutter app
└── shared/              # Common utilities
```

## 🚀 Quick Start
```bash
# Install all dependencies and start services
./start.sh

# Or start individually:

# Backend
cd backend && pip install -r requirements.txt && uvicorn main:app --reload --port 8000

# Frontend  
cd frontend && npm install && npm run dev

# Extension
Load extension/ folder in Chrome Developer Mode

# Mobile (optional)
cd mobile-wrapper && flutter run
```

## 🎯 MVP Features
- **Text Analysis**: NLP-based phishing detection
- **URL Analysis**: Link obfuscation detection  
- **Browser Extension**: Real-time protection
- **Responsive Website**: Cross-platform dashboard
- **Mobile Wrapper**: Flutter WebView app

## 📱 Access Points
- **API**: http://localhost:8000
- **Website**: http://localhost:3000  
- **Extension**: Chrome toolbar
- **Mobile**: Flutter app
