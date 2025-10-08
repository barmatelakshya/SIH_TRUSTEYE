# TrustEye - Advanced Scam Detection System

A comprehensive scam detection platform with React frontend and Flask backend integration.

## Features

### 🔍 Analysis Capabilities
- **Text Message Analysis**: Detect phishing patterns in emails and messages
- **URL Scanning**: Analyze suspicious links and domains
- **Backend Integration**: Flask API with frontend fallback
- **Real-time Results**: Instant threat assessment with detailed flags

### 📊 Dashboard & Analytics
- **Session-based Statistics**: Fresh data for each user
- **Real-time Updates**: Live tracking of scans and threats
- **Interactive Charts**: Visual representation of threat data
- **Activity Monitoring**: Track analysis history

### 🎓 Education Hub
- **Interactive Quizzes**: Test your scam detection knowledge
- **Case Studies**: Learn from real-world examples
- **Security Tips**: Best practices for online safety

### 🎨 User Interface
- **Modern Design**: Clean, responsive interface
- **Dark/Light Mode**: Theme toggle support
- **Mobile Friendly**: Works on all devices
- **Accessibility**: WCAG compliant design

## Quick Start

### Frontend Only
```bash
npm run dev
```

### With Backend Integration
```bash
# Option 1: Use startup script
./start-full.sh

# Option 2: Start separately
npm run backend  # Terminal 1
npm run dev      # Terminal 2
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # UI component library (50+ components)
│   ├── Dashboard.tsx   # Analytics dashboard
│   ├── Hero.tsx        # Landing page hero
│   └── ...
├── services/           # API integration
│   └── api.ts          # Backend communication
├── utils/              # Utility functions
│   └── scamDetection.ts # Analysis algorithms
├── lib/                # Shared utilities
└── styles/             # CSS and styling
```

## Backend Integration

The system supports both frontend-only and full-stack modes:

- **Frontend Mode**: All analysis runs locally in the browser
- **Backend Mode**: Uses Flask API with automatic fallback
- **Hybrid Mode**: Toggle between modes in real-time

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Flask, Python
- **UI Components**: Radix UI, Lucide Icons
- **Charts**: Recharts
- **Styling**: Tailwind CSS v4

## Development

### Prerequisites
- Node.js 18+
- Python 3.8+
- npm or yarn

### Installation
```bash
# Install frontend dependencies
npm install

# Install backend dependencies (if using backend)
pip install flask flask-cors requests
```

### Available Scripts
- `npm run dev` - Start frontend development server
- `npm run build` - Build for production
- `npm run backend` - Start Flask backend
- `./start-full.sh` - Start both frontend and backend

## Features Overview

### Analysis Engine
- Pattern-based detection algorithms
- URL reputation checking
- Risk scoring system
- Detailed threat categorization

### User Experience
- One-click analysis
- Example scam library
- Real-time feedback
- Session persistence

### Security & Privacy
- Local data processing (frontend mode)
- No data storage
- Secure API communication
- Privacy-first design

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please refer to the documentation or create an issue in the repository.
