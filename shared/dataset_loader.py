import json
import os
from typing import List, Dict, Tuple

class DatasetLoader:
    def __init__(self, data_dir: str = "shared"):
        self.data_dir = data_dir
    
    def load_emails(self) -> List[Dict]:
        """Load phishing email dataset"""
        with open(f"{self.data_dir}/phishing_emails.json", 'r') as f:
            return json.load(f)
    
    def load_sms(self) -> List[Dict]:
        """Load phishing SMS dataset"""
        with open(f"{self.data_dir}/phishing_sms.json", 'r') as f:
            return json.load(f)
    
    def load_urls(self) -> List[Dict]:
        """Load phishing URL dataset"""
        with open(f"{self.data_dir}/phishing_urls.json", 'r') as f:
            return json.load(f)
    
    def get_text_data(self) -> Tuple[List[str], List[int]]:
        """Get combined text data for training"""
        emails = self.load_emails()
        sms = self.load_sms()
        
        texts = []
        labels = []
        
        for item in emails + sms:
            texts.append(item['text'])
            labels.append(item['label'])
        
        return texts, labels
    
    def get_url_data(self) -> Tuple[List[str], List[int]]:
        """Get URL data for training"""
        urls = self.load_urls()
        
        url_list = []
        labels = []
        
        for item in urls:
            url_list.append(item['url'])
            labels.append(item['label'])
        
        return url_list, labels
    
    def get_stats(self) -> Dict:
        """Get dataset statistics"""
        emails = self.load_emails()
        sms = self.load_sms()
        urls = self.load_urls()
        
        return {
            'total_samples': len(emails) + len(sms) + len(urls),
            'emails': {
                'total': len(emails),
                'phishing': sum(1 for e in emails if e['label'] == 1),
                'legitimate': sum(1 for e in emails if e['label'] == 0)
            },
            'sms': {
                'total': len(sms),
                'phishing': sum(1 for s in sms if s['label'] == 1),
                'legitimate': sum(1 for s in sms if s['label'] == 0)
            },
            'urls': {
                'total': len(urls),
                'phishing': sum(1 for u in urls if u['label'] == 1),
                'legitimate': sum(1 for u in urls if u['label'] == 0)
            }
        }
