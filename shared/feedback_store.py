import json
import os
from datetime import datetime
from typing import Dict, List

class FeedbackStore:
    def __init__(self, feedback_file: str = "shared/feedback.json"):
        self.feedback_file = feedback_file
        self._ensure_file_exists()
    
    def _ensure_file_exists(self):
        """Create feedback file if it doesn't exist"""
        if not os.path.exists(self.feedback_file):
            with open(self.feedback_file, 'w') as f:
                json.dump([], f)
    
    def store_feedback(self, feedback_data: Dict) -> bool:
        """Store user feedback"""
        try:
            # Add timestamp
            feedback_data['timestamp'] = datetime.now().isoformat()
            
            # Load existing feedback
            with open(self.feedback_file, 'r') as f:
                feedback_list = json.load(f)
            
            # Add new feedback
            feedback_list.append(feedback_data)
            
            # Save back to file
            with open(self.feedback_file, 'w') as f:
                json.dump(feedback_list, f, indent=2)
            
            return True
        except Exception as e:
            print(f"Error storing feedback: {e}")
            return False
    
    def get_feedback_stats(self) -> Dict:
        """Get feedback statistics"""
        try:
            with open(self.feedback_file, 'r') as f:
                feedback_list = json.load(f)
            
            total_feedback = len(feedback_list)
            correct_predictions = sum(1 for f in feedback_list if f.get('correct_prediction', False))
            
            return {
                'total_feedback': total_feedback,
                'correct_predictions': correct_predictions,
                'accuracy': correct_predictions / total_feedback if total_feedback > 0 else 0,
                'recent_feedback': feedback_list[-5:] if feedback_list else []
            }
        except:
            return {'total_feedback': 0, 'correct_predictions': 0, 'accuracy': 0, 'recent_feedback': []}
    
    def get_all_feedback(self) -> List[Dict]:
        """Get all feedback for analysis"""
        try:
            with open(self.feedback_file, 'r') as f:
                return json.load(f)
        except:
            return []
