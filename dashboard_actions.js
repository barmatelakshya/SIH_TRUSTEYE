// Enhanced Dashboard Actions with Clear User Feedback

// Add date range functionality
function addDateRangeControls() {
    const dashboardSection = document.getElementById('dashboard');
    const statsContainer = dashboardSection.querySelector('.grid');
    
    // Add date range controls after the header
    const dateRangeHTML = `
        <div class="col-12 mb-6">
            <div class="professional-card card-padding rounded-2xl">
                <div class="flex flex-wrap items-center justify-between gap-4">
                    <div class="flex items-center space-x-4">
                        <label class="font-medium">Date Range:</label>
                        <select id="dateRange" class="px-4 py-2 border border-gray-300 rounded-lg focus:border-primary">
                            <option value="today">Today</option>
                            <option value="week">Last 7 Days</option>
                            <option value="month">Last 30 Days</option>
                            <option value="all">All Time</option>
                        </select>
                        <button onclick="applyDateFilter()" class="px-4 py-2 bg-primary text-white rounded-lg hover-lift">
                            <i class="fas fa-filter mr-2"></i>Apply Filter
                        </button>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button onclick="quickScan()" class="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover-lift font-semibold">
                            <i class="fas fa-bolt mr-2"></i>Quick Scan
                        </button>
                        <button onclick="toggleChartType()" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover-lift">
                            <i class="fas fa-chart-bar mr-2"></i>Toggle Chart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    statsContainer.insertAdjacentHTML('afterbegin', dateRangeHTML);
}

// Quick Scan Action
function quickScan() {
    showActionFeedback('Starting quick scan...', 'info');
    
    // Simulate scanning process
    const scanBtn = document.querySelector('[onclick="quickScan()"]');
    const originalText = scanBtn.innerHTML;
    
    scanBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Scanning...';
    scanBtn.disabled = true;
    
    setTimeout(() => {
        // Simulate scan results
        const threats = Math.floor(Math.random() * 5);
        dashboardData.totalScans += 10;
        dashboardData.threatsBlocked += threats;
        dashboardData.successRate = Math.round((dashboardData.threatsBlocked / dashboardData.totalScans) * 100);
        
        // Add fake scan entries
        for (let i = 0; i < 10; i++) {
            const isPhishing = Math.random() < 0.3;
            dashboardData.scanHistory.unshift({
                type: Math.random() < 0.5 ? 'URL' : 'Text',
                content: `Quick scan item ${i + 1}`,
                isPhishing,
                confidence: Math.floor(Math.random() * 100),
                riskLevel: isPhishing ? 'High' : 'Low',
                timestamp: new Date().toISOString()
            });
        }
        
        localStorage.setItem('trusteyeData', JSON.stringify(dashboardData));
        updateDashboard();
        
        scanBtn.innerHTML = originalText;
        scanBtn.disabled = false;
        
        showActionFeedback(`Quick scan completed! Found ${threats} threats in 10 items.`, 'success');
        animateCounters();
    }, 2000);
}

// Date Filter Action
function applyDateFilter() {
    const dateRange = document.getElementById('dateRange').value;
    showActionFeedback(`Applying ${dateRange} filter...`, 'info');
    
    setTimeout(() => {
        // Filter scan history based on date range
        const now = new Date();
        let filteredHistory = dashboardData.scanHistory;
        
        switch(dateRange) {
            case 'today':
                filteredHistory = dashboardData.scanHistory.filter(scan => {
                    const scanDate = new Date(scan.timestamp);
                    return scanDate.toDateString() === now.toDateString();
                });
                break;
            case 'week':
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                filteredHistory = dashboardData.scanHistory.filter(scan => 
                    new Date(scan.timestamp) >= weekAgo
                );
                break;
            case 'month':
                const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                filteredHistory = dashboardData.scanHistory.filter(scan => 
                    new Date(scan.timestamp) >= monthAgo
                );
                break;
        }
        
        // Update display with filtered data
        const filteredThreats = filteredHistory.filter(scan => scan.isPhishing).length;
        const filteredTotal = filteredHistory.length;
        
        document.getElementById('dashTotalScans').textContent = filteredTotal.toLocaleString();
        document.getElementById('dashThreatsBlocked').textContent = filteredThreats.toLocaleString();
        document.getElementById('dashSuccessRate').textContent = 
            filteredTotal > 0 ? Math.round((filteredThreats / filteredTotal) * 100) + '%' : '0%';
        
        updateScanHistoryTableFiltered(filteredHistory);
        showActionFeedback(`Filter applied! Showing ${filteredTotal} scans from ${dateRange}.`, 'success');
    }, 500);
}

// Toggle Chart Type Action
let currentChartType = 'doughnut';
function toggleChartType() {
    currentChartType = currentChartType === 'doughnut' ? 'bar' : 'doughnut';
    
    showActionFeedback(`Switching to ${currentChartType} chart...`, 'info');
    
    if (threatChart) {
        threatChart.destroy();
        
        const ctx = document.getElementById('threatChart');
        threatChart = new Chart(ctx, {
            type: currentChartType,
            data: {
                labels: ['Safe', 'Phishing', 'Suspicious'],
                datasets: [{
                    data: [
                        dashboardData.totalScans - dashboardData.threatsBlocked,
                        dashboardData.threatsBlocked,
                        0
                    ],
                    backgroundColor: ['#10B981', '#DC2626', '#F59E0B']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
        
        showActionFeedback(`Chart updated to ${currentChartType} view!`, 'success');
    }
}

// Enhanced Export Data Action
function exportData() {
    showActionFeedback('Preparing data export...', 'info');
    
    const exportBtn = document.querySelector('[onclick="exportData()"]');
    const originalText = exportBtn.innerHTML;
    
    exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Exporting...';
    exportBtn.disabled = true;
    
    setTimeout(() => {
        try {
            const exportData = {
                ...dashboardData,
                exportDate: new Date().toISOString(),
                version: '1.0',
                totalItems: dashboardData.scanHistory.length
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `trusteye-export-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);
            
            exportBtn.innerHTML = originalText;
            exportBtn.disabled = false;
            
            showActionFeedback(`Data exported successfully! ${dashboardData.scanHistory.length} records saved.`, 'success');
        } catch (error) {
            exportBtn.innerHTML = originalText;
            exportBtn.disabled = false;
            showActionFeedback('Export failed. Please try again.', 'error');
        }
    }, 1000);
}

// Enhanced Clear Data Action
function clearData() {
    if (confirm('⚠️ This will permanently delete all scan data. Are you sure?')) {
        showActionFeedback('Clearing all data...', 'info');
        
        const clearBtn = document.querySelector('[onclick="clearData()"]');
        const originalText = clearBtn.innerHTML;
        
        clearBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Clearing...';
        clearBtn.disabled = true;
        
        setTimeout(() => {
            const oldTotal = dashboardData.totalScans;
            
            dashboardData = {
                totalScans: 0,
                threatsBlocked: 0,
                successRate: 0,
                scanHistory: []
            };
            
            localStorage.setItem('trusteyeData', JSON.stringify(dashboardData));
            updateDashboard();
            
            clearBtn.innerHTML = originalText;
            clearBtn.disabled = false;
            
            showActionFeedback(`All data cleared! Removed ${oldTotal} scan records.`, 'success');
            animateCountersToZero();
        }, 1000);
    }
}

// Action Feedback System
function showActionFeedback(message, type = 'info') {
    // Remove existing feedback
    const existing = document.getElementById('actionFeedback');
    if (existing) existing.remove();
    
    const colors = {
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
    };
    
    const icons = {
        info: 'fa-info-circle',
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    const feedback = document.createElement('div');
    feedback.id = 'actionFeedback';
    feedback.className = `fixed top-24 right-6 z-50 p-4 rounded-lg border-2 ${colors[type]} shadow-lg animate-slide-up`;
    feedback.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${icons[type]} mr-3"></i>
            <span class="font-medium">${message}</span>
        </div>
    `;
    
    document.body.appendChild(feedback);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translateX(100%)';
            setTimeout(() => feedback.remove(), 300);
        }
    }, 3000);
}

// Counter Animations
function animateCounters() {
    const counters = [
        { element: document.getElementById('dashTotalScans'), target: dashboardData.totalScans },
        { element: document.getElementById('dashThreatsBlocked'), target: dashboardData.threatsBlocked }
    ];
    
    counters.forEach(counter => {
        const start = parseInt(counter.element.textContent.replace(/,/g, '')) || 0;
        const target = counter.target;
        const duration = 1000;
        const startTime = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (target - start) * progress);
            
            counter.element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    });
}

function animateCountersToZero() {
    const counters = document.querySelectorAll('#dashTotalScans, #dashThreatsBlocked');
    
    counters.forEach(counter => {
        const start = parseInt(counter.textContent.replace(/,/g, '')) || 0;
        const duration = 800;
        const startTime = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start * (1 - progress));
            
            counter.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    });
}

// Update filtered scan history table
function updateScanHistoryTableFiltered(filteredHistory) {
    const tbody = document.getElementById('scanHistoryTable');
    
    if (filteredHistory.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-secondary">No scans found for selected date range.</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredHistory.slice(0, 10).map(scan => `
        <tr class="border-b border-gray-100 dark:border-gray-700">
            <td class="py-3 px-4">${new Date(scan.timestamp).toLocaleTimeString()}</td>
            <td class="py-3 px-4">${scan.type}</td>
            <td class="py-3 px-4 max-w-xs truncate">${scan.content}</td>
            <td class="py-3 px-4">
                <span class="px-2 py-1 rounded text-xs ${scan.isPhishing ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}">
                    ${scan.isPhishing ? 'Threat' : 'Safe'}
                </span>
            </td>
            <td class="py-3 px-4">
                <span class="px-2 py-1 rounded text-xs ${
                    scan.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                    scan.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                }">
                    ${scan.riskLevel}
                </span>
            </td>
        </tr>
    `).join('');
}

// Initialize enhanced dashboard actions
document.addEventListener('DOMContentLoaded', function() {
    // Add date range controls when dashboard is loaded
    setTimeout(() => {
        if (document.getElementById('dashboard')) {
            addDateRangeControls();
        }
    }, 100);
});
