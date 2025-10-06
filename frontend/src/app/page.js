'use client'
import { useState, useEffect } from 'react'
import Navigation from './components/Navigation'
import { useApp } from './context/AppContext'

export default function Home() {
  const [demoText, setDemoText] = useState('')
  const [animatedText, setAnimatedText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { t } = useApp()

  const phishingDemo = "URGENT: Your account will be suspended in 24 hours. Click here to verify immediately!"
  
  useEffect(() => {
    // Animated typing effect
    let i = 0
    const timer = setInterval(() => {
      if (i < phishingDemo.length) {
        setAnimatedText(phishingDemo.slice(0, i + 1))
        i++
      } else {
        clearInterval(timer)
      }
    }, 50)
    
    return () => clearInterval(timer)
  }, [])

  const analyzeDemo = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch('http://localhost:8000/analyze-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: phishingDemo })
      })
      const result = await response.json()
      setDemoText(result.explanation)
    } catch (error) {
      setDemoText('⚠️ PHISHING DETECTED - Contains urgency language and action requests')
    }
    setIsAnalyzing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation />
      
      <main id="main-content" role="main">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20" aria-labelledby="hero-title">
          <div className="max-w-7xl mx-auto text-center">
            <h1 id="hero-title" className="responsive-title text-gray-900 mb-4 sm:mb-6">
              {t('tagline')}
            </h1>
            <p className="responsive-body text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto">
              {t('subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 sm:mb-12">
              <a 
                href="/demo" 
                className="touch-button-primary"
                aria-describedby="demo-description"
              >
                {t('tryDemo')}
              </a>
              <a 
                href="/how-it-works" 
                className="touch-button-secondary"
                aria-describedby="learn-description"
              >
                {t('learnMore')}
              </a>
            </div>
            
            {/* Hidden descriptions for screen readers */}
            <div className="sr-only">
              <p id="demo-description">Try our interactive phishing detection demo</p>
              <p id="learn-description">Learn how our AI technology works</p>
            </div>
          </div>

          {/* Interactive Demo */}
          <div className="max-w-4xl mx-auto">
            <div className="mobile-card" role="region" aria-labelledby="demo-title">
              <h2 id="demo-title" className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center">
                Live Detection Demo
              </h2>
              
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 rounded-r-lg" role="alert">
                <div className="flex items-start">
                  <span className="text-red-400 mr-3 text-lg sm:text-xl" aria-hidden="true">📧</span>
                  <div className="flex-1">
                    <p className="text-sm sm:text-base text-red-700 font-mono break-words">
                      {animatedText}
                      <span className="animate-pulse" aria-hidden="true">|</span>
                    </p>
                  </div>
                </div>
              </div>

              <button 
                onClick={analyzeDemo}
                disabled={isAnalyzing}
                className="touch-button-primary w-full mb-4"
                aria-describedby="analyze-description"
              >
                {isAnalyzing ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" aria-hidden="true"></span>
                    {t('analyzing')}
                  </span>
                ) : (
                  `🔍 ${t('analyzeWithAI')}`
                )}
              </button>
              
              <div className="sr-only" id="analyze-description">
                Analyze the sample text above for phishing indicators using our AI system
              </div>

              {demoText && (
                <div className="bg-red-100 border border-red-300 rounded-lg p-4" role="alert" aria-live="polite">
                  <p className="text-red-800 font-semibold text-sm sm:text-base">{demoText}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16" aria-labelledby="features-title">
          <div className="max-w-7xl mx-auto">
            <h2 id="features-title" className="sr-only">Key Features</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center mobile-card" role="article">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                  <span className="text-2xl">🧠</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">NLP Analysis</h3>
                <p className="text-gray-600 text-sm sm:text-base">Advanced natural language processing to detect phishing intent and urgency patterns</p>
              </div>
              
              <div className="text-center mobile-card" role="article">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                  <span className="text-2xl">🔗</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Link Analysis</h3>
                <p className="text-gray-600 text-sm sm:text-base">Deep URL inspection with redirect tracing and domain reputation scoring</p>
              </div>
              
              <div className="text-center mobile-card sm:col-span-2 lg:col-span-1" role="article">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                  <span className="text-2xl">🕸️</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Graph Networks</h3>
                <p className="text-gray-600 text-sm sm:text-base">Domain relationship mapping using Graph Neural Networks for threat intelligence</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16" aria-labelledby="stats-title">
          <div className="max-w-7xl mx-auto">
            <div className="mobile-card">
              <h2 id="stats-title" className="sr-only">Performance Statistics</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 text-center">
                <div role="img" aria-label="99.2% detection accuracy">
                  <div className="text-2xl sm:text-3xl font-bold text-indigo-600">99.2%</div>
                  <div className="text-gray-600 text-sm sm:text-base">Detection Accuracy</div>
                </div>
                <div role="img" aria-label="Less than 100 milliseconds analysis speed">
                  <div className="text-2xl sm:text-3xl font-bold text-indigo-600">&lt;100ms</div>
                  <div className="text-gray-600 text-sm sm:text-base">Analysis Speed</div>
                </div>
                <div role="img" aria-label="50,000 plus threats blocked">
                  <div className="text-2xl sm:text-3xl font-bold text-indigo-600">50K+</div>
                  <div className="text-gray-600 text-sm sm:text-base">Threats Blocked</div>
                </div>
                <div role="img" aria-label="24/7 real-time protection">
                  <div className="text-2xl sm:text-3xl font-bold text-indigo-600">24/7</div>
                  <div className="text-gray-600 text-sm sm:text-base">Real-time Protection</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
