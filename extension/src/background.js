// PhishGuard Background Service Worker
class PhishGuardBackground {
    constructor() {
        this.apiUrl = 'http://localhost:8000'
        this.stats = { scanned: 0, blocked: 0, sessions: 0 }
        this.init()
    }

    init() {
        this.loadStats()
        this.setupListeners()
        this.setupAlarms()
    }

    setupListeners() {
        // Extension installation
        chrome.runtime.onInstalled.addListener((details) => {
            console.log('PhishGuard installed:', details.reason)
            this.stats.sessions++
            this.saveStats()
        })

        // Tab updates - scan new pages
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete' && tab.url && !this.isInternalPage(tab.url)) {
                this.scanTabUrl(tab.url, tabId)
            }
        })

        // Message handling from content script and popup
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            this.handleMessage(request, sender, sendResponse)
            return true // Keep message channel open for async response
        })

        // Context menu for right-click scanning
        chrome.contextMenus.create({
            id: 'scanLink',
            title: 'Scan with PhishGuard',
            contexts: ['link']
        })

        chrome.contextMenus.onClicked.addListener((info, tab) => {
            if (info.menuItemId === 'scanLink') {
                this.scanUrl(info.linkUrl, tab.id)
            }
        })
    }

    setupAlarms() {
        // Periodic cleanup of cache and stats
        chrome.alarms.create('cleanup', { periodInMinutes: 60 })
        
        chrome.alarms.onAlarm.addListener((alarm) => {
            if (alarm.name === 'cleanup') {
                this.performCleanup()
            }
        })
    }

    async handleMessage(request, sender, sendResponse) {
        switch (request.action) {
            case 'scanPage':
                const result = await this.scanTabUrl(sender.tab.url, sender.tab.id)
                sendResponse({ result })
                break

            case 'scanUrl':
                const urlResult = await this.scanUrl(request.url, sender.tab?.id)
                sendResponse({ result: urlResult })
                break

            case 'getStats':
                sendResponse({ stats: this.stats })
                break

            case 'updateStats':
                this.updateStats(request.stats)
                sendResponse({ success: true })
                break

            case 'reportThreat':
                this.reportThreat(request.threat, sender.tab?.id)
                sendResponse({ success: true })
                break
        }
    }

    async scanTabUrl(url, tabId) {
        if (this.isInternalPage(url)) return null

        try {
            const response = await fetch(`${this.apiUrl}/analyze-link`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            })

            const result = await response.json()
            this.stats.scanned++

            if (result.is_suspicious) {
                this.stats.blocked++
                this.showThreatNotification(result, tabId)
                this.updateBadge(tabId, 'RISK')
            } else {
                this.updateBadge(tabId, '')
            }

            this.saveStats()
            return result

        } catch (error) {
            console.log('PhishGuard API error:', error)
            return null
        }
    }

    async scanUrl(url, tabId) {
        return await this.scanTabUrl(url, tabId)
    }

    showThreatNotification(result, tabId) {
        const riskLevel = this.getRiskLevel(result.confidence)
        
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon-48.png',
            title: 'PhishGuard Alert',
            message: `${riskLevel} risk threat detected on this page!`,
            buttons: [
                { title: 'View Details' },
                { title: 'Dismiss' }
            ]
        }, (notificationId) => {
            // Handle notification clicks
            chrome.notifications.onButtonClicked.addListener((id, buttonIndex) => {
                if (id === notificationId) {
                    if (buttonIndex === 0) {
                        chrome.tabs.create({ url: 'http://localhost:3000/dashboard' })
                    }
                    chrome.notifications.clear(id)
                }
            })
        })
    }

    updateBadge(tabId, text) {
        chrome.action.setBadgeText({ text, tabId })
        
        if (text === 'RISK') {
            chrome.action.setBadgeBackgroundColor({ color: '#dc2626', tabId })
        } else {
            chrome.action.setBadgeBackgroundColor({ color: '#10b981', tabId })
        }
    }

    updateStats(newStats) {
        this.stats = { ...this.stats, ...newStats }
        this.saveStats()
    }

    reportThreat(threat, tabId) {
        // Log threat for analysis
        console.log('Threat reported:', threat)
        
        // Could send to analytics endpoint
        fetch(`${this.apiUrl}/submit-feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                analysis_type: 'link',
                input_data: threat.url,
                predicted_result: threat.analysis,
                user_feedback: 'threat_confirmed',
                comments: 'User reported as threat'
            })
        }).catch(console.error)
    }

    loadStats() {
        chrome.storage.local.get(['phishguard_stats'], (result) => {
            if (result.phishguard_stats) {
                this.stats = { ...this.stats, ...result.phishguard_stats }
            }
        })
    }

    saveStats() {
        chrome.storage.local.set({ phishguard_stats: this.stats })
    }

    performCleanup() {
        // Clear old cache entries, reset daily stats, etc.
        console.log('PhishGuard: Performing periodic cleanup')
        
        // Reset daily counters (keep total counts)
        const dailyReset = {
            scanned: 0,
            blocked: 0,
            sessions: this.stats.sessions
        }
        
        // Only reset if it's a new day
        const lastReset = localStorage.getItem('lastReset')
        const today = new Date().toDateString()
        
        if (lastReset !== today) {
            this.stats = dailyReset
            this.saveStats()
            localStorage.setItem('lastReset', today)
        }
    }

    isInternalPage(url) {
        return url.startsWith('chrome://') || 
               url.startsWith('chrome-extension://') ||
               url.startsWith('moz-extension://') ||
               url.startsWith('about:') ||
               url.startsWith('file://')
    }

    getRiskLevel(confidence) {
        if (confidence >= 0.8) return 'HIGH'
        if (confidence >= 0.5) return 'MEDIUM'
        return 'LOW'
    }
}

// Initialize background service
new PhishGuardBackground()
