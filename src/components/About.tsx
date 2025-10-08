import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Eye, Target, Lightbulb, CheckCircle, Shield, BarChart3, GraduationCap, Lock } from "lucide-react";

export function About() {
  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "AI Threat Scanner",
      description: "Advanced ML algorithms for URL & text analysis with real-time detection"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Live Dashboard",
      description: "Real-time stats with interactive charts and animated updates"
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Education Hub",
      description: "Comprehensive learning with quizzes, case studies, and tips"
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Enterprise Security",
      description: "XSS protection, input validation, and secure data handling"
    }
  ];

  const keyFeatures = [
    "URL and text scanning",
    "Real-time dashboard with charts and history",
    "Educational content and phishing quiz",
    "Cross-platform compatibility",
    "Dark/light mode with theme persistence",
    "Local data storage and privacy-first design"
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Eye className="h-12 w-12 text-primary" />
        </div>
        <h2>"See the threat before it strikes."</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          TrustEye is an AI-powered threat detection platform that scans URLs and text in real time to prevent phishing, scams, and malware. Designed with accessibility in mind, it empowers users to detect threats instantly across devices.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Project Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="mb-2">Problem Statement</h4>
            <p className="text-muted-foreground">
              Every day, users fall victim to digital threats due to deceptive links, fake messages, and lack of cybersecurity awareness. Traditional tools are either too technical or inaccessible for everyday users.
            </p>
          </div>

          <div>
            <h4 className="mb-2">Solution Summary</h4>
            <p className="text-muted-foreground">
              TrustEye combines AI-based detection, interactive dashboards, and educational content to deliver a complete cybersecurity experience. With dark/light mode and real-time feedback, it's built for inclusivity and impact.
            </p>
          </div>

          <div>
            <h4 className="mb-2">Key Features</h4>
            <ul className="grid md:grid-cols-2 gap-2 mt-3">
              {keyFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-2 flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Impact Statement
            </h4>
            <p className="text-muted-foreground">
              TrustEye is more than a tool — it's a learning platform that builds digital resilience. By combining detection with education, it helps users recognize threats, respond wisely, and stay safe online.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="gradient-bg text-white border-0">
        <CardContent className="text-center py-12">
          <h3 className="mb-4 text-white">Ready to Protect Yourself?</h3>
          <p className="mb-6 text-white/90">
            Try a demo scan, explore the dashboard, or test your phishing awareness — TrustEye is ready to protect.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
