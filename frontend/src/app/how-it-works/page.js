'use client'
import Link from 'next/link'

export default function HowItWorks() {
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
              <Link href="/demo" className="text-gray-700 hover:text-indigo-600">Demo</Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600">Dashboard</Link>
              <Link href="/about" className="text-gray-700 hover:text-indigo-600">About</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How PhishGuard Works</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered system uses three advanced modules to detect phishing attempts with 99.2% accuracy
          </p>
        </div>

        {/* Architecture Overview */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">System Architecture</h2>
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-8 rounded-lg">
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="bg-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center mb-2">
                    📝
                  </div>
                  <div className="font-semibold">Input</div>
                  <div className="text-sm text-gray-600">Email/SMS/URL</div>
                </div>
                
                <div className="text-2xl text-gray-400">→</div>
                
                <div className="text-center">
                  <div className="bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center mb-2">
                    🧠
                  </div>
                  <div className="font-semibold">AI Analysis</div>
                  <div className="text-sm text-gray-600">NLP + CNN + GNN</div>
                </div>
                
                <div className="text-2xl text-gray-400">→</div>
                
                <div className="text-center">
                  <div className="bg-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center mb-2">
                    🛡️
                  </div>
                  <div className="font-semibold">Protection</div>
                  <div className="text-sm text-gray-600">Block/Allow</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NLP Module */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center mr-3">🧠</span>
                NLP Analysis Module
              </h3>
              <p className="text-gray-600 mb-4">
                Advanced Natural Language Processing analyzes text content for phishing indicators:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Urgency detection</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Sentiment analysis</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Keyword pattern matching</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Linguistic feature extraction</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="text-center mb-4 font-semibold">Text Processing Pipeline</div>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded shadow-sm">📝 Text Input</div>
                <div className="text-center">↓</div>
                <div className="bg-white p-3 rounded shadow-sm">🔤 Tokenization</div>
                <div className="text-center">↓</div>
                <div className="bg-white p-3 rounded shadow-sm">📊 Feature Extraction</div>
                <div className="text-center">↓</div>
                <div className="bg-white p-3 rounded shadow-sm">🎯 Risk Scoring</div>
              </div>
            </div>
          </div>
        </div>

        {/* CNN Module */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="text-center mb-4 font-semibold">URL Analysis Pipeline</div>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded shadow-sm">🔗 URL Input</div>
                <div className="text-center">↓</div>
                <div className="bg-white p-3 rounded shadow-sm">🔍 Structure Analysis</div>
                <div className="text-center">↓</div>
                <div className="bg-white p-3 rounded shadow-sm">🌐 Domain Lookup</div>
                <div className="text-center">↓</div>
                <div className="bg-white p-3 rounded shadow-sm">⚠️ Risk Assessment</div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4 flex items-center">
                <span className="bg-green-100 text-green-600 w-10 h-10 rounded-full flex items-center justify-center mr-3">🔗</span>
                Link Analysis Module
              </h3>
              <p className="text-gray-600 mb-4">
                Convolutional Neural Networks analyze URL structure and domain patterns:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>URL shortener detection</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Domain reputation scoring</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Redirect chain tracing</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Typosquatting detection</li>
              </ul>
            </div>
          </div>
        </div>

        {/* GNN Module */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4 flex items-center">
                <span className="bg-purple-100 text-purple-600 w-10 h-10 rounded-full flex items-center justify-center mr-3">🕸️</span>
                Graph Neural Network
              </h3>
              <p className="text-gray-600 mb-4">
                Graph Neural Networks map domain relationships for advanced threat intelligence:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Domain clustering</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Trust propagation</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Relationship mapping</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Network analysis</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="text-center mb-4 font-semibold">Domain Graph Analysis</div>
              <div className="relative">
                <div className="flex justify-center items-center space-x-4 mb-4">
                  <div className="bg-green-400 w-8 h-8 rounded-full"></div>
                  <div className="border-t-2 border-gray-300 w-8"></div>
                  <div className="bg-red-400 w-8 h-8 rounded-full"></div>
                </div>
                <div className="flex justify-center items-center space-x-4">
                  <div className="bg-green-400 w-8 h-8 rounded-full"></div>
                  <div className="border-t-2 border-gray-300 w-8"></div>
                  <div className="bg-yellow-400 w-8 h-8 rounded-full"></div>
                  <div className="border-t-2 border-gray-300 w-8"></div>
                  <div className="bg-red-400 w-8 h-8 rounded-full"></div>
                </div>
                <div className="text-center mt-4 text-sm text-gray-600">
                  <span className="inline-block w-3 h-3 bg-green-400 rounded-full mr-1"></span>Trusted
                  <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full mr-1 ml-3"></span>Unknown
                  <span className="inline-block w-3 h-3 bg-red-400 rounded-full mr-1 ml-3"></span>Suspicious
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg p-8">
          <h3 className="text-2xl font-semibold mb-6 text-center">Performance Metrics</h3>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">99.2%</div>
              <div className="text-indigo-100">Accuracy</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">0.1%</div>
              <div className="text-indigo-100">False Positives</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">&lt;100ms</div>
              <div className="text-indigo-100">Response Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-indigo-100">Monitoring</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
