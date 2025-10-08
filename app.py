from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import re
import os

app = Flask(__name__)
CORS(app)

# Phishing detection patterns
PHISHING_PATTERNS = [
    r'urgent.*action.*required',
    r'verify.*account.*immediately',
    r'click.*here.*now',
    r'suspended.*account',
    r'confirm.*identity',
    r'limited.*time.*offer',
    r'act.*now.*expire',
    r'security.*alert'
]

SUSPICIOUS_DOMAINS = ['bit.ly', 'tinyurl.com', 'short.link', 'suspicious-bank.com']

# Frontend routes
@app.route('/')
def index():
    return send_from_directory('dist', 'index.html')

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory('dist/assets', filename)

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('dist', filename)

# API routes
@app.route('/api/scan/text', methods=['POST'])
def scan_text():
    data = request.json
    text = data.get('text', '').lower()
    
    threat_score = 0
    detected_patterns = []
    
    for pattern in PHISHING_PATTERNS:
        if re.search(pattern, text):
            threat_score += 20
            detected_patterns.append(pattern)
    
    is_phishing = threat_score > 40
    
    return jsonify({
        'is_phishing': is_phishing,
        'confidence': min(threat_score, 100),
        'patterns': detected_patterns,
        'risk_level': 'High' if threat_score > 60 else 'Medium' if threat_score > 20 else 'Low'
    })

@app.route('/api/scan/url', methods=['POST'])
def scan_url():
    data = request.json
    url = data.get('url', '')
    
    threat_score = 0
    issues = []
    
    for domain in SUSPICIOUS_DOMAINS:
        if domain in url:
            threat_score += 30
            issues.append(f'Suspicious domain: {domain}')
    
    if any(short in url for short in ['bit.ly', 'tinyurl', 't.co']):
        threat_score += 25
        issues.append('URL shortener detected')
    
    if re.search(r'[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}', url):
        threat_score += 20
        issues.append('IP address instead of domain')
    
    is_phishing = threat_score > 30
    
    return jsonify({
        'is_phishing': is_phishing,
        'confidence': min(threat_score, 100),
        'issues': issues,
        'risk_level': 'High' if threat_score > 50 else 'Medium' if threat_score > 20 else 'Low'
    })

@app.route('/api/scan/email', methods=['POST'])
def scan_email():
    data = request.json
    email = data.get('email', '').lower()
    
    threat_score = 0
    warnings = []
    
    if '@' in email:
        domain = email.split('@')[-1]
        if any(susp in domain for susp in ['temp', 'fake', 'phish']):
            threat_score += 40
            warnings.append('Suspicious sender domain')
    
    for pattern in PHISHING_PATTERNS:
        if re.search(pattern, email):
            threat_score += 15
            warnings.append('Phishing pattern detected')
    
    is_phishing = threat_score > 25
    
    return jsonify({
        'is_phishing': is_phishing,
        'confidence': min(threat_score, 100),
        'warnings': warnings,
        'risk_level': 'High' if threat_score > 50 else 'Medium' if threat_score > 25 else 'Low'
    })

if __name__ == '__main__':
    print("🚀 TrustEye — See Through Phishing")
    print("📱 Frontend & Backend Server running at http://localhost:4000")
    print("✨ Features: AI Detection | Accessibility | Multilingual")
    app.run(debug=True, port=4000, host='0.0.0.0')
