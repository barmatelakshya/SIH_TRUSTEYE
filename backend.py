from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import urllib.parse
import requests
from datetime import datetime
import json
import os

app = Flask(__name__)
CORS(app)

# Simple file-based storage for user data
USER_DATA_FILE = 'user_data.json'

def load_user_data():
    if os.path.exists(USER_DATA_FILE):
        try:
            with open(USER_DATA_FILE, 'r') as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_user_data(data):
    try:
        with open(USER_DATA_FILE, 'w') as f:
            json.dump(data, f, indent=2)
        return True
    except:
        return False

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

@app.route('/api/user/save', methods=['POST'])
def save_user_session():
    try:
        data = request.json
        user_id = data.get('user_id', 'default_user')
        
        all_data = load_user_data()
        all_data[user_id] = {
            'totalScans': data.get('totalScans', 0),
            'threatsFound': data.get('threatsFound', 0),
            'safeMessages': data.get('safeMessages', 0),
            'scanHistory': data.get('scanHistory', []),
            'lastActive': datetime.now().isoformat()
        }
        
        if save_user_data(all_data):
            return jsonify({'success': True, 'message': 'Data saved successfully'})
        else:
            return jsonify({'success': False, 'message': 'Failed to save data'}), 500
            
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/user/load', methods=['POST'])
def load_user_session():
    try:
        data = request.json
        user_id = data.get('user_id', 'default_user')
        
        all_data = load_user_data()
        user_data = all_data.get(user_id, {
            'totalScans': 0,
            'threatsFound': 0,
            'safeMessages': 0,
            'scanHistory': [],
            'lastActive': datetime.now().isoformat()
        })
        
        return jsonify({'success': True, 'data': user_data})
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    print("TrustEye Backend Server Starting...")
    app.run(debug=True, port=5001)
