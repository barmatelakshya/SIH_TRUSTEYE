import { analyzeText, analyzeURL } from '../utils/scamDetection';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://sih-trusteye-backend.onrender.com/api'  // Will deploy backend here
  : 'http://localhost:5001/api';

interface BackendAnalysisResult {
  is_phishing: boolean;
  confidence: number;
  risk_level: string;
  patterns?: string[];
  issues?: string[];
  warnings?: string[];
}

interface FrontendAnalysisResult {
  riskLevel: "low" | "medium" | "high" | "critical";
  score: number;
  flags: Array<{
    category: string;
    description: string;
    severity: "low" | "medium" | "high";
  }>;
}

// Convert backend response to frontend format
function convertBackendResponse(backendResult: BackendAnalysisResult): FrontendAnalysisResult {
  const flags: Array<{
    category: string;
    description: string;
    severity: "low" | "medium" | "high";
  }> = [];

  // Add patterns as flags
  if (backendResult.patterns) {
    backendResult.patterns.forEach(pattern => {
      flags.push({
        category: "Phishing Pattern",
        description: `Detected pattern: ${pattern}`,
        severity: "high"
      });
    });
  }

  // Add issues as flags
  if (backendResult.issues) {
    backendResult.issues.forEach(issue => {
      flags.push({
        category: "URL Issue",
        description: issue,
        severity: "medium"
      });
    });
  }

  // Add warnings as flags
  if (backendResult.warnings) {
    backendResult.warnings.forEach(warning => {
      flags.push({
        category: "Email Warning",
        description: warning,
        severity: "medium"
      });
    });
  }

  // Convert risk level
  let riskLevel: "low" | "medium" | "high" | "critical";
  switch (backendResult.risk_level.toLowerCase()) {
    case 'high':
      riskLevel = backendResult.confidence > 80 ? 'critical' : 'high';
      break;
    case 'medium':
      riskLevel = 'medium';
      break;
    default:
      riskLevel = 'low';
  }

  return {
    riskLevel,
    score: backendResult.confidence,
    flags
  };
}

export async function analyzeTextWithBackend(text: string): Promise<FrontendAnalysisResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/scan/text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Backend analysis failed');
    }

    const backendResult: BackendAnalysisResult = await response.json();
    return convertBackendResponse(backendResult);
  } catch (error) {
    console.error('Backend analysis error, falling back to client-side:', error);
    // Fallback to full client-side analysis
    return analyzeText(text);
  }
}

export async function analyzeURLWithBackend(url: string): Promise<FrontendAnalysisResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/scan/url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error('Backend URL analysis failed');
    }

    const backendResult: BackendAnalysisResult = await response.json();
    return convertBackendResponse(backendResult);
  } catch (error) {
    console.error('Backend URL analysis error, falling back to client-side:', error);
    // Fallback to full client-side analysis
    return analyzeURL(url);
  }
}
