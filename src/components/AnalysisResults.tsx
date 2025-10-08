import { AlertTriangle, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Progress } from "./ui/progress";

interface AnalysisResult {
  riskLevel: "low" | "medium" | "high" | "critical";
  score: number;
  flags: Array<{
    category: string;
    description: string;
    severity: "low" | "medium" | "high";
  }>;
}

interface AnalysisResultsProps {
  result: AnalysisResult;
}

export function AnalysisResults({ result }: AnalysisResultsProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "low":
        return <CheckCircle className="h-5 w-5" />;
      case "medium":
        return <AlertCircle className="h-5 w-5" />;
      case "high":
        return <AlertTriangle className="h-5 w-5" />;
      case "critical":
        return <XCircle className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getRiskMessage = (level: string) => {
    switch (level) {
      case "low":
        return "This message appears relatively safe";
      case "medium":
        return "This message has some suspicious elements";
      case "high":
        return "This message shows multiple scam indicators";
      case "critical":
        return "This message is very likely a scam";
      default:
        return "";
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "low":
        return <Badge variant="outline">Low</Badge>;
      case "medium":
        return <Badge variant="secondary">Medium</Badge>;
      case "high":
        return <Badge variant="destructive">High</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <Alert className={`${getRiskColor(result.riskLevel)} border-2`}>
        <div className="flex items-start gap-3">
          {getRiskIcon(result.riskLevel)}
          <div className="flex-1">
            <AlertTitle className="capitalize">
              {result.riskLevel} Risk Level
            </AlertTitle>
            <AlertDescription>{getRiskMessage(result.riskLevel)}</AlertDescription>
          </div>
        </div>
      </Alert>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>Risk Score</CardTitle>
          <CardDescription>
            Score: {result.score}/100 (Higher score = Higher risk)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={result.score} className="h-4" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Safe</span>
            <span>Dangerous</span>
          </div>
        </CardContent>
      </Card>

      {result.flags.length > 0 && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Red Flags Detected ({result.flags.length})</CardTitle>
            <CardDescription>
              Issues found in the analyzed message
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.flags.map((flag, index) => (
              <div key={index} className="border-l-4 border-destructive pl-4 py-3 bg-muted/30 rounded-r-lg">
                <div className="flex items-center justify-between mb-2">
                  <span>{flag.category}</span>
                  {getSeverityBadge(flag.severity)}
                </div>
                <p className="text-muted-foreground">{flag.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Important Reminder</AlertTitle>
        <AlertDescription>
          Never share passwords, social security numbers, or financial information via email or text.
          When in doubt, contact the company directly using official contact information.
        </AlertDescription>
      </Alert>
    </div>
  );
}
