import { Shield, BarChart3, GraduationCap, Lock, Zap, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

const features = [
  {
    icon: Shield,
    title: "AI Threat Scanner",
    description: "Advanced ML algorithms for URL & text analysis with real-time detection",
    color: "text-blue-500"
  },
  {
    icon: BarChart3,
    title: "Live Dashboard",
    description: "Real-time stats with interactive charts and animated updates",
    color: "text-green-500"
  },
  {
    icon: GraduationCap,
    title: "Education Hub",
    description: "Comprehensive learning with quizzes, case studies, and tips",
    color: "text-purple-500"
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "XSS protection, input validation, and secure data handling",
    color: "text-red-500"
  },
  {
    icon: Zap,
    title: "Instant Analysis",
    description: "Get results in under a second with our optimized detection engine",
    color: "text-yellow-500"
  },
  {
    icon: Globe,
    title: "Cross-Platform",
    description: "Works seamlessly across all devices and platforms",
    color: "text-cyan-500"
  }
];

export function Features() {
  return (
    <div className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2>Powerful Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to stay safe from digital threats, all in one platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4 ${feature.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
