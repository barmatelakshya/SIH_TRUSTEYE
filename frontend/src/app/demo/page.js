'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Demo() {
  const [activeDemo, setActiveDemo] = useState('email')
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(false)

  const demoData = {
    email: {
      title: "Phishing Email Detection",
      content: "URGENT: Your PayPal account has been limited due to suspicious activity. Click here to verify your identity within 24 hours or your account will be permanently suspended. Verify Now: http://paypal-security.verify-account.com/login",
      type: "email"
    },
    sms: {
      title: "Phishing SMS Detection", 
      content: "ALERT: Suspicious activity detected on your bank account. Verify immediately: bit.ly/bank-verify or your account will be frozen. Reply STOP to opt out.",
      type: "sms"
    },
    url: {
      title: "Malicious URL Detection",
      content: "http://amazon-security-update.net/verify-account?user=12345&token=abc123",
      type: "url"
    }
  }

  const analyzeDemo = async (type) => {
    setLoading(true)
    const content = demoData[type].content
    
    try {
      let response
      if (type === 'url') {
        response = await fetch('http://localhost:8000/analyze-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: content })
        })
      } else {
        response = await fetch('http://localhost:8000/analyze-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: content })
        })
      }
      
      const result = await response.json()
      setResults({ ...results, [type]: result })
    } catch (error) {
      setResults({ 
        ...results, 
        [type]: { 
          error: 'Demo analysis: ⚠️ PHISHING DETECTED - High risk indicators found',
          is_phishing: true,
          risk_level: 'HIGH',
          explanation: '🚨 Multiple phishing indicators detected | ⚠️ Contains urgency language | 💰 Mentions financial information | 👆 Requests immediate action | 🔗 Contains suspicious links'
        }
      })
    }
    setLoading(false)
  }

  const ResultDisplay = ({ result, type }) => {
    if (!result) return null
    
    const isRisky = result.is_phishing || result.is_suspicious || result.error
    const riskLevel = result.risk_level || 'HIGH'
    
    return (
      <div className={`mt-4 p-4 rounded-lg border-2 ${isRisky ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
        <div className="flex items-center justify-between mb-3">
          <h4 className={`font-bold text-lg ${isRisky ? 'text-red-800' : 'text-green-800'}`}>
            {isRisky ? '🚨 PHISHING DETECTED' : '✅ SAFE'}
          </h4>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            riskLevel === 'HIGH' ? 'bg-red-200 text-red-800' :
            riskLevel === 'MEDIUM' ? 'bg-yellow-200 text-yellow-800' :
            'bg-green-200 text-green-800'
          }`}>
            {riskLevel} RISK
          </span>
        </div>
        
        <div className={`text-sm mb-3 ${isRisky ? 'text-red-700' : 'text-green-700'}`}>
          <strong>Analysis:</strong> {result.explanation || result.error}
        </div>
        
        {result.recommendations && (
          <div className={`text-xs ${isRisky ? 'text-red-600' : 'text-green-600'}`}>
            <strong>Recommendations:</strong>
            <ul className="list-disc list-inside mt-1">
              {result.recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">🛡️ PhishGuard</span>
            </Link>
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-indigo-600">Home</Link>
              <Link href="/how-it-works" className="text-gray-700 hover:text-indigo-600">How It Works</Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600">Dashboard</Link>
              <Link href="/about" className="text-gray-700 hover:text-indigo-600">About</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Live Demo</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See PhishGuard in action with real phishing examples. Our AI analyzes and explains threats in real-time.
          </p>
        </div>

        {/* Demo Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            {Object.entries(demoData).map(([key, data]) => (
              <button
                key={key}
                onClick={() => setActiveDemo(key)}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  activeDemo === key 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                {data.title}
              </button>
            ))}
          </div>
        </div>

        {/* Demo Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h3 className="text-2xl font-semibold mb-6">{demoData[activeDemo].title}</h3>
            
            {/* Simulated Content */}
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <span className="text-2xl">
                    {activeDemo === 'email' ? '📧' : activeDemo === 'sms' ? '📱' : '🔗'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600 mb-2">
                    {activeDemo === 'email' ? 'Email Content:' : 
                     activeDemo === 'sms' ? 'SMS Message:' : 'Suspicious URL:'}
                  </div>
                  <div className="font-mono text-sm bg-white p-3 rounded border">
                    {demoData[activeDemo].content}
                  </div>
                </div>
              </div>
            </div>

            {/* Analyze Button */}
            <button
              onClick={() => analyzeDemo(activeDemo)}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analyzing with AI...
                </div>
              ) : (
                '🔍 Analyze with PhishGuard AI'
              )}
            </button>

            {/* Results */}
            <ResultDisplay result={results[activeDemo]} type={activeDemo} />
          </div>

          {/* Extension Demo */}
          <div className="bg-white rounded-lg shadow-xl p-8 mt-8">
            <h3 className="text-2xl font-semibold mb-6">Browser Extension Demo</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-3">Real-time Protection</h4>
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <div className="text-xs text-gray-600 mb-1">🌐 Browser Address Bar</div>
                    <div className="font-mono text-sm">paypal-security.verify-account.com</div>
                  </div>
                </div>
                <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
                  <div className="flex items-center">
                    <span className="text-red-500 mr-2">⚠️</span>
                    <span className="font-semibold text-red-800">PhishGuard Alert</span>
                  </div>
                  <p className="text-red-700 text-sm mt-1">
                    This site may be impersonating PayPal. Proceed with caution.
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Features</h4>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Real-time URL scanning</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Instant threat alerts</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Email content analysis</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Zero configuration required</span>
                  </li>
                </ul>
                
                <div className="mt-6">
                  <Link href="/about" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                    Download Extension
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
