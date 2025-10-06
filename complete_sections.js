// Complete TrustEye JavaScript with all features
let dashboardData = JSON.parse(localStorage.getItem('trusteyeData')) || {
    totalScans: 0,
    threatsBlocked: 0,
    successRate: 0,
    scanHistory: []
};

let currentLang = localStorage.getItem('trusteyeLang') || 'en';
let isDarkMode = localStorage.getItem('trusteyeTheme') === 'dark';
let lastScanTime = 0;
let threatChart, historyChart;

// Translations
const translations = {
    en: {
        'nav.home': 'Home',
        'nav.scanner': 'Scanner',
        'nav.dashboard': 'Dashboard',
        'nav.education': 'Education',
        'nav.contact': 'Contact'
    },
    hi: {
        'nav.home': 'होम',
        'nav.scanner': 'स्कैनर',
        'nav.dashboard': 'डैशबोर्ड',
        'nav.education': 'शिक्षा',
        'nav.contact': 'संपर्क'
    }
};

// Phishing detection patterns
const phishingPatterns = [
    /urgent.*action.*required/i,
    /verify.*account.*immediately/i,
    /click.*here.*now/i,
    /suspended.*account/i,
    /confirm.*identity/i,
    /limited.*time.*offer/i,
    /act.*now.*expire/i,
    /security.*alert/i,
    /congratulations.*won/i,
    /claim.*prize/i
];

const suspiciousDomains = [
    'bit.ly', 'tinyurl.com', 'short.link', 't.co',
    '.tk', '.ml', '.ga', '.cf',
    'phishing', 'fake', 'scam', 'verify'
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeLanguage();
    updateDashboard();
    initializeCharts();
    
    // Event listeners
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('langBtn').addEventListener('click', toggleLanguage);
    document.getElementById('mobileMenuBtn').addEventListener('click', toggleMobileMenu);
    
    console.log('🚀 TrustEye Complete - All Features Loaded');
});

// Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section-content').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.remove('hidden');
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active', 'text-primary', 'border-b-2', 'border-primary', 'pb-1');
        link.classList.add('text-secondary');
    });
    
    const activeLink = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
    if (activeLink && activeLink.classList.contains('nav-link')) {
        activeLink.classList.add('active', 'text-primary', 'border-b-2', 'border-primary', 'pb-1');
        activeLink.classList.remove('text-secondary');
    }
    
    // Close mobile menu
    document.getElementById('mobileMenu').classList.add('hidden');
    
    // Update charts if dashboard
    if (sectionId === 'dashboard') {
        setTimeout(() => {
            updateCharts();
        }, 100);
    }
}

// Scanner functions
function switchScannerTab(tab) {
    document.querySelectorAll('.scanner-tab').forEach(t => t.classList.add('hidden'));
    document.getElementById(tab + 'Scanner').classList.remove('hidden');
    
    document.querySelectorAll('[id$="ScanTab"]').forEach(btn => {
        btn.classList.remove('bg-primary', 'text-white');
        btn.classList.add('text-secondary');
    });
    
    document.getElementById(tab + 'ScanTab').classList.add('bg-primary', 'text-white');
    document.getElementById(tab + 'ScanTab').classList.remove('text-secondary');
}

function loadSample(type, content) {
    if (type === 'url') {
        document.getElementById('urlInput').value = content;
    } else {
        document.getElementById('textInput').value = content;
    }
}

function scanUrl() {
    const url = document.getElementById('urlInput').value.trim();
    if (!url) return;
    
    // Rate limiting
    const now = Date.now();
    if (now - lastScanTime < 2000) {
        showError('Please wait 2 seconds between scans');
        return;
    }
    lastScanTime = now;
    
    // Input validation
    try {
        new URL(url);
    } catch {
        showError('Please enter a valid URL');
        return;
    }
    
    // Scan logic
    let threatScore = 0;
    let issues = [];
    
    // Check suspicious domains
    suspiciousDomains.forEach(domain => {
        if (url.toLowerCase().includes(domain)) {
            threatScore += 30;
            issues.push(`Suspicious domain pattern: ${domain}`);
        }
    });
    
    // Check for IP addresses
    if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url)) {
        threatScore += 25;
        issues.push('IP address instead of domain name');
    }
    
    // Check for suspicious TLDs
    if (/\.(tk|ml|ga|cf)($|\/)/i.test(url)) {
        threatScore += 20;
        issues.push('Suspicious top-level domain');
    }
    
    const isPhishing = threatScore > 30;
    const confidence = Math.min(threatScore, 100);
    const riskLevel = threatScore > 60 ? 'High' : threatScore > 30 ? 'Medium' : 'Low';
    
    const result = {
        type: 'URL',
        content: url,
        isPhishing,
        confidence,
        riskLevel,
        issues,
        timestamp: new Date().toISOString()
    };
    
    showResults(result);
    saveScanResult(result);
}

function scanText() {
    const text = document.getElementById('textInput').value.trim();
    if (!text) return;
    
    // Rate limiting
    const now = Date.now();
    if (now - lastScanTime < 2000) {
        showError('Please wait 2 seconds between scans');
        return;
    }
    lastScanTime = now;
    
    // Input sanitization
    const sanitizedText = text.replace(/[<>]/g, '');
    
    let threatScore = 0;
    let patterns = [];
    
    phishingPatterns.forEach(pattern => {
        if (pattern.test(sanitizedText)) {
            threatScore += 15;
            patterns.push(pattern.source);
        }
    });
    
    const isPhishing = threatScore > 25;
    const confidence = Math.min(threatScore, 100);
    const riskLevel = threatScore > 50 ? 'High' : threatScore > 25 ? 'Medium' : 'Low';
    
    const result = {
        type: 'Text',
        content: sanitizedText.substring(0, 100) + (sanitizedText.length > 100 ? '...' : ''),
        isPhishing,
        confidence,
        riskLevel,
        patterns,
        timestamp: new Date().toISOString()
    };
    
    showResults(result);
    saveScanResult(result);
}

function showResults(result) {
    const resultsDiv = document.getElementById('scanResults');
    const contentDiv = document.getElementById('resultContent');
    
    const bgColor = result.isPhishing ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700' : 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700';
    const textColor = result.isPhishing ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200';
    const icon = result.isPhishing ? 'fa-exclamation-triangle' : 'fa-shield-alt';
    
    contentDiv.className = `p-6 rounded-xl border-2 ${bgColor}`;
    contentDiv.innerHTML = `
        <div class="flex items-center mb-4">
            <i class="fas ${icon} text-3xl ${textColor} mr-4"></i>
            <div>
                <h3 class="text-2xl font-bold ${textColor}">
                    ${result.isPhishing ? '⚠️ Threat Detected' : '✅ Content Safe'}
                </h3>
                <p class="${textColor} text-lg">Risk Level: ${result.riskLevel} (${result.confidence}% confidence)</p>
            </div>
        </div>
        ${result.issues ? `<div class="mt-4"><strong class="${textColor}">Issues found:</strong><ul class="list-disc list-inside mt-2">${result.issues.map(issue => `<li class="${textColor}">${issue}</li>`).join('')}</ul></div>` : ''}
        ${result.patterns ? `<div class="mt-4"><strong class="${textColor}">Detected patterns:</strong> ${result.patterns.length} phishing indicators</div>` : ''}
    `;
    
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

function showError(message) {
    const resultsDiv = document.getElementById('scanResults');
    const contentDiv = document.getElementById('resultContent');
    
    contentDiv.className = 'p-6 rounded-xl border-2 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700';
    contentDiv.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-exclamation-circle text-2xl text-yellow-600 mr-3"></i>
            <p class="text-yellow-800 dark:text-yellow-200">${message}</p>
        </div>
    `;
    
    resultsDiv.classList.remove('hidden');
}

// Dashboard functions
function saveScanResult(result) {
    dashboardData.totalScans++;
    if (result.isPhishing) {
        dashboardData.threatsBlocked++;
    }
    
    dashboardData.successRate = dashboardData.totalScans > 0 ? 
        Math.round((dashboardData.threatsBlocked / dashboardData.totalScans) * 100) : 0;
    
    dashboardData.scanHistory.unshift(result);
    if (dashboardData.scanHistory.length > 50) {
        dashboardData.scanHistory = dashboardData.scanHistory.slice(0, 50);
    }
    
    localStorage.setItem('trusteyeData', JSON.stringify(dashboardData));
    updateDashboard();
}

function updateDashboard() {
    document.getElementById('dashTotalScans').textContent = dashboardData.totalScans.toLocaleString();
    document.getElementById('dashThreatsBlocked').textContent = dashboardData.threatsBlocked.toLocaleString();
    document.getElementById('dashSuccessRate').textContent = dashboardData.successRate + '%';
    
    const lastScan = dashboardData.scanHistory[0];
    document.getElementById('dashLastScan').textContent = lastScan ? 
        new Date(lastScan.timestamp).toLocaleTimeString() : 'Never';
    
    updateScanHistoryTable();
    updateCharts();
}

function updateScanHistoryTable() {
    const tbody = document.getElementById('scanHistoryTable');
    
    if (dashboardData.scanHistory.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-secondary">No scans yet. Try the scanner to see results here.</td></tr>';
        return;
    }
    
    tbody.innerHTML = dashboardData.scanHistory.slice(0, 10).map(scan => `
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

// Chart functions
function initializeCharts() {
    const threatCtx = document.getElementById('threatChart');
    const historyCtx = document.getElementById('historyChart');
    
    if (threatCtx) {
        threatChart = new Chart(threatCtx, {
            type: 'doughnut',
            data: {
                labels: ['Safe', 'Phishing', 'Suspicious'],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: ['#10B981', '#DC2626', '#F59E0B']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
    
    if (historyCtx) {
        historyChart = new Chart(historyCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Scans per Hour',
                    data: [],
                    borderColor: '#1D4ED8',
                    backgroundColor: 'rgba(29, 78, 216, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

function updateCharts() {
    if (!threatChart || !historyChart) return;
    
    // Update threat distribution
    const safe = dashboardData.totalScans - dashboardData.threatsBlocked;
    const phishing = dashboardData.threatsBlocked;
    
    threatChart.data.datasets[0].data = [safe, phishing, 0];
    threatChart.update();
    
    // Update history chart (simplified)
    const hours = Array.from({length: 24}, (_, i) => `${i}:00`);
    const scansPerHour = new Array(24).fill(0);
    
    // Simulate some data based on total scans
    if (dashboardData.totalScans > 0) {
        const currentHour = new Date().getHours();
        scansPerHour[currentHour] = dashboardData.totalScans;
    }
    
    historyChart.data.labels = hours;
    historyChart.data.datasets[0].data = scansPerHour;
    historyChart.update();
}

// Data management
function exportData() {
    try {
        const dataStr = JSON.stringify(dashboardData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `trusteye-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        alert('Export failed. Please try again.');
    }
}

function clearData() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        dashboardData = {
            totalScans: 0,
            threatsBlocked: 0,
            successRate: 0,
            scanHistory: []
        };
        localStorage.setItem('trusteyeData', JSON.stringify(dashboardData));
        updateDashboard();
        alert('Data cleared successfully!');
    }
}

// Theme and language
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('trusteyeTheme', isDarkMode ? 'dark' : 'light');
}

function initializeTheme() {
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'hi' : 'en';
    document.getElementById('langBtn').textContent = currentLang.toUpperCase();
    localStorage.setItem('trusteyeLang', currentLang);
    updateTranslations();
}

function initializeLanguage() {
    document.getElementById('langBtn').textContent = currentLang.toUpperCase();
    updateTranslations();
}

function updateTranslations() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLang] && translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }
    });
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('hidden');
}

// Demo function
function tryDemo() {
    showSection('scanner');
    setTimeout(() => {
        loadSample('text', 'URGENT: Your account will be suspended in 24 hours. Click here immediately to verify your identity and prevent closure.');
        setTimeout(() => {
            scanText();
        }, 500);
    }, 300);
}
