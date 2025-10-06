// Mobile-Optimized PhishGuard Extension
class PhishGuardMobile {
    constructor() {
        this.apiUrl = 'http://localhost:8000'
        this.cache = new Map()
        this.tooltip = null
        this.isMobile = this.detectMobile()
        this.settings = { protection: true, hoverScan: true, notifications: true }
        this.init()
    }

    detectMobile() {
        return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768
    }

    init() {
        this.loadSettings()
        this.createTooltip()
        this.scanCurrentPage()
        this.attachEventListeners()
    }

    loadSettings() {
        chrome.storage.local.get(['settings'], (result) => {
            if (result.settings) {
                this.settings = result.settings
            }
        })
    }

    createTooltip() {
        this.tooltip = document.createElement('div')
        this.tooltip.id = 'phishguard-mobile-tooltip'
        
        // Mobile-optimized tooltip styles
        const mobileStyles = this.isMobile ? `
            font-size: 16px;
            padding: 20px;
            max-width: 90vw;
            min-height: 80px;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            border: 3px solid #374151;
        ` : `
            font-size: 14px;
            padding: 12px;
            max-width: 300px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 1px solid #374151;
        `

        this.tooltip.style.cssText = `
            position: fixed;
            background: #1f2937;
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            z-index: 10000;
            display: none;
            pointer-events: none;
            line-height: 1.5;
            ${mobileStyles}
        `
        document.body.appendChild(this.tooltip)
    }

    attachEventListeners() {
        if (this.isMobile) {
            // Mobile: Use touch events
            document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true })
            document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true })
            document.addEventListener('click', (e) => this.handleMobileClick(e))
        } else {
            // Desktop: Use mouse events
            document.addEventListener('mouseover', (e) => this.handleMouseOver(e))
            document.addEventListener('mouseout', (e) => this.handleMouseOut(e))
            document.addEventListener('click', (e) => this.handleClick(e))
        }

        // Listen for settings updates
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'updateSettings') {
                this.settings = request.settings
            } else if (request.action === 'scanPage') {
                this.scanCurrentPage().then(result => {
                    sendResponse({ result })
                })
                return true
            }
        })
    }

    handleTouchStart(event) {
        if (!this.settings.hoverScan) return
        
        const link = this.findLinkElement(event.target)
        if (link && link.href) {
            this.touchStartTime = Date.now()
            this.touchedLink = link
            
            // Show tooltip after long press (500ms)
            this.longPressTimer = setTimeout(() => {
                this.handleLinkAnalysis(event, link.href)
            }, 500)
        }
    }

    handleTouchEnd(event) {
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer)
        }
        
        // Hide tooltip after short delay
        setTimeout(() => this.hideTooltip(), 2000)
    }

    handleMobileClick(event) {
        const link = this.findLinkElement(event.target)
        if (link && link.href && this.settings.protection) {
            // Quick vibration feedback if supported
            if (navigator.vibrate) {
                navigator.vibrate(50)
            }
            
            this.handleLinkClick(event, link)
        }
    }

    handleMouseOver(event) {
        if (!this.settings.hoverScan) return
        
        const link = this.findLinkElement(event.target)
        if (link && link.href) {
            this.handleLinkAnalysis(event, link.href)
        }
    }

    handleMouseOut(event) {
        const link = this.findLinkElement(event.target)
        if (link) {
            setTimeout(() => this.hideTooltip(), 300)
        }
    }

    handleClick(event) {
        const link = this.findLinkElement(event.target)
        if (link && link.href && this.settings.protection) {
            this.handleLinkClick(event, link)
        }
    }

    findLinkElement(element) {
        // Traverse up to find link element
        let current = element
        while (current && current !== document.body) {
            if (current.tagName === 'A' && current.href) {
                return current
            }
            current = current.parentElement
        }
        return null
    }

    async handleLinkAnalysis(event, url) {
        if (this.isSafeLink(url)) return

        const analysis = await this.analyzeUrl(url)
        if (analysis) {
            this.showTooltip(event, analysis, url)
        }
    }

    async handleLinkClick(event, link) {
        const url = link.href
        
        if (this.isSafeLink(url)) return

        const analysis = await this.analyzeUrl(url)
        
        if (analysis && analysis.is_suspicious && analysis.confidence > 0.6) {
            event.preventDefault()
            
            // Mobile-optimized confirmation dialog
            const message = this.isMobile ? 
                `⚠️ PhishGuard Warning\n\nThis link appears suspicious!\n\nRisk: ${this.getRiskLevel(analysis.confidence)}\nConfidence: ${(analysis.confidence * 100).toFixed(1)}%\n\nProceed anyway?` :
                `⚠️ PhishGuard Warning\n\nThis link appears suspicious!\n\nRisk Level: ${this.getRiskLevel(analysis.confidence)}\nConfidence: ${(analysis.confidence * 100).toFixed(1)}%\n\n${analysis.explanation}\n\nDo you want to proceed anyway?`
            
            const proceed = confirm(message)
            
            if (proceed) {
                // Add vibration feedback on mobile
                if (this.isMobile && navigator.vibrate) {
                    navigator.vibrate([100, 50, 100])
                }
                window.open(url, '_blank')
            }
        }
    }

    async analyzeUrl(url) {
        if (this.cache.has(url)) {
            return this.cache.get(url)
        }

        try {
            const response = await fetch(`${this.apiUrl}/analyze-link`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: url })
            })

            const result = await response.json()
            
            // Cache for 5 minutes
            this.cache.set(url, result)
            setTimeout(() => this.cache.delete(url), 300000)
            
            return result
        } catch (error) {
            return null
        }
    }

    showTooltip(event, analysis, url) {
        const isRisky = analysis.is_suspicious
        const confidence = analysis.confidence
        const riskLevel = this.getRiskLevel(confidence)
        
        // Position tooltip (mobile-optimized)
        let x, y
        if (this.isMobile) {
            // Center tooltip on mobile
            x = Math.max(20, (window.innerWidth - 300) / 2)
            y = Math.max(20, window.innerHeight - 200)
        } else {
            x = Math.min(event.clientX + 10, window.innerWidth - 320)
            y = Math.max(event.clientY - 10, 10)
        }
        
        const status = isRisky ? '⚠️ SUSPICIOUS' : '✅ SAFE'
        const color = isRisky ? '#ef4444' : '#10b981'
        const bgColor = isRisky ? '#fef2f2' : '#f0fdf4'
        
        // Mobile-optimized tooltip content
        const mobileContent = this.isMobile ? `
            <div style="display: flex; align-items: center; margin-bottom: 12px; font-size: 18px;">
                <strong style="color: ${color};">${status}</strong>
                <span style="margin-left: 12px; background: ${color}; color: white; padding: 4px 8px; border-radius: 6px; font-size: 14px;">
                    ${riskLevel}
                </span>
            </div>
            <div style="font-size: 14px; margin-bottom: 8px; opacity: 0.9;">
                Confidence: ${(confidence * 100).toFixed(1)}%
            </div>
            <div style="font-size: 14px; line-height: 1.4; margin-bottom: 8px;">
                ${analysis.explanation || 'Analysis complete'}
            </div>
            ${isRisky ? '<div style="font-size: 12px; opacity: 0.8; text-align: center; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 6px;">Tap link to see full warning</div>' : ''}
        ` : `
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <strong style="color: ${color};">${status}</strong>
                <span style="margin-left: 8px; background: ${color}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px;">
                    ${riskLevel}
                </span>
            </div>
            <div style="font-size: 12px; margin-bottom: 6px; opacity: 0.8;">
                Confidence: ${(confidence * 100).toFixed(1)}%
            </div>
            <div style="font-size: 12px; line-height: 1.4;">
                ${analysis.explanation || 'Analysis complete'}
            </div>
        `
        
        this.tooltip.innerHTML = mobileContent
        
        // Position and show
        this.tooltip.style.left = `${x}px`
        this.tooltip.style.top = `${y}px`
        this.tooltip.style.display = 'block'
        
        // Auto-hide on mobile after 3 seconds
        if (this.isMobile) {
            setTimeout(() => this.hideTooltip(), 3000)
        }
    }

    hideTooltip() {
        if (this.tooltip) {
            this.tooltip.style.display = 'none'
        }
    }

    async scanCurrentPage() {
        const currentUrl = window.location.href
        
        try {
            const response = await fetch(`${this.apiUrl}/analyze-link`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: currentUrl })
            })

            const result = await response.json()
            
            if (result.is_suspicious && this.settings.notifications) {
                this.showPageWarning(result)
            }
            
            return result
        } catch (error) {
            console.log('PhishGuard: API unavailable')
            return null
        }
    }

    showPageWarning(analysis) {
        const warning = document.createElement('div')
        warning.id = 'phishguard-page-warning'
        
        // Mobile-optimized warning banner
        const mobileStyles = this.isMobile ? `
            padding: 16px 12px;
            font-size: 16px;
            line-height: 1.4;
        ` : `
            padding: 12px;
            font-size: 14px;
        `
        
        warning.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #dc2626;
            color: white;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            z-index: 10001;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ${mobileStyles}
        `
        
        const buttonStyle = this.isMobile ? 
            'background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 16px; min-height: 44px; min-width: 44px;' :
            'background: rgba(255,255,255,0.2); border: none; color: white; padding: 4px 8px; border-radius: 4px; cursor: pointer;'
        
        warning.innerHTML = `
            <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 12px;">
                <div style="flex: 1; text-align: left;">
                    <strong>⚠️ PhishGuard Warning:</strong> This page may be dangerous!<br>
                    <span style="opacity: 0.9;">Risk Level: ${this.getRiskLevel(analysis.confidence)}</span>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="${buttonStyle}">
                    ✕
                </button>
            </div>
        `
        
        document.body.prepend(warning)
        
        // Mobile haptic feedback
        if (this.isMobile && navigator.vibrate) {
            navigator.vibrate([200, 100, 200])
        }
        
        // Auto-hide after 8 seconds on mobile, 10 on desktop
        setTimeout(() => {
            if (warning.parentNode) {
                warning.remove()
            }
        }, this.isMobile ? 8000 : 10000)
    }

    isSafeLink(url) {
        const safeDomains = [
            'google.com', 'youtube.com', 'github.com', 'stackoverflow.com',
            'microsoft.com', 'apple.com', 'amazon.com', 'facebook.com',
            'twitter.com', 'linkedin.com', 'wikipedia.org'
        ]
        
        try {
            const domain = new URL(url).hostname.toLowerCase()
            return safeDomains.some(safe => domain.includes(safe)) || 
                   url.startsWith(window.location.origin) ||
                   url.startsWith('mailto:') ||
                   url.startsWith('tel:')
        } catch {
            return false
        }
    }

    getRiskLevel(confidence) {
        if (confidence >= 0.8) return 'HIGH'
        if (confidence >= 0.5) return 'MEDIUM'
        if (confidence >= 0.3) return 'LOW'
        return 'MINIMAL'
    }
}

// Initialize with mobile detection
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new PhishGuardMobile())
} else {
    new PhishGuardMobile()
}
