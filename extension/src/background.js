// Simple background script
chrome.runtime.onInstalled.addListener(() => {
    console.log('TrustEye Extension installed');
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'scanText') {
        // Simple phishing detection
        const text = request.text.toLowerCase();
        const phishingPatterns = [
            'urgent action required',
            'verify account immediately', 
            'click here now',
            'suspended account',
            'confirm identity'
        ];
        
        let threatScore = 0;
        phishingPatterns.forEach(pattern => {
            if (text.includes(pattern)) {
                threatScore += 20;
            }
        });
        
        sendResponse({
            isPhishing: threatScore > 30,
            threatScore: Math.min(threatScore, 100)
        });
    }
    return true;
});
