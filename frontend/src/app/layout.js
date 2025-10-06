import './globals.css'
import { AppProvider } from './context/AppContext'

export const metadata = {
  title: 'PhishGuard - AI-Powered Phishing Detection',
  description: 'Advanced AI-powered protection against phishing attacks using NLP, CNN, and Graph Neural Networks',
  keywords: 'phishing detection, cybersecurity, AI, machine learning, SIH 2024',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes',
  themeColor: '#4f46e5',
  manifest: '/manifest.json'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="theme-color" content="#4f46e5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PhishGuard" />
        
        {/* Accessibility */}
        <meta name="color-scheme" content="light dark" />
        
        {/* Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      </head>
      <body className="antialiased">
        <AppProvider>
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
        </AppProvider>
        
        {/* Skip to main content for screen readers */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-indigo-600 text-white px-4 py-2 rounded z-50"
        >
          Skip to main content
        </a>
      </body>
    </html>
  )
}
