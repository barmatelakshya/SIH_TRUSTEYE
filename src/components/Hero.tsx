import { Shield, Eye, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

interface HeroProps {
  onTryDemo: () => void;
}

export function Hero({ onTryDemo }: HeroProps) {
  return (
    <div className="gradient-bg text-white py-20 md:py-32 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Threat Detection</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-white text-5xl md:text-7xl tracking-tight">
            See the threat<br />before it strikes
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            Advanced machine learning algorithms analyze URLs and text messages in real-time to protect you from phishing, scams, and malware.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg"
              onClick={onTryDemo}
              className="bg-white text-[#044389] hover:bg-white/90 px-8 py-6 h-auto group"
            >
              <Shield className="h-5 w-5 mr-2" />
              Try Demo Now
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-6 h-auto backdrop-blur-sm"
              onClick={() => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div className="space-y-1">
              <div className="text-3xl md:text-4xl text-white">99.8%</div>
              <div className="text-white/70">Accuracy</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl md:text-4xl text-white">{"<1s"}</div>
              <div className="text-white/70">Scan Time</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl md:text-4xl text-white">100%</div>
              <div className="text-white/70">Private</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
