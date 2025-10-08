import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Mail, Github, Clock, Shield, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";

export function Contact() {
  const securityFeatures = [
    {
      name: "XSS Protection Active",
      status: "enabled"
    },
    {
      name: "Input Validation Enabled",
      status: "enabled"
    },
    {
      name: "Data Privacy Compliant",
      status: "enabled"
    },
    {
      name: "Rate Limiting Protection",
      status: "enabled"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 py-12">
        <h2>Contact & Support</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get in touch with our security team
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Contact Information */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Information
            </CardTitle>
            <CardDescription>
              Reach out to our team for support and inquiries
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-muted-foreground mb-1">Email</p>
                  <a 
                    href="mailto:lakshyabarmate@gmail.com"
                    className="text-primary hover:underline"
                  >
                    lakshyabarmate@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <Github className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-muted-foreground mb-1">GitHub Repository</p>
                  <Button 
                    variant="link" 
                    className="h-auto p-0 text-primary"
                    onClick={() => window.open('https://github.com', '_blank')}
                  >
                    View on GitHub
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <Clock className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-muted-foreground mb-1">Availability</p>
                  <p className="text-green-600">Available 24/7 for threat detection</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Features */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Features
            </CardTitle>
            <CardDescription>
              Enterprise-grade protection and compliance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {securityFeatures.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>{feature.name}</span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 capitalize">
                    {feature.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info Card */}
      <Card className="max-w-5xl mx-auto bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            <h3>Need Help?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our security team is committed to helping you stay safe online. Whether you have questions about a suspicious message or need technical support, we're here to assist you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg"
                onClick={() => window.location.href = 'mailto:lakshyabarmate@gmail.com'}
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => window.open('https://github.com', '_blank')}
              >
                <Github className="h-4 w-4 mr-2" />
                View Repository
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ or Additional Resources */}
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle>Response Time</CardTitle>
          <CardDescription>What to expect when you reach out</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-2 p-4">
              <div className="text-3xl text-primary">{"<2h"}</div>
              <p className="text-muted-foreground">Critical Security Issues</p>
            </div>
            <div className="text-center space-y-2 p-4">
              <div className="text-3xl text-primary">{"<24h"}</div>
              <p className="text-muted-foreground">General Inquiries</p>
            </div>
            <div className="text-center space-y-2 p-4">
              <div className="text-3xl text-primary">24/7</div>
              <p className="text-muted-foreground">Automated Detection</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
