'use client'
import { useState } from 'react'

export default function ScrollableTable({ data, columns, onRowClick, searchTerm = '' }) {
  const [sortColumn, setSortColumn] = useState(null)
  const [sortDirection, setSortDirection] = useState('asc')

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0
    
    const aVal = a[sortColumn]
    const bVal = b[sortColumn]
    
    if (typeof aVal === 'string') {
      return sortDirection === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    }
    
    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
  })

  const filteredData = sortedData.filter(row =>
    Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
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
    <div className="scrollable-table">
      <table className="mobile-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort(column.key)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.label}</span>
                  {sortColumn === column.key && (
                    <span className="text-xs">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredData.map((row, idx) => (
            <tr
              key={idx}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <td key={column.key} className="relative">
                  {column.key === 'risk' ? (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRiskColor(row[column.key])}`}>
                      {row[column.key]}
                    </span>
                  ) : column.key === 'confidence' ? (
                    <span className="font-mono">
                      {(row[column.key] * 100).toFixed(1)}%
                    </span>
                  ) : column.key === 'indicators' ? (
                    <div className="flex flex-wrap gap-1">
                      {row[column.key].slice(0, 2).map((indicator, i) => (
                        <span key={i} className="bg-gray-100 text-gray-700 px-1 py-0.5 rounded text-xs">
                          {indicator}
                        </span>
                      ))}
                      {row[column.key].length > 2 && (
                        <span className="text-gray-500 text-xs">
                          +{row[column.key].length - 2}
                        </span>
                      )}
                    </div>
                  ) : column.key === 'ioc' ? (
                    <span className="font-mono text-sm break-all">
                      {row[column.key]}
                    </span>
                  ) : column.key === 'type' ? (
                    <div className="flex items-center space-x-2">
                      <span>
                        {row[column.key] === 'Phishing Email' ? '📧' :
                         row[column.key] === 'Malicious URL' ? '🔗' :
                         row[column.key] === 'Phishing SMS' ? '📱' : '🌐'}
                      </span>
                      <span className="hidden sm:inline">{row[column.key]}</span>
                    </div>
                  ) : (
                    <span className="break-words">{row[column.key]}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <span className="text-2xl block mb-2">🔍</span>
          <p>No results found</p>
          {searchTerm && (
            <p className="text-sm">Try adjusting your search terms</p>
          )}
        </div>
      )}
      
      {/* Mobile scroll hint */}
      <div className="sm:hidden text-center text-xs text-gray-500 mt-2">
        ← Scroll horizontally to see more columns →
      </div>
    </div>
  )
}
