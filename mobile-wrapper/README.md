# PhishGuard Mobile App

Flutter WebView wrapper with native phishing detection capabilities.

## 🚀 Features

### ✅ Implemented
- **WebView Integration**: Access web dashboard
- **Text Analysis**: Analyze emails and messages
- **URL Scanner**: Check suspicious links
- **SMS Analyzer**: Detect phishing SMS
- **Touch-Optimized UI**: Mobile-first design

### 🔮 Future-Ready
- **QR Code Scanner**: AR overlay for QR analysis
- **Real-time SMS Monitoring**: Background SMS scanning
- **Offline Detection**: Local ML models
- **Push Notifications**: Threat alerts

## 📱 Screenshots

```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│   🌐 Web        │   🔍 Scanner    │   📱 SMS        │   📷 QR Code   │
│                 │                 │                 │                 │
│  Web Dashboard  │  Text & URL     │  SMS Content    │  Camera Scanner │
│  Full Features  │  Analysis       │  Analysis       │  (Coming Soon)  │
│                 │                 │                 │                 │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

## 🛠️ Setup

### Prerequisites
- Flutter SDK (>=3.0.0)
- Android Studio / VS Code
- Android device or emulator

### Installation
```bash
# Clone and navigate
cd mobile-wrapper

# Install dependencies
flutter pub get

# Run on device
flutter run

# Build APK
./build_app.sh
```

### API Configuration
Update API endpoint in `lib/main.dart`:
```dart
final String apiUrl = 'https://your-api-domain.com';
```

## 📋 Permissions

### Required
- **Internet**: API communication
- **Camera**: QR code scanning
- **Vibrate**: Haptic feedback

### Optional
- **SMS**: SMS content analysis
- **Storage**: Caching results

## 🎯 Usage

### 1. Web Dashboard
- Full-featured web interface
- Real-time threat monitoring
- Interactive analysis tools

### 2. Text Scanner
- Paste suspicious content
- Instant AI analysis
- Detailed threat breakdown

### 3. SMS Analyzer
- Analyze SMS messages
- Phishing detection
- Safety recommendations

### 4. QR Scanner (Future)
- Camera-based scanning
- AR threat overlay
- Real-time URL analysis

## 🔧 Development

### Project Structure
```
mobile-wrapper/
├── lib/
│   └── main.dart          # Main app with 4 screens
├── android/
│   └── app/src/main/
│       └── AndroidManifest.xml  # Permissions
├── pubspec.yaml           # Dependencies
└── build_app.sh          # Build script
```

### Key Components
- **MainScreen**: Bottom navigation
- **WebViewScreen**: Web dashboard
- **ScannerScreen**: Text/URL analysis
- **SMSAnalyzerScreen**: SMS detection
- **QRScannerScreen**: Future QR scanning

### API Integration
```dart
// Text Analysis
POST /analyze-text
{
  "text": "suspicious content"
}

// URL Analysis  
POST /analyze-link
{
  "url": "https://suspicious-site.com"
}
```

## 📦 Build & Deploy

### Debug Build
```bash
flutter build apk --debug
```

### Release Build
```bash
flutter build apk --release
```

### Install on Device
```bash
flutter install
# or
adb install build/app/outputs/flutter-apk/app-release.apk
```

## 🔮 Future Enhancements

### AR QR Scanner
- Camera overlay with threat indicators
- Real-time URL analysis
- Visual warning system

### Background SMS Monitoring
- Automatic SMS scanning
- Push notifications for threats
- SMS filtering integration

### Offline ML Models
- Local phishing detection
- No internet required
- Privacy-focused analysis

### Advanced Features
- Voice message analysis
- Image text extraction (OCR)
- Social media link scanning
- Browser integration

## 🛡️ Security

- **Local Processing**: Sensitive data stays on device
- **Encrypted Communication**: HTTPS API calls
- **Permission Management**: Minimal required permissions
- **Privacy First**: No data collection without consent

## 📞 Support

- **Issues**: Report bugs and feature requests
- **Documentation**: Comprehensive setup guides
- **Community**: Developer support forum

---

**PhishGuard Mobile - AI-Powered Mobile Security** 🛡️📱
