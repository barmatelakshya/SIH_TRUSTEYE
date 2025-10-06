from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import urllib.parse
import requests
from datetime import datetime

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

SUSPICIOUS_DOMAINS = [
    'bit.ly', 'tinyurl.com', 'short.link', 'suspicious-bank.com'
]

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
    
    # Check for suspicious domains
    for domain in SUSPICIOUS_DOMAINS:
        if domain in url:
            threat_score += 30
            issues.append(f'Suspicious domain: {domain}')
    
    # Check for URL shorteners
    if any(short in url for short in ['bit.ly', 'tinyurl', 't.co']):
        threat_score += 25
        issues.append('URL shortener detected')
    
    # Check for suspicious patterns
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
    
    # Check sender domain
    if '@' in email:
        domain = email.split('@')[-1]
        if any(susp in domain for susp in ['temp', 'fake', 'phish']):
            threat_score += 40
            warnings.append('Suspicious sender domain')
    
    # Check for phishing patterns in email content
    for pattern in PHISHING_PATTERNS:
        if re.search(pattern, email):
            threat_score += 15
            warnings.append(f'Phishing pattern detected')
    
    is_phishing = threat_score > 25
    
    return jsonify({
        'is_phishing': is_phishing,
        'confidence': min(threat_score, 100),
        'warnings': warnings,
        'risk_level': 'High' if threat_score > 50 else 'Medium' if threat_score > 25 else 'Low'
    })

if __name__ == '__main__':
    print("TrustEye Backend Server Starting...")
    app.run(debug=True, port=5001)
