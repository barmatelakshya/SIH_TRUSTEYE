#!/bin/bash
echo "🔧 Installing TrustEye Browser Extension..."

# Open Chrome extensions page
if command -v google-chrome &> /dev/null; then
    google-chrome chrome://extensions/
elif command -v chromium &> /dev/null; then
    chromium chrome://extensions/
else
    echo "📋 Manual steps:"
    echo "1. Open Chrome/Edge"
    echo "2. Go to chrome://extensions/"
    echo "3. Enable 'Developer mode'"
    echo "4. Click 'Load unpacked'"
    echo "5. Select: $(pwd)/extension"
fi

echo "✅ Extension folder: $(pwd)/extension"
