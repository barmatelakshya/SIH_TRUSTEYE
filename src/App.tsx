import { useState, useEffect } from "react";
import { Eye, Shield, Search, AlertTriangle, Play, BarChart3, GraduationCap, Info, MessageCircle } from "lucide-react";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { ScamIndicators } from "./components/ScamIndicators";
import { AnalysisResults } from "./components/AnalysisResults";
import { Dashboard } from "./components/Dashboard";
import { EducationHub } from "./components/EducationHub";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { analyzeText, analyzeURL } from "./utils/scamDetection";
import { analyzeTextWithBackend, analyzeURLWithBackend } from "./services/api";
import { saveUserData, loadUserData, clearUserData, getDefaultUserData } from "./services/storage";

export default function App() {
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<ReturnType<typeof analyzeText> | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [scanType, setScanType] = useState<"text" | "url">("text");
  const [sessionData, setSessionData] = useState({
    totalScans: 0,
    threatsFound: 0,
    safeMessages: 0
  });
  const [scanHistory, setScanHistory] = useState<Array<{
    id: string;
    type: 'text' | 'url';
    input: string;
    result: string;
    riskLevel: string;
    timestamp: string;
  }>>([]);

  // Load user data on component mount
  useEffect(() => {
    const userData = loadUserData();
    if (userData) {
      setSessionData({
        totalScans: userData.totalScans,
        threatsFound: userData.threatsFound,
        safeMessages: userData.safeMessages
      });
      setScanHistory(userData.scanHistory);
    }
  }, []);

  // Save user data whenever session data changes
  useEffect(() => {
    const userData = {
      ...sessionData,
      scanHistory,
      lastActive: new Date().toISOString()
    };
    saveUserData(userData);
  }, [sessionData, scanHistory]);

  const handleAnalyze = async () => {
    const input = scanType === "text" ? text : url;
    if (input.trim().length === 0) return;
    
    setIsAnalyzing(true);
    
    try {
      let analysis;
      
      // Always use backend API with fallback
      try {
        if (scanType === "text") {
          analysis = await analyzeTextWithBackend(input);
        } else {
          analysis = await analyzeURLWithBackend(input);
        }
      } catch (backendError) {
        console.warn('Backend failed, falling back to frontend analysis');
        // Fallback to frontend analysis
        analysis = scanType === "text" ? analyzeText(input) : analyzeURL(input);
      }
      
      setResult(analysis);
      
      // Update session data
      setSessionData(prev => ({
        totalScans: prev.totalScans + 1,
        threatsFound: prev.threatsFound + (analysis.riskLevel === 'high' || analysis.riskLevel === 'critical' ? 1 : 0),
        safeMessages: prev.safeMessages + (analysis.riskLevel === 'low' ? 1 : 0)
      }));

      // Add to scan history
      const scanRecord = {
        id: Date.now().toString(),
        type: scanType,
        input: input.substring(0, 100) + (input.length > 100 ? '...' : ''), // Truncate for storage
        result: `${analysis.flags.length} flags detected`,
        riskLevel: analysis.riskLevel,
        timestamp: new Date().toISOString()
      };
      
      setScanHistory(prev => [scanRecord, ...prev.slice(0, 49)]); // Keep last 50 scans
      
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setText("");
    setUrl("");
    setResult(null);
  };

  const handleResetSession = () => {
    setText("");
    setUrl("");
    setResult(null);
    setSessionData({
      totalScans: 0,
      threatsFound: 0,
      safeMessages: 0
    });
    setScanHistory([]);
    clearUserData();
  };

  const handleTryDemo = () => {
    const demoText = "URGENT: Your account will be suspended within 24 hours! Click here immediately to verify your password and credit card information. Act now or lose access forever!";
    setText(demoText);
    setUrl("");
    setScanType("text");
    setActiveTab("scanner");
    setTimeout(async () => {
      const analysis = analyzeText(demoText);
      setResult(analysis);
      setSessionData(prev => ({
        totalScans: prev.totalScans + 1,
        threatsFound: prev.threatsFound + (analysis.riskLevel === 'high' || analysis.riskLevel === 'critical' ? 1 : 0),
        safeMessages: prev.safeMessages + (analysis.riskLevel === 'low' ? 1 : 0)
      }));
    }, 300);
  };

  const handleNavigate = (section: string) => {
    setActiveTab(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const exampleScams = [
    {
      title: "Phishing Email",
      text: "URGENT: Your account will be suspended within 24 hours! Click here immediately to verify your password and credit card information. Act now or lose access forever!",
      type: "text"
    },
    {
      title: "Prize Scam",
      text: "Congratulations!! You've won $1,000,000 in our lottery! To claim your prize, send $500 processing fee via gift card. Limited time offer - act now!",
      type: "text"
    },
    {
      title: "Suspicious URL",
      text: "http://secure-bank-verify.tk/login?urgent=true",
      type: "url"
    },
    {
      title: "Fake Package URL",
      text: "https://fedx-redelivery.com/track?id=AB12345&verify=payment",
      type: "url"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header onNavigate={handleNavigate} />

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Tab Navigation - Only show when not on home */}
        {activeTab !== "home" && (
          <div className="sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="container mx-auto px-4">
              <TabsList className="w-full justify-start h-14 bg-transparent rounded-none border-b-0">
                <TabsTrigger value="scanner" className="gap-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  <Shield className="h-4 w-4" />
                  Scanner
                </TabsTrigger>
                <TabsTrigger value="dashboard" className="gap-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="education" className="gap-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  <GraduationCap className="h-4 w-4" />
                  Education
                </TabsTrigger>
                <TabsTrigger value="about" className="gap-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  <Info className="h-4 w-4" />
                  About
                </TabsTrigger>
                <TabsTrigger value="contact" className="gap-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  <MessageCircle className="h-4 w-4" />
                  Contact
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        )}

        {/* Home Tab */}
        <TabsContent value="home" className="m-0">
          <Hero onTryDemo={handleTryDemo} />
          <Features />
        </TabsContent>

        {/* Scanner Tab */}
        <TabsContent value="scanner" className="m-0">
          <div className="py-16 bg-background min-h-screen">
            <div className="container mx-auto px-4">
              <div className="text-center space-y-4 mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                  <Shield className="h-4 w-4" />
                  <span>AI Threat Scanner</span>
                </div>
                <h2>Analyze Messages for Threats</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Advanced ML algorithms for URL & text analysis with real-time detection
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                {/* Input Section */}
                <div className="space-y-6">
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle>Analyze Messages & URLs</CardTitle>
                      <CardDescription>
                        Check emails, text messages, or suspicious URLs for scam indicators
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2 mb-4">
                        <Button
                          variant={scanType === "text" ? "default" : "outline"}
                          onClick={() => setScanType("text")}
                          size="sm"
                        >
                          Text Message
                        </Button>
                        <Button
                          variant={scanType === "url" ? "default" : "outline"}
                          onClick={() => setScanType("url")}
                          size="sm"
                        >
                          URL Link
                        </Button>
                      </div>
                      
                      {scanType === "text" ? (
                        <Textarea
                          placeholder="Paste your email or text message here..."
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          className="min-h-[200px] resize-y"
                        />
                      ) : (
                        <Textarea
                          placeholder="Paste suspicious URL here (e.g., https://example.com/suspicious-link)"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          className="min-h-[100px] resize-y"
                        />
                      )}
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleAnalyze}
                          disabled={(scanType === "text" ? text.trim().length === 0 : url.trim().length === 0) || isAnalyzing}
                          className="flex-1"
                          size="lg"
                        >
                          <Search className="h-4 w-4 mr-2" />
                          {isAnalyzing ? "Analyzing..." : `Analyze ${scanType === "text" ? "Message" : "URL"}`}
                        </Button>
                        <Button
                          onClick={handleClear}
                          variant="outline"
                          size="lg"
                        >
                          Clear
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                        <span>Analysis uses backend API with local fallback for enhanced accuracy</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Try Demo Button */}
                  <Card className="border-2 border-primary/20 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Play className="h-5 w-5" />
                        Quick Demo
                      </CardTitle>
                      <CardDescription>
                        See TrustEye in action with a sample phishing email
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={handleTryDemo}
                        variant="default"
                        className="w-full"
                        size="lg"
                      >
                        Run Demo Analysis
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Example Scams */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Try Example Scams</CardTitle>
                      <CardDescription>
                        Test the analyzer with these common scam examples
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {exampleScams.map((example, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => {
                            if (example.type === "url") {
                              setScanType("url");
                              setUrl(example.text);
                              setText("");
                            } else {
                              setScanType("text");
                              setText(example.text);
                              setUrl("");
                            }
                            setResult(null);
                          }}
                        >
                          {example.title}
                        </Button>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Learn About Scams */}
                  <ScamIndicators />
                </div>

                {/* Results Section */}
                <div className="lg:sticky lg:top-32 lg:h-fit">
                  {result ? (
                    <AnalysisResults result={result} />
                  ) : (
                    <Card className="border-2 border-dashed h-full flex items-center justify-center min-h-[500px]">
                      <CardContent className="text-center text-muted-foreground py-12">
                        <Shield className="h-20 w-20 mx-auto mb-6 opacity-20" />
                        <h3 className="mb-2">Analysis results will appear here</h3>
                        <p className="mb-6">Paste a message and click "Analyze Message" to get started</p>
                        <Button onClick={handleTryDemo} variant="outline">
                          <Play className="h-4 w-4 mr-2" />
                          Try Demo
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="m-0">
          <div className="py-16 bg-muted/30 min-h-screen">
            <div className="container mx-auto px-4">
              <div className="text-center space-y-4 mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 mb-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live Dashboard</span>
                </div>
                <h2>Real-Time Statistics</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Interactive charts and animated updates showing threat detection metrics
                </p>
                <Button 
                  onClick={handleResetSession}
                  variant="outline"
                  size="sm"
                  className="mt-4"
                >
                  Reset Session Data
                </Button>
              </div>
              <Dashboard sessionData={sessionData} scanHistory={scanHistory} />
            </div>
          </div>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="m-0">
          <div className="py-16 bg-background min-h-screen">
            <div className="container mx-auto px-4">
              <div className="text-center space-y-4 mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 mb-4">
                  <span>📚</span>
                  <span>Education Hub</span>
                </div>
                <h2>Learn & Protect Yourself</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Comprehensive learning with quizzes, case studies, and security tips
                </p>
              </div>
              <EducationHub />
            </div>
          </div>
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about" className="m-0">
          <div className="py-16 bg-muted/30 min-h-screen">
            <div className="container mx-auto px-4">
              <About />
            </div>
          </div>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="m-0">
          <div className="py-16 bg-background min-h-screen">
            <div className="container mx-auto px-4">
              <Contact />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="gradient-bg text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/10 backdrop-blur">
                <Eye className="h-7 w-7" />
              </div>
              <div>
                <div className="text-white text-xl tracking-tight">TRUST EYE</div>
                <div className="text-white/70">See the threat before it strikes</div>
              </div>
            </div>
            
            <div className="space-y-3 text-white/80 max-w-3xl mx-auto">
              <p>
                Enterprise Security: XSS protection, input validation, and secure data handling
              </p>
              <p>
                This tool provides automated analysis and should not be your only method of verification.
                When in doubt, always contact companies directly using official contact information from their website.
              </p>
            </div>

            <div className="pt-6 border-t border-white/20 text-white/60">
              © 2025 TrustEye. Privacy-first design with local data storage.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
