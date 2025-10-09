// Test script to verify frontend-backend integration
const API_BASE_URL = 'http://localhost:5001/api';

async function testIntegration() {
    console.log('🧪 Testing TrustEye Integration...\n');
    
    // Test 1: Text Analysis
    try {
        const textResponse = await fetch(`${API_BASE_URL}/scan/text`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: 'urgent action required verify account immediately' })
        });
        const textResult = await textResponse.json();
        console.log('✅ Text Analysis:', textResult);
    } catch (error) {
        console.log('❌ Text Analysis Failed:', error.message);
    }
    
    // Test 2: URL Analysis
    try {
        const urlResponse = await fetch(`${API_BASE_URL}/scan/url`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: 'http://bit.ly/suspicious-bank.com' })
        });
        const urlResult = await urlResponse.json();
        console.log('✅ URL Analysis:', urlResult);
    } catch (error) {
        console.log('❌ URL Analysis Failed:', error.message);
    }
    
    console.log('\n🎉 Integration test completed!');
}

// Run in Node.js environment
if (typeof require !== 'undefined') {
    const fetch = require('node-fetch');
    testIntegration();
}
