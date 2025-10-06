'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useApp } from '../context/AppContext'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, changeLanguage, highContrast, toggleHighContrast, fontSize, changeFontSize, t } = useApp()

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded">
            <span className="text-xl sm:text-2xl font-bold text-indigo-600" aria-label={t('brand')}>
              🛡️ {t('brand')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="nav-link">{t('home')}</Link>
            <Link href="/how-it-works" className="nav-link">{t('howItWorks')}</Link>
            <Link href="/demo" className="nav-link">{t('demo')}</Link>
            <Link href="/dashboard" className="nav-link">{t('dashboard')}</Link>
            <Link href="/about" className="nav-link">{t('about')}</Link>
            
            {/* Accessibility Controls */}
            <div className="flex items-center space-x-2 border-l pl-4">
              {/* Language Toggle */}
              <select 
                value={language} 
                onChange={(e) => changeLanguage(e.target.value)}
                className="text-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Select language"
              >
                <option value="en">EN</option>
                <option value="hi">हिं</option>
              </select>
              
              {/* High Contrast Toggle */}
              <button
                onClick={toggleHighContrast}
                className="accessibility-btn"
                aria-label="Toggle high contrast mode"
                title="High Contrast"
              >
                {highContrast ? '🌙' : '☀️'}
              </button>
              
              {/* Font Size Toggle */}
              <button
                onClick={() => changeFontSize(fontSize === 'normal' ? 'large' : 'normal')}
                className="accessibility-btn"
                aria-label="Toggle font size"
                title="Font Size"
              >
                {fontSize === 'large' ? 'A-' : 'A+'}
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden mobile-menu-btn"
            aria-expanded={isOpen}
            aria-label="Toggle mobile menu"
          >
            <span className="sr-only">Open main menu</span>
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-gray-600 transition-all ${isOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-gray-600 mt-1 transition-all ${isOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-gray-600 mt-1 transition-all ${isOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="py-4 space-y-2">
            <Link href="/" className="mobile-nav-link" onClick={() => setIsOpen(false)}>
              {t('home')}
            </Link>
            <Link href="/how-it-works" className="mobile-nav-link" onClick={() => setIsOpen(false)}>
              {t('howItWorks')}
            </Link>
            <Link href="/demo" className="mobile-nav-link" onClick={() => setIsOpen(false)}>
              {t('demo')}
            </Link>
            <Link href="/dashboard" className="mobile-nav-link" onClick={() => setIsOpen(false)}>
              {t('dashboard')}
            </Link>
            <Link href="/about" className="mobile-nav-link" onClick={() => setIsOpen(false)}>
              {t('about')}
            </Link>
            
            {/* Mobile Accessibility Controls */}
            <div className="pt-4 border-t space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Language:</span>
                <select 
                  value={language} 
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="text-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">High Contrast:</span>
                <button
                  onClick={toggleHighContrast}
                  className="mobile-accessibility-btn"
                  aria-label="Toggle high contrast"
                >
                  {highContrast ? 'ON' : 'OFF'}
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Large Text:</span>
                <button
                  onClick={() => changeFontSize(fontSize === 'normal' ? 'large' : 'normal')}
                  className="mobile-accessibility-btn"
                  aria-label="Toggle font size"
                >
                  {fontSize === 'large' ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
