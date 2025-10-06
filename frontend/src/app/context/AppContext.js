'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

const translations = {
  en: {
    brand: 'PhishGuard',
    tagline: 'AI-Powered Phishing Detection',
    subtitle: 'Protect yourself from cyber threats with advanced machine learning',
    home: 'Home',
    howItWorks: 'How It Works',
    demo: 'Demo',
    dashboard: 'Dashboard',
    about: 'About',
    tryDemo: 'Try Demo',
    learnMore: 'Learn More',
    analyzeWithAI: 'Analyze with AI',
    analyzing: 'Analyzing...',
    phishingDetected: 'PHISHING DETECTED',
    safe: 'SAFE',
    highRisk: 'HIGH RISK',
    mediumRisk: 'MEDIUM RISK',
    lowRisk: 'LOW RISK'
  },
  hi: {
    brand: 'फिशगार्ड',
    tagline: 'AI-संचालित फिशिंग डिटेक्शन',
    subtitle: 'उन्नत मशीन लर्निंग के साथ साइबर खतरों से अपनी सुरक्षा करें',
    home: 'होम',
    howItWorks: 'कैसे काम करता है',
    demo: 'डेमो',
    dashboard: 'डैशबोर्ड',
    about: 'हमारे बारे में',
    tryDemo: 'डेमो आज़माएं',
    learnMore: 'और जानें',
    analyzeWithAI: 'AI से विश्लेषण करें',
    analyzing: 'विश्लेषण कर रहे हैं...',
    phishingDetected: 'फिशिंग का पता चला',
    safe: 'सुरक्षित',
    highRisk: 'उच्च जोखिम',
    mediumRisk: 'मध्यम जोखिम',
    lowRisk: 'कम जोखिम'
  }
}

export function AppProvider({ children }) {
  const [language, setLanguage] = useState('en')
  const [highContrast, setHighContrast] = useState(false)
  const [fontSize, setFontSize] = useState('normal')

  useEffect(() => {
    // Load saved preferences
    const savedLang = localStorage.getItem('language') || 'en'
    const savedContrast = localStorage.getItem('highContrast') === 'true'
    const savedFontSize = localStorage.getItem('fontSize') || 'normal'
    
    setLanguage(savedLang)
    setHighContrast(savedContrast)
    setFontSize(savedFontSize)
    
    // Apply accessibility settings
    document.documentElement.classList.toggle('high-contrast', savedContrast)
    document.documentElement.classList.toggle('large-text', savedFontSize === 'large')
  }, [])

  const changeLanguage = (lang) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const toggleHighContrast = () => {
    const newContrast = !highContrast
    setHighContrast(newContrast)
    localStorage.setItem('highContrast', newContrast)
    document.documentElement.classList.toggle('high-contrast', newContrast)
  }

  const changeFontSize = (size) => {
    setFontSize(size)
    localStorage.setItem('fontSize', size)
    document.documentElement.classList.toggle('large-text', size === 'large')
  }

  const t = (key) => translations[language][key] || key

  return (
    <AppContext.Provider value={{
      language,
      changeLanguage,
      highContrast,
      toggleHighContrast,
      fontSize,
      changeFontSize,
      t
    }}>
      {children}
    </AppContext.Provider>
  )
}
