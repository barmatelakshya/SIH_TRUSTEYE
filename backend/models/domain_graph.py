from typing import Dict, List, Set
import urllib.parse
import json
import os

class DomainGraphAnalyzer:
    """Simulated Graph Neural Network for domain relationship analysis"""
    
    def __init__(self):
        self.domain_graph = {}  # Adjacency list representation
        self.domain_features = {}  # Node features
        self.trust_scores = {}  # Domain trust scores
        
        self._initialize_graph()
    
    def _initialize_graph(self):
        """Initialize domain graph with known relationships"""
        # Trusted domain clusters
        trusted_clusters = [
            ['google.com', 'youtube.com', 'gmail.com', 'googledrive.com'],
            ['microsoft.com', 'outlook.com', 'office.com', 'xbox.com'],
            ['apple.com', 'icloud.com', 'itunes.com', 'appstore.com'],
            ['github.com', 'githubusercontent.com', 'githubassets.com']
        ]
        
        # Build trust relationships
        for cluster in trusted_clusters:
            for domain in cluster:
                self.trust_scores[domain] = 0.9
                self.domain_graph[domain] = set(cluster) - {domain}
        
        # Load suspicious domain patterns
        self._load_suspicious_patterns()
    
    def _load_suspicious_patterns(self):
        """Load suspicious domain patterns from dataset"""
        try:
            data_path = os.path.join(os.path.dirname(__file__), '..', '..', 'shared')
            with open(f"{data_path}/phishing_urls.json", 'r') as f:
                urls = json.load(f)
            
            suspicious_domains = []
            for item in urls:
                if item['label'] == 1:  # Phishing
                    domain = urllib.parse.urlparse(item['url']).netloc
                    suspicious_domains.append(domain)
                    self.trust_scores[domain] = 0.1
            
            # Create suspicious domain cluster
            for domain in suspicious_domains:
                self.domain_graph[domain] = set(suspicious_domains) - {domain}
                
        except FileNotFoundError:
            pass
    
    def analyze_domain_relationships(self, target_domain: str) -> Dict:
        """Analyze domain using graph relationships"""
        
        # Extract features for the domain
        features = self._extract_domain_features(target_domain)
        
        # Find similar domains in graph
        similar_domains = self._find_similar_domains(target_domain, features)
        
        # Calculate trust propagation
        trust_score = self._calculate_trust_propagation(target_domain, similar_domains)
        
        # Detect potential domain squatting
        squatting_risk = self._detect_domain_squatting(target_domain)
        
        # Overall risk assessment
        risk_score = 1.0 - trust_score + squatting_risk * 0.3
        
        return {
            'domain': target_domain,
            'trust_score': trust_score,
            'risk_score': min(risk_score, 1.0),
            'is_suspicious': risk_score > 0.6,
            'similar_domains': list(similar_domains)[:5],  # Top 5
            'squatting_risk': squatting_risk,
            'features': features,
            'graph_analysis': {
                'connected_domains': len(self.domain_graph.get(target_domain, set())),
                'trust_propagation': trust_score,
                'cluster_membership': self._get_cluster_info(target_domain)
            }
        }
    
    def _extract_domain_features(self, domain: str) -> Dict:
        """Extract features for domain similarity"""
        return {
            'length': len(domain),
            'subdomain_count': len(domain.split('.')),
            'has_numbers': any(c.isdigit() for c in domain),
            'has_hyphens': '-' in domain,
            'tld': domain.split('.')[-1] if '.' in domain else '',
            'vowel_ratio': sum(1 for c in domain if c in 'aeiou') / max(len(domain), 1),
            'entropy': self._calculate_entropy(domain)
        }
    
    def _calculate_entropy(self, text: str) -> float:
        """Calculate Shannon entropy of domain name"""
        import math
        
        if not text:
            return 0.0
        
        # Count character frequencies
        char_counts = {}
        for char in text:
            char_counts[char] = char_counts.get(char, 0) + 1
        
        # Calculate entropy
        entropy = 0.0
        text_len = len(text)
        for count in char_counts.values():
            probability = count / text_len
            entropy -= probability * math.log2(probability)
        
        return entropy
    
    def _find_similar_domains(self, target_domain: str, target_features: Dict) -> Set[str]:
        """Find domains with similar features"""
        similar_domains = set()
        
        for domain in self.domain_graph.keys():
            if domain == target_domain:
                continue
            
            domain_features = self._extract_domain_features(domain)
            similarity = self._calculate_feature_similarity(target_features, domain_features)
            
            if similarity > 0.7:  # Similarity threshold
                similar_domains.add(domain)
        
        return similar_domains
    
    def _calculate_feature_similarity(self, features1: Dict, features2: Dict) -> float:
        """Calculate similarity between domain features"""
        similarity = 0.0
        
        # Length similarity
        len_diff = abs(features1['length'] - features2['length'])
        similarity += max(0, 1 - len_diff / 20) * 0.2
        
        # TLD match
        if features1['tld'] == features2['tld']:
            similarity += 0.3
        
        # Structure similarity
        if features1['subdomain_count'] == features2['subdomain_count']:
            similarity += 0.2
        
        # Character pattern similarity
        if features1['has_numbers'] == features2['has_numbers']:
            similarity += 0.1
        
        if features1['has_hyphens'] == features2['has_hyphens']:
            similarity += 0.1
        
        # Entropy similarity
        entropy_diff = abs(features1['entropy'] - features2['entropy'])
        similarity += max(0, 1 - entropy_diff / 3) * 0.1
        
        return similarity
    
    def _calculate_trust_propagation(self, target_domain: str, similar_domains: Set[str]) -> float:
        """Calculate trust score based on graph propagation"""
        if target_domain in self.trust_scores:
            return self.trust_scores[target_domain]
        
        if not similar_domains:
            return 0.5  # Neutral score for unknown domains
        
        # Average trust of similar domains
        trust_sum = 0.0
        count = 0
        
        for domain in similar_domains:
            if domain in self.trust_scores:
                trust_sum += self.trust_scores[domain]
                count += 1
        
        if count == 0:
            return 0.5
        
        return trust_sum / count
    
    def _detect_domain_squatting(self, target_domain: str) -> float:
        """Detect potential typosquatting or domain squatting"""
        squatting_risk = 0.0
        
        # Check against known trusted domains
        trusted_domains = [domain for domain, score in self.trust_scores.items() if score > 0.8]
        
        for trusted in trusted_domains:
            # Simple edit distance check
            if self._is_potential_squatting(target_domain, trusted):
                squatting_risk = max(squatting_risk, 0.8)
        
        return squatting_risk
    
    def _is_potential_squatting(self, domain1: str, domain2: str) -> bool:
        """Check if domain1 might be squatting domain2"""
        # Remove TLD for comparison
        name1 = '.'.join(domain1.split('.')[:-1])
        name2 = '.'.join(domain2.split('.')[:-1])
        
        # Length difference check
        if abs(len(name1) - len(name2)) > 3:
            return False
        
        # Character substitution check
        if len(name1) == len(name2):
            differences = sum(1 for a, b in zip(name1, name2) if a != b)
            return 1 <= differences <= 2
        
        # Character insertion/deletion check
        return self._levenshtein_distance(name1, name2) <= 2
    
    def _levenshtein_distance(self, s1: str, s2: str) -> int:
        """Calculate Levenshtein distance between two strings"""
        if len(s1) < len(s2):
            return self._levenshtein_distance(s2, s1)
        
        if len(s2) == 0:
            return len(s1)
        
        previous_row = list(range(len(s2) + 1))
        for i, c1 in enumerate(s1):
            current_row = [i + 1]
            for j, c2 in enumerate(s2):
                insertions = previous_row[j + 1] + 1
                deletions = current_row[j] + 1
                substitutions = previous_row[j] + (c1 != c2)
                current_row.append(min(insertions, deletions, substitutions))
            previous_row = current_row
        
        return previous_row[-1]
    
    def _get_cluster_info(self, domain: str) -> str:
        """Get cluster membership information"""
        if domain in self.trust_scores:
            if self.trust_scores[domain] > 0.8:
                return "trusted_cluster"
            elif self.trust_scores[domain] < 0.3:
                return "suspicious_cluster"
        
        return "unknown_cluster"
