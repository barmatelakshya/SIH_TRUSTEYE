#!/usr/bin/env python3
import webbrowser
import threading
import time
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)

HTML_TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TrustEye — See Through Phishing</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-50">
    <nav class="bg-white shadow-lg sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center space-x-3">
                    <i class="fas fa-shield-alt text-2xl text-blue-600"></i>
                    <span class="text-xl font-bold">TrustEye</span>
                </div>
                <div class="flex items-center space-x-4">
                    <button id="langBtn" class="px-3 py-1 bg-gray-100 rounded">EN</button>
                </div>
            </div>
        </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 py-8">
        <section class="text-center mb-16">
            <h1 class="text-5xl font-bold mb-6 text-gray-900">TrustEye — See Through Phishing</h1>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-8">Advanced AI protection with accessibility-first design, multilingual support, and real-world impact for global cybersecurity</p>
            <button onclick="showScanner()" class="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">Start Scanning</button>
        </section>

        <section id="scanner" class="hidden mb-16">
            <div class="bg-white rounded-lg shadow-lg p-8">
                <h2 class="text-2xl font-bold mb-6 text-center">Security Scanner</h2>
                
                <div class="flex justify-center mb-6">
                    <div class="flex bg-gray-100 rounded-lg p-1">
                        <button onclick="switchTab('text')" id="textTab" class="px-4 py-2 rounded-md bg-blue-600 text-white">Text</button>
                        <button onclick="switchTab('url')" id="urlTab" class="px-4 py-2 rounded-md">URL</button>
                    </div>
                </div>

                <div id="textScanner">
                    <textarea id="textInput" class="w-full h-32 p-4 border rounded-lg" placeholder="Enter text to scan for phishing..."></textarea>
                    <button onclick="scanText()" class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Scan Text</button>
                </div>

                <div id="urlScanner" class="hidden">
                    <input id="urlInput" type="url" class="w-full p-4 border rounded-lg" placeholder="Enter URL to scan...">
                    <button onclick="scanUrl()" class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Scan URL</button>
                </div>

                <div id="results" class="mt-6 hidden">
                    <div id="resultContent" class="p-4 rounded-lg"></div>
                </div>
            </div>
        </section>
    </main>

    <script>
        function showScanner() {
            document.getElementById('scanner').classList.remove('hidden');
        }

        function switchTab(tab) {
            ['text', 'url'].forEach(t => {
                document.getElementById(t + 'Scanner').classList.add('hidden');
                document.getElementById(t + 'Tab').classList.remove('bg-blue-600', 'text-white');
            });
            document.getElementById(tab + 'Scanner').classList.remove('hidden');
            document.getElementById(tab + 'Tab').classList.add('bg-blue-600', 'text-white');
        }

        async function scanText() {
            const text = document.getElementById('textInput').value;
            if (!text) return;

            try {
                const response = await fetch('/api/scan/text', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text })
                });
                const result = await response.json();
                showResults(result);
            } catch (error) {
                showError('Scan failed');
            }
        }

        async function scanUrl() {
            const url = document.getElementById('urlInput').value;
            if (!url) return;

            try {
                const response = await fetch('/api/scan/url', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url })
                });
                const result = await response.json();
                showResults(result);
            } catch (error) {
                showError('Scan failed');
            }
        }

        function showResults(result) {
            const resultsDiv = document.getElementById('results');
            const contentDiv = document.getElementById('resultContent');
            
            const bgColor = result.is_phishing ? 'bg-red-100 border-red-500' : 'bg-green-100 border-green-500';
            const textColor = result.is_phishing ? 'text-red-800' : 'text-green-800';
            const icon = result.is_phishing ? 'fa-exclamation-triangle' : 'fa-shield-alt';
            
            contentDiv.className = `p-4 rounded-lg border-2 ${bgColor}`;
            contentDiv.innerHTML = `
                <div class="flex items-center mb-4">
                    <i class="fas ${icon} text-2xl ${textColor} mr-3"></i>
                    <div>
                        <h3 class="text-lg font-bold ${textColor}">
                            ${result.is_phishing ? 'Threat Detected' : 'Safe Content'}
                        </h3>
                        <p class="${textColor}">Risk Level: ${result.risk_level} (${result.confidence}% confidence)</p>
                    </div>
                </div>
            `;
            
            resultsDiv.classList.remove('hidden');
        }

        function showError(message) {
            const resultsDiv = document.getElementById('results');
            const contentDiv = document.getElementById('resultContent');
            
            contentDiv.className = 'p-4 rounded-lg border-2 bg-yellow-100 border-yellow-500';
            contentDiv.innerHTML = `<p class="text-yellow-800">${message}</p>`;
            resultsDiv.classList.remove('hidden');
        }
    </script>
</body>
</html>'''

PHISHING_PATTERNS = [
    r'urgent.*action.*required',
    r'verify.*account.*immediately',
    r'click.*here.*now',
    r'suspended.*account'
]

@app.route('/')
def index():
    return render_template_string(HTML_TEMPLATE)

@app.route('/api/scan/text', methods=['POST'])
def scan_text():
    data = request.json
    text = data.get('text', '').lower()
    
    threat_score = 0
    for pattern in PHISHING_PATTERNS:
        if re.search(pattern, text):
            threat_score += 25
    
    is_phishing = threat_score > 40
    
    return jsonify({
        'is_phishing': is_phishing,
        'confidence': min(threat_score, 100),
        'risk_level': 'High' if threat_score > 60 else 'Medium' if threat_score > 20 else 'Low'
    })

@app.route('/api/scan/url', methods=['POST'])
def scan_url():
    data = request.json
    url = data.get('url', '')
    
    threat_score = 0
    if any(domain in url for domain in ['bit.ly', 'tinyurl.com']):
        threat_score += 50
    
    is_phishing = threat_score > 30
    
    return jsonify({
        'is_phishing': is_phishing,
        'confidence': min(threat_score, 100),
        'risk_level': 'High' if threat_score > 40 else 'Low'
    })

def open_browser():
    time.sleep(1)
    webbrowser.open('http://localhost:5000')

if __name__ == '__main__':
    print("🚀 TrustEye — See Through Phishing")
    print("🌐 Opening at http://localhost:5000")
    
    threading.Thread(target=open_browser).start()
    app.run(debug=False, port=5000, host='127.0.0.1')
