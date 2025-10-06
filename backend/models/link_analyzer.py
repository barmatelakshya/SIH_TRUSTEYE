import re
import urllib.parse
from typing import Dict, List
import json
import os

class LinkObfuscationAnalyzer:
    def __init__(self):
        self.suspicious_domains = ['bit.ly', 'tinyurl.com', 'short.link', 't.co', 'goo.gl']
        self.trusted_domains = ['google.com', 'microsoft.com', 'apple.com', 'github.com', 'stackoverflow.com']
        self.suspicious_tlds = ['.tk', '.ml', '.ga', '.cf', '.click', '.download']
        
        # Load domain reputation data
        self._load_domain_data()
        
    def _load_domain_data(self):
        """Load domain patterns from URL dataset"""
        try:
            data_path = os.path.join(os.path.dirname(__file__), '..', '..', 'shared')
            with open(f"{data_path}/phishing_urls.json", 'r') as f:
                urls = json.load(f)
            
            self.known_phishing_domains = []
            self.known_safe_domains = []
            
            for item in urls:
                domain = urllib.parse.urlparse(item['url']).netloc
                if item['label'] == 1:  # Phishing
                    self.known_phishing_domains.append(domain)
                else:  # Safe
                    self.known_safe_domains.append(domain)
                    
        except FileNotFoundError:
            self.known_phishing_domains = []
            self.known_safe_domains = []
    
    def analyze_url(self, url: str) -> Dict:
        parsed = urllib.parse.urlparse(url)
        
        # Domain reputation scoring
        domain_score = self._calculate_domain_score(parsed.netloc)
        
        # URL structure analysis
        structure_score = self._analyze_url_structure(url, parsed)
        
        # Redirect chain analysis (simulated)
        redirect_score = self._analyze_redirects(url)
        
        # Obfuscation detection
        obfuscation_score = self._detect_obfuscation(url, parsed)
        
        # Combined risk assessment
        risk_score = (
            domain_score * 0.4 + 
            structure_score * 0.25 + 
            redirect_score * 0.2 + 
            obfuscation_score * 0.15
        )
        
        return {
            'url': url,
            'is_suspicious': risk_score > 0.4,
            'confidence': risk_score,
            'risk_score': risk_score,
            'domain': parsed.netloc,
            'analysis': {
                'domain_score': domain_score,
                'structure_score': structure_score,
                'redirect_score': redirect_score,
                'obfuscation_score': obfuscation_score
            },
            'indicators': self._get_indicators(url, parsed)
        }
    
    def _calculate_domain_score(self, domain: str) -> float:
        """Calculate domain reputation score"""
        score = 0.0
        
        # Check against known lists
        if domain in self.known_phishing_domains:
            score += 0.8
        elif domain in self.known_safe_domains or domain in self.trusted_domains:
            score -= 0.3
        
        # URL shorteners
        if any(shortener in domain for shortener in self.suspicious_domains):
            score += 0.6
        
        # Suspicious TLDs
        if any(domain.endswith(tld) for tld in self.suspicious_tlds):
            score += 0.4
        
        # IP address instead of domain
        if re.match(r'^\d+\.\d+\.\d+\.\d+', domain):
            score += 0.7
        
        # Domain length and complexity
        if len(domain) > 50:
            score += 0.2
        
        # Subdomain count
        subdomain_count = len(domain.split('.'))
        if subdomain_count > 4:
            score += 0.3
        
        return min(max(score, 0.0), 1.0)
    
    def _analyze_url_structure(self, url: str, parsed) -> float:
        """Analyze URL structure for suspicious patterns"""
        score = 0.0
        
        # Suspicious keywords in URL
        suspicious_keywords = ['verify', 'secure', 'account', 'update', 'confirm', 'login']
        url_lower = url.lower()
        keyword_count = sum(1 for keyword in suspicious_keywords if keyword in url_lower)
        score += keyword_count * 0.1
        
        # Excessive hyphens or underscores
        if url.count('-') > 3 or url.count('_') > 3:
            score += 0.2
        
        # URL encoding/obfuscation
        if '%' in url and url.count('%') > 3:
            score += 0.3
        
        # Very long URLs
        if len(url) > 100:
            score += 0.2
        
        # Suspicious file extensions
        suspicious_extensions = ['.exe', '.scr', '.bat', '.com', '.pif']
        if any(ext in url.lower() for ext in suspicious_extensions):
            score += 0.5
        
        return min(score, 1.0)
    
    def _analyze_redirects(self, url: str) -> float:
        """Simulate redirect chain analysis"""
        # In real implementation, this would follow actual redirects
        score = 0.0
        
        # URL shorteners typically redirect
        parsed = urllib.parse.urlparse(url)
        if any(shortener in parsed.netloc for shortener in self.suspicious_domains):
            score += 0.6
        
        # Multiple redirects indicator (simulated)
        if 'redirect' in url.lower() or 'r=' in url or 'url=' in url:
            score += 0.4
        
        return min(score, 1.0)
    
    def _detect_obfuscation(self, url: str, parsed) -> float:
        """Detect URL obfuscation techniques"""
        score = 0.0
        
        # Unicode/IDN homograph attacks
        if any(ord(char) > 127 for char in parsed.netloc):
            score += 0.5
        
        # Suspicious character combinations
        if re.search(r'[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}', parsed.netloc):
            score += 0.4  # IP address
        
        # Base64 or hex encoding patterns
        if re.search(r'[A-Za-z0-9+/]{20,}={0,2}', url) or re.search(r'%[0-9A-Fa-f]{2}', url):
            score += 0.3
        
        # Typosquatting detection (simplified)
        for trusted in self.trusted_domains:
            if self._is_typosquatting(parsed.netloc, trusted):
                score += 0.6
                break
        
        return min(score, 1.0)
    
    def _is_typosquatting(self, domain: str, trusted: str) -> bool:
        """Simple typosquatting detection"""
        if len(domain) != len(trusted):
            return False
        
        # Count character differences
        differences = sum(1 for a, b in zip(domain, trusted) if a != b)
        return 1 <= differences <= 2
    
    def _get_indicators(self, url: str, parsed) -> Dict:
        """Get detailed indicators for explanation"""
        return {
            'is_shortened': any(shortener in parsed.netloc for shortener in self.suspicious_domains),
            'uses_ip_address': bool(re.match(r'^\d+\.\d+\.\d+\.\d+', parsed.netloc)),
            'suspicious_tld': any(parsed.netloc.endswith(tld) for tld in self.suspicious_tlds),
            'long_url': len(url) > 100,
            'excessive_subdomains': len(parsed.netloc.split('.')) > 4,
            'has_suspicious_keywords': any(kw in url.lower() for kw in ['verify', 'secure', 'update']),
            'unicode_characters': any(ord(char) > 127 for char in parsed.netloc),
            'url_encoding': '%' in url and url.count('%') > 3
        }
    
    def trace_redirects(self, url: str) -> List[str]:
        """Simulate redirect chain tracing"""
        # In real implementation, would use requests to follow redirects
        redirects = [url]
        
        # Simulate common redirect patterns
        if any(shortener in url for shortener in self.suspicious_domains):
            redirects.append("http://suspicious-site.com/malware")
        
        return redirects
