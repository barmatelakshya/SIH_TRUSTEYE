'use client'
import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'

export default function DemoFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [demoData, setDemoData] = useState({})

  const demoSteps = [
    {
      title: "📱 Phishing SMS Received",
      description: "Attacker sends malicious SMS",
      content: "URGENT: Your bank account has been compromised! Click here immediately to secure: bit.ly/secure-bank-2024",
      type: "sms"
    },
    {
      title: "🛡️ Extension Detection",
      description: "TrustEye extension flags the threat",
      content: "⚠️ PHISHING DETECTED\nConfidence: 94.2%\nIndicators: Urgency language, URL shortener, Banking impersonation",
      type: "alert"
    },
    {
      title: "📊 Dashboard Update",
      description: "Real-time threat appears on dashboard",
      content: "New threat logged: SMS Phishing\nRisk Level: HIGH\nIOC: bit.ly/secure-bank-2024",
      type: "dashboard"
    },
    {
      title: "🧠 Model Explanation",
      description: "AI reasoning breakdown",
      content: "NLP Analysis: 89% phishing probability\nURL Analysis: 96% suspicious\nDomain Graph: Known malicious cluster\nZero-day ready: Pattern-based detection",
      type: "analysis"
    },
    {
      title: "⚔️ Red Team Simulation",
      description: "Attacker vs TrustEye battle",
      content: "Attacker tries 5 evasion techniques\nTrustEye blocks: 4/5 attempts\nSuccess rate: 80%\nAdaptive learning: Enabled",
      type: "redteam"
    }
  ]

  const startDemo = () => {
    setIsPlaying(true)
    setCurrentStep(0)
    playStep(0)
  }

  const playStep = (step) => {
    if (step < demoSteps.length) {
      setTimeout(() => {
        setCurrentStep(step)
        if (step < demoSteps.length - 1) {
          setTimeout(() => playStep(step + 1), 3000)
        } else {
          setIsPlaying(false)
        }
      }, 500)
    }
  }

  const getStepIcon = (type) => {
    switch (type) {
      case 'sms': return '📱'
      case 'alert': return '🚨'
      case 'dashboard': return '📊'
      case 'analysis': return '🧠'
      case 'redteam': return '⚔️'
      default: return '🔍'
    }
  }

  const getStepColor = (type) => {
    switch (type) {
      case 'sms': return 'bg-blue-500'
      case 'alert': return 'bg-red-500'
      case 'dashboard': return 'bg-green-500'
      case 'analysis': return 'bg-purple-500'
      case 'redteam': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="responsive-title text-gray-900 mb-4">🎭 TrustEye Demo Flow</h1>
          <p className="text-gray-600 mb-6">Interactive demonstration of complete threat detection pipeline</p>
          
          <button
            onClick={startDemo}
            disabled={isPlaying}
            className="touch-button-primary"
          >
            {isPlaying ? '▶️ Demo Running...' : '🚀 Start Demo'}
          </button>
        </div>

        {/* Demo Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            
            {demoSteps.map((step, index) => (
              <div
                key={index}
                className={`relative flex items-start mb-8 transition-all duration-500 ${
                  currentStep >= index ? 'opacity-100' : 'opacity-30'
                }`}
              >
                {/* Timeline Dot */}
                <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full ${
                  currentStep >= index ? getStepColor(step.type) : 'bg-gray-300'
                } text-white text-2xl`}>
                  {getStepIcon(step.type)}
                </div>
                
                {/* Content Card */}
                <div className={`ml-6 flex-1 mobile-card transition-all duration-500 ${
                  currentStep === index ? 'ring-2 ring-blue-500 scale-105' : ''
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <span className="text-sm text-gray-500">Step {index + 1}</span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{step.description}</p>
                  
                  <div className={`p-4 rounded-lg font-mono text-sm ${
                    step.type === 'sms' ? 'bg-blue-50 border-l-4 border-blue-500' :
                    step.type === 'alert' ? 'bg-red-50 border-l-4 border-red-500' :
                    step.type === 'dashboard' ? 'bg-green-50 border-l-4 border-green-500' :
                    step.type === 'analysis' ? 'bg-purple-50 border-l-4 border-purple-500' :
                    'bg-orange-50 border-l-4 border-orange-500'
                  }`}>
                    {step.content.split('\n').map((line, i) => (
                      <div key={i} className="mb-1">{line}</div>
                    ))}
                  </div>
                  
                  {currentStep === index && (
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => setCurrentStep(Math.max(0, index - 1))}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm"
                        disabled={index === 0}
                      >
                        ← Previous
                      </button>
                      <button
                        onClick={() => setCurrentStep(Math.min(demoSteps.length - 1, index + 1))}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                        disabled={index === demoSteps.length - 1}
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Explanation */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="mobile-card">
              <h3 className="text-xl font-semibold mb-4">🧠 AI Model Logic</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>NLP Confidence:</span>
                  <span className="font-mono">89.3%</span>
                </div>
                <div className="flex justify-between">
                  <span>URL Risk Score:</span>
                  <span className="font-mono">96.1%</span>
                </div>
                <div className="flex justify-between">
                  <span>Domain Reputation:</span>
                  <span className="font-mono">12.4%</span>
                </div>
                <div className="flex justify-between">
                  <span>Combined Score:</span>
                  <span className="font-mono font-bold">94.2%</span>
                </div>
              </div>
            </div>

            <div className="mobile-card">
              <h3 className="text-xl font-semibold mb-4">🛡️ Zero-Day Readiness</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Pattern-based detection
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Behavioral analysis
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Adaptive learning
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Real-time updates
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Red Team Simulation */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="mobile-card">
            <h3 className="text-xl font-semibold mb-4">⚔️ Red Team vs TrustEye</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-red-600 mb-3">🔴 Attacker Techniques</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                    <span>URL Obfuscation</span>
                    <span className="text-red-600">❌ Blocked</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                    <span>Domain Spoofing</span>
                    <span className="text-red-600">❌ Blocked</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                    <span>Social Engineering</span>
                    <span className="text-red-600">❌ Blocked</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                    <span>Typosquatting</span>
                    <span className="text-red-600">❌ Blocked</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                    <span>Zero-Day Exploit</span>
                    <span className="text-yellow-600">⚠️ Partial</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-blue-600 mb-3">🔵 TrustEye Defense</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <span>Detection Rate</span>
                    <span className="font-mono">80%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <span>Response Time</span>
                    <span className="font-mono">&lt;100ms</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <span>False Positives</span>
                    <span className="font-mono">2.3%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <span>Adaptation Speed</span>
                    <span className="font-mono">Real-time</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span>Overall Score</span>
                    <span className="font-mono font-bold text-green-600">A+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Controls */}
        <div className="max-w-4xl mx-auto mt-8 text-center">
          <div className="mobile-card">
            <h3 className="text-lg font-semibold mb-4">Demo Controls</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setCurrentStep(0)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                🔄 Reset Demo
              </button>
              <button
                onClick={startDemo}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                ▶️ Auto Play
              </button>
              <a
                href="/dashboard"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                📊 View Dashboard
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
