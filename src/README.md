# TrustEye 👁️

**See the threat before it strikes**

TrustEye is a comprehensive AI-powered threat detection platform that analyzes messages and URLs for scam indicators and phishing attempts. Built with privacy-first design principles, all processing happens locally in your browser.

![TrustEye Platform](https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=400&fit=crop)

## ✨ Features

### 🛡️ AI Threat Scanner
- **Real-time text analysis** using advanced ML algorithms
- **URL detection and validation** to identify suspicious links
- **Scam indicator detection** including urgency tactics, suspicious requests, and poor grammar
- **Risk scoring system** with detailed breakdown of findings
- **Demo mode** with example phishing attempts

### 📊 Live Dashboard
- **Interactive charts** powered by Recharts
- **Animated statistics** showing threat detection metrics
- **Real-time updates** with threat trends
- **Visual analytics** for better understanding

### 📚 Education Hub
- **Interactive quizzes** to test your scam detection skills
- **Real case studies** of actual phishing attempts
- **Security tips and best practices**
- **Progress tracking** for learning advancement

### ℹ️ About & Contact
- **Detailed platform information** and mission
- **Privacy-first architecture** explanation
- **Contact information** for support
- **Security features overview**

## 🚀 Tech Stack

- **React** - Frontend framework
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Modern styling with custom design tokens
- **Shadcn/ui** - High-quality UI components
- **Recharts** - Data visualization
- **Lucide React** - Beautiful icons
- **Local Storage** - Client-side data persistence

## 🔒 Security Features

- ✅ **XSS Protection Active**
- ✅ **Input Validation Enabled**
- ✅ **Data Privacy Compliant**
- ✅ **Rate Limiting Protection**
- ✅ **Local Processing Only** - No data sent to external servers

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/barmatelakshya/trytusteye.git

# Navigate to project directory
cd trytusteye

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🎨 Color Scheme

The platform uses a custom gradient theme:

- **Primary Gradient**: `#044389` → `#000000`
- **Primary Color**: `#044389`
- **Dark Mode Support**: Full theme switching with persistence

## 📁 Project Structure

```
trusteye/
├── App.tsx                 # Main application component
├── components/
│   ├── About.tsx          # About section
│   ├── AnalysisResults.tsx # Threat analysis display
│   ├── Contact.tsx        # Contact & support
│   ├── Dashboard.tsx      # Analytics dashboard
│   ├── EducationHub.tsx   # Learning center
│   ├── Features.tsx       # Feature highlights
│   ├── Header.tsx         # Navigation header
│   ├── Hero.tsx           # Landing hero section
│   ├── ScamIndicators.tsx # Scam detection info
│   ├── ThemeToggle.tsx    # Dark/light mode toggle
│   └── ui/                # Shadcn UI components
├── utils/
│   └── scamDetection.ts   # AI detection algorithms
└── styles/
    └── globals.css        # Tailwind v4 configuration
```

## 🧠 Detection Algorithm

TrustEye analyzes messages for multiple scam indicators:

1. **Urgency Tactics** - Detects time-pressure language
2. **Suspicious Requests** - Identifies requests for sensitive info
3. **Poor Grammar** - Flags excessive punctuation and typos
4. **URL Analysis** - Validates links and checks for spoofing
5. **Brand Impersonation** - Detects fake company names
6. **Emotional Manipulation** - Identifies fear-based tactics

## 🎯 Usage

1. **Navigate to Scanner** - Click on the Scanner tab or use "Try Demo"
2. **Paste Message** - Copy any suspicious email or text
3. **Analyze** - Click "Analyze Message" for instant results
4. **Review Results** - Check the risk score and detailed findings
5. **Learn More** - Visit Education Hub for tips and quizzes

## 🌟 Key Highlights

- **Privacy-First Design** - All data processing happens locally
- **No Data Collection** - Your messages never leave your device
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Theme Persistence** - Your dark/light mode preference is saved
- **Educational Content** - Learn while you protect yourself

## 📸 Screenshots

### Scanner Interface
Paste and analyze suspicious messages with real-time threat detection.

### Live Dashboard
Interactive charts showing threat trends and detection statistics.

### Education Hub
Learn about common scams through quizzes and case studies.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

**Email**: lakshyabarmate@gmail.com

**Availability**: 24/7 for threat detection

## ⚠️ Disclaimer

This tool provides automated analysis and should not be your only method of verification. When in doubt, always contact companies directly using official contact information from their website.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Figma Make](https://www.figma.com)
- UI components from [Shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
- Charts from [Recharts](https://recharts.org)

---

**TrustEye** - Empowering users with AI-powered threat detection 🛡️
