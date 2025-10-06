'use client'
import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import SwipeableCard from '../components/SwipeableCard'
import ResponsiveChart from '../components/ResponsiveChart'
import ScrollableTable from '../components/ScrollableTable'
import { useApp } from '../context/AppContext'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [threats, setThreats] = useState([])
  const [selectedThreat, setSelectedThreat] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [timeRange, setTimeRange] = useState('24h')
  const { t } = useApp()

  // Mock data for enhanced features
  const mockThreats = [
    { id: 1, timestamp: '2024-10-06 19:30:32', type: 'Phishing Email', source: 'noreply@paypal-security.com', risk: 'HIGH', status: 'Blocked', indicators: ['Urgency language', 'Suspicious domain', 'Fake sender'], ioc: 'paypal-security.com', confidence: 0.95 },
    { id: 2, timestamp: '2024-10-06 19:25:18', type: 'Malicious URL', source: 'bit.ly/bank-verify', risk: 'MEDIUM', status: 'Flagged', indicators: ['URL shortener', 'Banking keywords'], ioc: 'bit.ly/bank-verify', confidence: 0.78 },
    { id: 3, timestamp: '2024-10-06 19:20:45', type: 'Phishing SMS', source: '+1-555-0123', risk: 'HIGH', status: 'Blocked', indicators: ['Prize scam', 'Suspicious link'], ioc: 'win-prize.net', confidence: 0.89 },
    { id: 4, timestamp: '2024-10-06 19:15:12', type: 'Suspicious Domain', source: 'amazon-security.net', risk: 'MEDIUM', status: 'Monitoring', indicators: ['Typosquatting', 'New domain'], ioc: 'amazon-security.net', confidence: 0.67 }
  ]

  const mockMetrics = {
    tpr: 0.952, // True Positive Rate
    fpr: 0.023, // False Positive Rate
    accuracy: 0.987,
    drift: 0.12, // Model drift indicator
    lastUpdate: '2024-10-06 18:00:00'
  }

  const timelineData = [
    { hour: '15:00', threats: 2, blocked: 2 },
    { hour: '16:00', threats: 5, blocked: 4 },
    { hour: '17:00', threats: 3, blocked: 3 },
    { hour: '18:00', threats: 7, blocked: 6 },
    { hour: '19:00', threats: 4, blocked: 4 }
  ]

  useEffect(() => {
    fetchStats()
    setThreats(mockThreats)
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/feedback-stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      setStats({ total_feedback: 1247, correct_predictions: 1235, accuracy: 0.992 })
    }
  }

  const filteredThreats = threats.filter(threat =>
    threat.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
    threat.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    threat.ioc.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'HIGH': return 'text-red-600 bg-red-100'
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100'
      case 'LOW': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="responsive-title text-gray-900 mb-2">Security Dashboard</h1>
          <p className="text-gray-600">Real-time threat monitoring and analysis</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="mobile-card">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">🛡️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Scans</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats?.total_feedback || 0}</p>
              </div>
            </div>
          </div>

          <div className="mobile-card">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Threats</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{threats.filter(t => t.status === 'Blocked').length}</p>
              </div>
            </div>
          </div>

          <div className="mobile-card">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Accuracy</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{((stats?.accuracy || 0.992) * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="mobile-card">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Model TPR</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{(mockMetrics.tpr * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Threat Timeline */}
        <div className="mobile-card mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="touch-input mb-2 sm:mb-0 sm:w-auto"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
            </select>
          </div>
          
          <ResponsiveChart 
            data={timelineData}
            title="📈 Threat Timeline"
            type="bar"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* IOC Explorer */}
          <div className="lg:col-span-2">
            <div className="mobile-card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h2 className="text-xl font-semibold mb-4 sm:mb-0">🔍 IOC Explorer</h2>
                <input
                  type="text"
                  placeholder="Search IOCs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="touch-input sm:w-64"
                />
              </div>
              
              <div className="space-y-4">
                {filteredThreats.map((threat) => (
                  <div 
                    key={threat.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => setSelectedThreat(threat)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                        <span className="text-lg">
                          {threat.type === 'Phishing Email' ? '📧' :
                           threat.type === 'Malicious URL' ? '🔗' :
                           threat.type === 'Phishing SMS' ? '📱' : '🌐'}
                        </span>
                        <div>
                          <h3 className="font-semibold">{threat.type}</h3>
                          <p className="text-sm text-gray-600 break-all">{threat.ioc}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRiskColor(threat.risk)}`}>
                          {threat.risk}
                        </span>
                        <span className="text-sm text-gray-500">{(threat.confidence * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {threat.indicators.slice(0, 2).map((indicator, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {indicator}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Model Metrics & Threat Details */}
          <div className="space-y-6">
            {/* Model Performance */}
            <div className="mobile-card">
              <h2 className="text-xl font-semibold mb-4">📊 Model Metrics</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">True Positive Rate</span>
                  <span className="font-bold text-green-600">{(mockMetrics.tpr * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">False Positive Rate</span>
                  <span className="font-bold text-blue-600">{(mockMetrics.fpr * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Accuracy</span>
                  <span className="font-bold text-green-600">{(mockMetrics.accuracy * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Model Drift</span>
                  <span className={`font-bold ${mockMetrics.drift > 0.2 ? 'text-red-600' : 'text-green-600'}`}>
                    {(mockMetrics.drift * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">Last updated: {mockMetrics.lastUpdate}</p>
                </div>
              </div>
            </div>

            {/* Threat Details */}
            <div className="mobile-card">
              <h2 className="text-xl font-semibold mb-4">🔍 Threat Details</h2>
              {selectedThreat ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Type</label>
                    <p className="text-sm text-gray-900">{selectedThreat.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">IOC</label>
                    <p className="text-sm text-gray-900 font-mono break-all">{selectedThreat.ioc}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Confidence</label>
                    <p className="text-sm text-gray-900">{(selectedThreat.confidence * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Indicators</label>
                    <div className="mt-1 space-y-1">
                      {selectedThreat.indicators.map((indicator, idx) => (
                        <div key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {indicator}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <span className="text-4xl mb-4 block">🔍</span>
                  <p>Select a threat to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
