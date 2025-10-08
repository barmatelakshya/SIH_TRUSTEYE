interface AnalysisResult {
  riskLevel: "low" | "medium" | "high" | "critical";
  score: number;
  flags: Array<{
    category: string;
    description: string;
    severity: "low" | "medium" | "high";
  }>;
}

export function analyzeURL(url: string): AnalysisResult {
  const flags: Array<{
    category: string;
    description: string;
    severity: "low" | "medium" | "high";
  }> = [];

  let score = 0;

  try {
    const urlObj = new URL(url);
    
    // Check for suspicious domains
    const suspiciousDomains = [
      'bit.ly', 'tinyurl.com', 'short.link', 'ow.ly', 't.co',
      'goo.gl', 'is.gd', 'buff.ly', 'ift.tt'
    ];
    
    if (suspiciousDomains.some(domain => urlObj.hostname.includes(domain))) {
      score += 20;
      flags.push({
        category: "Suspicious Domain",
        description: "URL uses a link shortener which can hide the real destination",
        severity: "medium"
      });
    }

    // Check for suspicious TLDs
    const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf', '.click', '.download'];
    if (suspiciousTLDs.some(tld => urlObj.hostname.endsWith(tld))) {
      score += 25;
      flags.push({
        category: "Suspicious TLD",
        description: "Domain uses a top-level domain commonly used by scammers",
        severity: "high"
      });
    }

    // Check for IP addresses instead of domains
    const ipPattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    if (ipPattern.test(urlObj.hostname)) {
      score += 30;
      flags.push({
        category: "IP Address",
        description: "URL uses IP address instead of domain name",
        severity: "high"
      });
    }

    // Check for suspicious keywords in URL
    const suspiciousKeywords = [
      'verify', 'secure', 'account', 'login', 'update', 'confirm',
      'suspended', 'locked', 'urgent', 'immediate'
    ];
    
    const urlString = url.toLowerCase();
    const keywordMatches = suspiciousKeywords.filter(keyword => 
      urlString.includes(keyword)
    );
    
    if (keywordMatches.length > 0) {
      score += keywordMatches.length * 5;
      flags.push({
        category: "Suspicious Keywords",
        description: `URL contains suspicious keywords: ${keywordMatches.join(', ')}`,
        severity: "medium"
      });
    }

    // Check for excessive subdomains
    const subdomains = urlObj.hostname.split('.');
    if (subdomains.length > 4) {
      score += 15;
      flags.push({
        category: "Excessive Subdomains",
        description: "URL has an unusual number of subdomains",
        severity: "medium"
      });
    }

  } catch (error) {
    score += 50;
    flags.push({
      category: "Invalid URL",
      description: "URL format is invalid or malformed",
      severity: "high"
    });
  }

  // Determine risk level
  let riskLevel: "low" | "medium" | "high" | "critical";
  if (score >= 60) riskLevel = "critical";
  else if (score >= 40) riskLevel = "high";
  else if (score >= 20) riskLevel = "medium";
  else riskLevel = "low";

  return { riskLevel, score, flags };
}

export function analyzeText(text: string): AnalysisResult {
  const flags: Array<{
    category: string;
    description: string;
    severity: "low" | "medium" | "high";
  }> = [];

  let score = 0;

  // Check for urgency keywords
  const urgencyKeywords = [
    "urgent", "immediately", "act now", "limited time", "expire", "suspend",
    "within 24 hours", "confirm now", "verify now", "act fast", "last chance",
    "final notice", "action required"
  ];
  const urgencyMatches = urgencyKeywords.filter(keyword => 
    text.toLowerCase().includes(keyword.toLowerCase())
  );
  if (urgencyMatches.length > 0) {
    score += urgencyMatches.length * 10;
    flags.push({
      category: "Urgency Pressure",
      description: `Contains urgency language: "${urgencyMatches.slice(0, 3).join('", "')}"${urgencyMatches.length > 3 ? '...' : ''}`,
      severity: urgencyMatches.length >= 3 ? "high" : "medium"
    });
  }

  // Check for requests for personal information
  const personalInfoKeywords = [
    "password", "ssn", "social security", "credit card", "bank account",
    "routing number", "pin", "security code", "verify your account",
    "confirm your identity", "update your information", "validate account"
  ];
  const personalInfoMatches = personalInfoKeywords.filter(keyword =>
    text.toLowerCase().includes(keyword.toLowerCase())
  );
  if (personalInfoMatches.length > 0) {
    score += personalInfoMatches.length * 15;
    flags.push({
      category: "Personal Information Request",
      description: `Requests sensitive information related to: ${personalInfoMatches.slice(0, 2).join(", ")}`,
      severity: "high"
    });
  }

  // Check for suspicious links/URLs
  const urlPattern = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-z0-9-]+\.(com|net|org|gov))/gi;
  const urls = text.match(urlPattern) || [];
  const suspiciousUrlPatterns = [
    /\d+/g, // numbers in domain
    /[^a-z0-9.-]/gi, // unusual characters
  ];
  
  const hasSuspiciousUrls = urls.some(url => {
    const domainPart = url.replace(/https?:\/\//i, '').split('/')[0];
    return suspiciousUrlPatterns.some(pattern => {
      const matches = domainPart.match(pattern);
      return matches && matches.length > 2;
    });
  });

  if (hasSuspiciousUrls) {
    score += 20;
    flags.push({
      category: "Suspicious Link",
      description: "Contains URLs with unusual patterns or characters",
      severity: "high"
    });
  }

  // Check for shortened URLs
  const shortenedUrlDomains = ["bit.ly", "tinyurl", "goo.gl", "ow.ly", "t.co"];
  const hasShortenedUrls = shortenedUrlDomains.some(domain =>
    text.toLowerCase().includes(domain)
  );
  if (hasShortenedUrls) {
    score += 10;
    flags.push({
      category: "Shortened URL",
      description: "Contains shortened URLs that hide the real destination",
      severity: "medium"
    });
  }

  // Check for too-good-to-be-true offers
  const tgtbtKeywords = [
    "you've won", "congratulations", "prize", "free money", "get rich",
    "guaranteed income", "work from home", "click here to claim", "lottery",
    "inheritance", "million dollars", "act now to receive"
  ];
  const tgtbtMatches = tgtbtKeywords.filter(keyword =>
    text.toLowerCase().includes(keyword.toLowerCase())
  );
  if (tgtbtMatches.length > 0) {
    score += tgtbtMatches.length * 12;
    flags.push({
      category: "Too Good to Be True",
      description: `Contains suspicious offers or prize claims`,
      severity: tgtbtMatches.length >= 2 ? "high" : "medium"
    });
  }

  // Check for generic greetings
  const genericGreetings = [
    "dear customer", "dear user", "dear member", "valued customer",
    "dear sir/madam", "hello user"
  ];
  const hasGenericGreeting = genericGreetings.some(greeting =>
    text.toLowerCase().includes(greeting)
  );
  if (hasGenericGreeting) {
    score += 8;
    flags.push({
      category: "Generic Greeting",
      description: "Uses generic greeting instead of your name",
      severity: "low"
    });
  }

  // Check for spelling and grammar issues (simplified)
  const commonMisspellings = [
    "recieve", "occured", "seperate", "definately", "untill", "sucessful",
    "beleive", "occassion", "publically", "acheive"
  ];
  const misspellingCount = commonMisspellings.filter(word =>
    text.toLowerCase().includes(word)
  ).length;
  if (misspellingCount > 0) {
    score += misspellingCount * 5;
    flags.push({
      category: "Spelling Errors",
      description: `Contains ${misspellingCount} common spelling error(s)`,
      severity: "low"
    });
  }

  // Check for excessive punctuation
  const excessivePunctuation = /[!?]{2,}/.test(text);
  if (excessivePunctuation) {
    score += 5;
    flags.push({
      category: "Excessive Punctuation",
      description: "Uses excessive exclamation or question marks",
      severity: "low"
    });
  }

  // Check for threats
  const threatKeywords = [
    "legal action", "warrant", "arrested", "lawsuit", "criminal",
    "fined", "penalty", "court", "suspended account", "locked account"
  ];
  const threatMatches = threatKeywords.filter(keyword =>
    text.toLowerCase().includes(keyword.toLowerCase())
  );
  if (threatMatches.length > 0) {
    score += threatMatches.length * 15;
    flags.push({
      category: "Threatening Language",
      description: "Contains threats of legal action or account suspension",
      severity: "high"
    });
  }

  // Check for money requests
  const moneyKeywords = [
    "send money", "wire transfer", "gift card", "bitcoin", "cryptocurrency",
    "payment required", "pay immediately", "transfer funds", "western union",
    "moneygram"
  ];
  const moneyMatches = moneyKeywords.filter(keyword =>
    text.toLowerCase().includes(keyword.toLowerCase())
  );
  if (moneyMatches.length > 0) {
    score += moneyMatches.length * 18;
    flags.push({
      category: "Money Request",
      description: "Requests payment or money transfer",
      severity: "high"
    });
  }

  // Determine risk level based on score
  let riskLevel: "low" | "medium" | "high" | "critical";
  if (score >= 60) {
    riskLevel = "critical";
  } else if (score >= 40) {
    riskLevel = "high";
  } else if (score >= 20) {
    riskLevel = "medium";
  } else {
    riskLevel = "low";
  }

  // Cap score at 100
  score = Math.min(score, 100);

  return {
    riskLevel,
    score,
    flags
  };
}
