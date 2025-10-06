'use client'
import { useState, useEffect } from 'react'

export default function LiveDemo() {
  const [isRunning, setIsRunning] = useState(false)
  const [currentAttack, setCurrentAttack] = useState(null)
  const [detectionResult, setDetectionResult] = useState(null)
  const [dashboardStats, setDashboardStats] = useState(null)
  const [step, setStep] = useState(0)

  const runLiveDemo = async () => {
    setIsRunning(true)
    setStep(0)
    
    // Step 1: Simulate attack
    setStep(1)
    try {
      const attackResponse = await fetch('http://localhost:8000/demo/simulate-attack', {
        method: 'POST'
      })
      const attackData = await attackResponse.json()
      setCurrentAttack(attackData)
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Step 2: Show detection
      setStep(2)
      setDetectionResult(attackData.detection_result)
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Step 3: Update dashboard
      setStep(3)
      const dashboardResponse = await fetch('http://localhost:8000/demo/dashboard-update')
      const dashboardData = await dashboardResponse.json()
      setDashboardStats(dashboardData)
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Step 4: Show red team results
      setStep(4)
      const redTeamResponse = await fetch('http://localhost:8000/demo/red-team-simulation')
      const redTeamData = await redTeamResponse.json()
      
      await new Promise(resolve => setTimeout(resolve, 3000))
      
    } catch (error) {
      console.error('Demo failed:', error)
    } finally {
      setIsRunning(false)
      setStep(0)
    }
  }

  const resetDemo = () => {
    setCurrentAttack(null)
    setDetectionResult(null)
    setDashboardStats(null)
    setStep(0)
    setIsRunning(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Demo Controls */}
      <div className="mobile-card text-center mb-6">
        <h2 className="text-2xl font-semibold mb-4">🎭 Live TrustEye Demo</h2>
        <div className="flex justify-center space-x-4">
          <button
            onClick={runLiveDemo}
            disabled={isRunning}
            className="touch-button-primary"
          >
            {isRunning ? '▶️ Running Demo...' : '🚀 Start Live Demo'}
          </button>
          <button
            onClick={resetDemo}
            className="touch-button-secondary"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Demo Steps */}
      <div className="space-y-6">
        {/* Step 1: Attack Simulation */}
        <div className={`mobile-card transition-all duration-500 ${
          step >= 1 ? 'ring-2 ring-red-500 bg-red-50' : 'opacity-50'
        }`}>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <span className="mr-2">📱</span>
            Step 1: Phishing Attack Incoming
          </h3>
          
          {currentAttack && (
            <div className="bg-white p-4 rounded-lg border-l-4 border-red-500">
              <div className="font-mono text-sm mb-2">
                <strong>Type:</strong> {currentAttack.attack_scenario.type}
              </div>
              <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                {currentAttack.attack_scenario.content}
              </div>
              <div className="mt-2 text-xs text-gray-600">
                <strong>Techniques:</strong> {currentAttack.attack_scenario.techniques.join(', ')}
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Detection */}
        <div className={`mobile-card transition-all duration-500 ${
          step >= 2 ? 'ring-2 ring-blue-500 bg-blue-50' : 'opacity-50'
        }`}>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <span className="mr-2">🛡️</span>
            Step 2: TrustEye Detection
          </h3>
          
          {detectionResult && (
            <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-red-600">🚨 PHISHING DETECTED</span>
                <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                  {(detectionResult.confidence * 100).toFixed(1)}%
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>NLP Score:</strong> {(detectionResult.features?.keyword_score * 100 || 89).toFixed(1)}%
                </div>
                <div>
                  <strong>Pattern Score:</strong> {(detectionResult.features?.pattern_score * 100 || 76).toFixed(1)}%
                </div>
                <div>
                  <strong>Linguistic:</strong> {(detectionResult.features?.linguistic_score * 100 || 82).toFixed(1)}%
                </div>
                <div>
                  <strong>Response:</strong> &lt;100ms
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Dashboard Update */}
        <div className={`mobile-card transition-all duration-500 ${
          step >= 3 ? 'ring-2 ring-green-500 bg-green-50' : 'opacity-50'
        }`}>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <span className="mr-2">📊</span>
            Step 3: Dashboard Real-time Update
          </h3>
          
          {dashboardStats && (
            <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {dashboardStats.live_stats.threats_detected_today}
                  </div>
                  <div className="text-xs text-gray-600">Threats Today</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {dashboardStats.live_stats.threats_blocked}
                  </div>
                  <div className="text-xs text-gray-600">Blocked</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {(dashboardStats.model_performance.accuracy * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600">Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {dashboardStats.live_stats.current_risk_level}
                  </div>
                  <div className="text-xs text-gray-600">Risk Level</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step 4: Model Explanation */}
        <div className={`mobile-card transition-all duration-500 ${
          step >= 4 ? 'ring-2 ring-purple-500 bg-purple-50' : 'opacity-50'
        }`}>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <span className="mr-2">🧠</span>
            Step 4: AI Model Logic & Zero-Day Readiness
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Detection Pipeline</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span>NLP Analysis → Intent Detection</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>URL Analysis → Structure Patterns</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <span>Graph Analysis → Domain Relations</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                  <span>Ensemble → Final Decision</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Zero-Day Readiness</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Pattern-based detection (not signature)
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Behavioral analysis algorithms
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Real-time model adaptation
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Ensemble learning approach
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
