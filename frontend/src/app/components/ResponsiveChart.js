'use client'
import { useState, useEffect } from 'react'

export default function ResponsiveChart({ data, title, type = 'bar' }) {
  const [animatedData, setAnimatedData] = useState([])

  useEffect(() => {
    // Animate chart on load
    const timer = setTimeout(() => {
      setAnimatedData(data)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [data])

  const maxValue = Math.max(...data.map(d => d.threats || d.value || 0))

  const getBarColor = (value, max) => {
    const intensity = value / max
    if (intensity > 0.7) return 'bg-red-500'
    if (intensity > 0.4) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  if (type === 'bar') {
    return (
      <div className="responsive-chart">
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
          
          <div className="space-y-3">
            {data.map((item, idx) => {
              const animatedValue = animatedData[idx]?.threats || animatedData[idx]?.value || 0
              const percentage = maxValue > 0 ? (animatedValue / maxValue) * 100 : 0
              
              return (
                <div key={idx} className="mobile-chart-bar">
                  <div className="chart-label">
                    {item.hour || item.label}
                  </div>
                  
                  <div className="chart-bar-container">
                    <div className="chart-bar-bg">
                      <div 
                        className={`chart-bar-fill ${getBarColor(animatedValue, maxValue)}`}
                        style={{ 
                          width: `${percentage}%`,
                          transition: 'width 0.8s ease-out'
                        }}
                      >
                        {animatedValue > 0 && (
                          <span className="text-xs font-semibold text-white">
                            {animatedValue}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="chart-value">
                    {item.blocked && `B: ${item.blocked}`}
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Legend */}
          <div className="flex justify-center mt-4 space-x-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded mr-1"></div>
              <span>High</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded mr-1"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
              <span>Low</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Donut chart for mobile
  if (type === 'donut') {
    const total = data.reduce((sum, item) => sum + (item.value || 0), 0)
    let cumulativePercentage = 0

    return (
      <div className="responsive-chart">
        <div className="chart-container flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
          
          {/* Simple donut representation */}
          <div className="relative w-32 h-32 mb-4">
            <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
            {data.map((item, idx) => {
              const percentage = total > 0 ? (item.value / total) * 100 : 0
              const startAngle = cumulativePercentage * 3.6 // Convert to degrees
              cumulativePercentage += percentage
              
              return (
                <div
                  key={idx}
                  className="absolute inset-0 rounded-full border-8 border-transparent"
                  style={{
                    borderTopColor: item.color || ['#ef4444', '#f59e0b', '#10b981'][idx % 3],
                    transform: `rotate(${startAngle}deg)`,
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((percentage * 3.6) * Math.PI / 180)}% ${50 - 50 * Math.sin((percentage * 3.6) * Math.PI / 180)}%)`
                  }}
                />
              )
            })}
            
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold">{total}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="space-y-2">
            {data.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded mr-2"
                    style={{ backgroundColor: item.color || ['#ef4444', '#f59e0b', '#10b981'][idx % 3] }}
                  ></div>
                  <span className="text-sm">{item.label}</span>
                </div>
                <span className="text-sm font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return null
}
