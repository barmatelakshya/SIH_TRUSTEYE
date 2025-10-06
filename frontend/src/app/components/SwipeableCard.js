'use client'
import { useState, useRef } from 'react'

export default function SwipeableCard({ threat, onSelect, onDelete, onFlag }) {
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const cardRef = useRef(null)
  const startX = useRef(0)

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX
    setIsDragging(true)
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return
    
    const currentX = e.touches[0].clientX
    const diff = startX.current - currentX
    
    // Only allow left swipe (positive offset)
    if (diff > 0) {
      setSwipeOffset(Math.min(diff, 120))
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    
    if (swipeOffset > 60) {
      // Keep actions visible
      setSwipeOffset(120)
    } else {
      // Snap back
      setSwipeOffset(0)
    }
  }

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'HIGH': return 'text-red-600 bg-red-100'
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100'
      case 'LOW': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="relative overflow-hidden rounded-lg border bg-white">
      {/* Swipe Actions Background */}
      <div 
        className="absolute right-0 top-0 h-full flex items-center px-4 space-x-2 bg-red-500"
        style={{ width: '120px' }}
      >
        <button
          onClick={() => onFlag?.(threat.id)}
          className="p-2 bg-yellow-500 text-white rounded-full"
          aria-label="Flag threat"
        >
          🚩
        </button>
        <button
          onClick={() => onDelete?.(threat.id)}
          className="p-2 bg-red-600 text-white rounded-full"
          aria-label="Delete threat"
        >
          🗑️
        </button>
      </div>

      {/* Main Card Content */}
      <div
        ref={cardRef}
        className="relative bg-white p-4 cursor-pointer transition-transform"
        style={{
          transform: `translateX(-${swipeOffset}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => swipeOffset === 0 && onSelect?.(threat)}
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
        
        <div className="flex flex-wrap gap-1 mb-2">
          {threat.indicators.slice(0, 2).map((indicator, idx) => (
            <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
              {indicator}
            </span>
          ))}
          {threat.indicators.length > 2 && (
            <span className="text-gray-500 text-xs">+{threat.indicators.length - 2} more</span>
          )}
        </div>
        
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{threat.timestamp}</span>
          <span className="text-indigo-600">Swipe left for actions →</span>
        </div>
      </div>
    </div>
  )
}
