// Content script for TrustEye extension
console.log('TrustEye content script loaded');

// Scan page for suspicious content
function scanPage() {
    const textContent = document.body.innerText.toLowerCase();
    const phishingPatterns = [
        'urgent action required',
        'verify account immediately',
        'click here now',
        'suspended account'
    ];
    
    let threats = 0;
    phishingPatterns.forEach(pattern => {
        if (textContent.includes(pattern)) {
            threats++;
        }
    });
    
    if (threats > 0) {
        console.log(`TrustEye: ${threats} potential threats detected on this page`);
        
        // Show warning badge
        chrome.runtime.sendMessage({
            action: 'updateBadge',
            text: threats.toString()
        });
    }
}

// Run scan when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scanPage);
} else {
    scanPage();
}
