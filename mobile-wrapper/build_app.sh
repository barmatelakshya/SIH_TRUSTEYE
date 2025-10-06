#!/bin/bash

echo "🚀 Building PhishGuard Mobile App..."

# Check if Flutter is installed
if ! command -v flutter &> /dev/null; then
    echo "❌ Flutter not found. Please install Flutter first."
    echo "📥 Download from: https://flutter.dev/docs/get-started/install"
    exit 1
fi

# Check Flutter doctor
echo "🔍 Checking Flutter setup..."
flutter doctor

# Get dependencies
echo "📦 Getting dependencies..."
flutter pub get

# Clean previous builds
echo "🧹 Cleaning previous builds..."
flutter clean
flutter pub get

# Build for Android (Debug)
echo "🔨 Building Android APK (Debug)..."
flutter build apk --debug

# Build for Android (Release)
echo "🔨 Building Android APK (Release)..."
flutter build apk --release

echo ""
echo "✅ Build complete!"
echo ""
echo "📱 APK files generated:"
echo "   Debug: build/app/outputs/flutter-apk/app-debug.apk"
echo "   Release: build/app/outputs/flutter-apk/app-release.apk"
echo ""
echo "📲 To install on device:"
echo "   flutter install"
echo "   or"
echo "   adb install build/app/outputs/flutter-apk/app-release.apk"
echo ""
echo "🏃 To run in development:"
echo "   flutter run"
