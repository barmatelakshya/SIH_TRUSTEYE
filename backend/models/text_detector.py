import re
from typing import Dict, List
import json
import os

class PhishingTextDetector:
    def __init__(self):
        self.phishing_keywords = [
            'urgent', 'verify', 'suspend', 'click here', 'limited time',
            'act now', 'confirm identity', 'update payment', 'security alert',
            'winner', 'congratulations', 'claim now', 'expires', 'final notice'
        ]
        
        self.urgency_words = ['urgent', 'immediate', 'expires', 'deadline', 'asap', 'now']
        self.financial_words = ['bank', 'credit card', 'payment', 'refund', 'money', 'prize']
        self.action_words = ['click', 'verify', 'confirm', 'update', 'download', 'install']
        
        # Load training data for pattern learning
        self._load_patterns()
        
    def _load_patterns(self):
        """Load common phishing patterns from dataset"""
        try:
            data_path = os.path.join(os.path.dirname(__file__), '..', '..', 'shared')
            
            with open(f"{data_path}/phishing_emails.json", 'r') as f:
                emails = json.load(f)
            with open(f"{data_path}/phishing_sms.json", 'r') as f:
                sms = json.load(f)
            
            # Extract patterns from phishing samples
            self.phishing_patterns = []
            for item in emails + sms:
                if item['label'] == 1:  # Phishing
                    self.phishing_patterns.append(item['text'].lower())
                    
        except FileNotFoundError:
            self.phishing_patterns = []
    
    def analyze_text(self, text: str) -> Dict:
        text_lower = text.lower()
        
        # Enhanced keyword analysis
        keyword_score = self._calculate_keyword_score(text_lower)
        
        # Pattern matching with training data
        pattern_score = self._calculate_pattern_score(text_lower)
        
        # Linguistic features
        linguistic_score = self._analyze_linguistic_features(text)
        
        # Sentiment analysis (simplified)
        sentiment_score = self._analyze_sentiment(text_lower)
        
        # Combined risk assessment
        risk_score = (
            keyword_score * 0.3 + 
            pattern_score * 0.25 + 
            linguistic_score * 0.25 + 
            sentiment_score * 0.2
        )
        
        is_phishing = risk_score > 0.5
        
        return {
            'is_phishing': is_phishing,
            'confidence': min(risk_score, 1.0),
            'risk_score': risk_score,
            'features': {
                'keyword_score': keyword_score,
                'pattern_score': pattern_score,
                'linguistic_score': linguistic_score,
                'sentiment_score': sentiment_score
            },
            'indicators': self._get_indicators(text_lower)
        }
    
    def _calculate_keyword_score(self, text: str) -> float:
        """Calculate score based on phishing keywords"""
        keyword_count = sum(1 for keyword in self.phishing_keywords if keyword in text)
        urgency_count = sum(1 for word in self.urgency_words if word in text)
        financial_count = sum(1 for word in self.financial_words if word in text)
        action_count = sum(1 for word in self.action_words if word in text)
        
        total_score = (keyword_count + urgency_count * 1.5 + 
                      financial_count * 1.2 + action_count * 1.1)
        
        return min(total_score / 10, 1.0)
    
    def _calculate_pattern_score(self, text: str) -> float:
        """Calculate similarity with known phishing patterns"""
        if not self.phishing_patterns:
            return 0.0
        
        max_similarity = 0.0
        for pattern in self.phishing_patterns:
            # Simple word overlap similarity
            text_words = set(text.split())
            pattern_words = set(pattern.split())
            
            if len(pattern_words) > 0:
                similarity = len(text_words & pattern_words) / len(pattern_words)
                max_similarity = max(max_similarity, similarity)
        
        return max_similarity
    
    def _analyze_linguistic_features(self, text: str) -> float:
        """Analyze linguistic features indicative of phishing"""
        score = 0.0
        
        # Excessive punctuation
        if text.count('!') > 2:
            score += 0.2
        
        # ALL CAPS words
        words = text.split()
        caps_ratio = sum(1 for word in words if word.isupper() and len(word) > 2) / max(len(words), 1)
        score += caps_ratio * 0.3
        
        # Suspicious URLs
        if re.search(r'http[s]?://|www\.', text):
            score += 0.2
        
        # Spelling errors (simplified check)
        common_errors = ['recieve', 'seperate', 'occured', 'neccessary']
        if any(error in text.lower() for error in common_errors):
            score += 0.1
        
        return min(score, 1.0)
    
    def _analyze_sentiment(self, text: str) -> float:
        """Simplified sentiment analysis for urgency/fear"""
        fear_words = ['danger', 'risk', 'threat', 'warning', 'alert', 'problem']
        urgency_phrases = ['act now', 'limited time', 'expires soon', 'immediate action']
        
        fear_score = sum(1 for word in fear_words if word in text) * 0.15
        urgency_score = sum(1 for phrase in urgency_phrases if phrase in text) * 0.2
        
        return min(fear_score + urgency_score, 1.0)
    
    def _get_indicators(self, text: str) -> Dict:
        """Get detailed indicators for explanation"""
        return {
            'has_urgency_words': any(word in text for word in self.urgency_words),
            'has_financial_terms': any(word in text for word in self.financial_words),
            'has_action_requests': any(word in text for word in self.action_words),
            'has_links': bool(re.search(r'http[s]?://|www\.', text)),
            'excessive_punctuation': text.count('!') > 2,
            'has_caps_words': any(word.isupper() and len(word) > 2 for word in text.split())
        }
