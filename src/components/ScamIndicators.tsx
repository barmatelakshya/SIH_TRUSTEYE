import { AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

const indicators = [
  {
    category: "Urgency & Pressure",
    examples: [
      "Act now or your account will be closed",
      "Urgent action required within 24 hours",
      "Limited time offer - respond immediately"
    ]
  },
  {
    category: "Request for Personal Info",
    examples: [
      "Verify your password or SSN",
      "Confirm your bank account details",
      "Update payment information"
    ]
  },
  {
    category: "Suspicious Links",
    examples: [
      "Misspelled URLs (amaz0n.com)",
      "Shortened links hiding destination",
      "Links that don't match claimed sender"
    ]
  },
  {
    category: "Too Good to Be True",
    examples: [
      "You've won a prize you never entered",
      "Get rich quick schemes",
      "Unrealistic returns or promises"
    ]
  },
  {
    category: "Poor Grammar/Spelling",
    examples: [
      "Multiple spelling errors",
      "Awkward phrasing",
      "Generic greetings like 'Dear Customer'"
    ]
  }
];

export function ScamIndicators() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Common Scam Indicators
        </CardTitle>
        <CardDescription>
          Learn to recognize these red flags in emails and text messages
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {indicators.map((indicator, index) => (
          <div key={index}>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{indicator.category}</Badge>
            </div>
            <ul className="space-y-1 text-muted-foreground ml-4">
              {indicator.examples.map((example, exIndex) => (
                <li key={exIndex} className="list-disc">
                  {example}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
