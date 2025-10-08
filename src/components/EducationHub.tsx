import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { BookOpen, GraduationCap, CheckCircle, XCircle, Lightbulb } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const quizQuestions = [
  {
    id: 1,
    question: "You receive an email claiming your bank account has been compromised. What should you do?",
    options: [
      "Click the link in the email to reset your password immediately",
      "Call your bank using the number on their official website",
      "Reply to the email asking for more information",
      "Forward it to friends to warn them"
    ],
    correct: 1,
    explanation: "Always contact financial institutions directly using official contact information, never through links in emails."
  },
  {
    id: 2,
    question: "Which of these is a red flag for phishing emails?",
    options: [
      "Personalized greeting with your name",
      "Generic greeting like 'Dear Customer'",
      "Company logo in the header",
      "Professional email signature"
    ],
    correct: 1,
    explanation: "Generic greetings are common in phishing emails because scammers send mass emails without personalization."
  },
  {
    id: 3,
    question: "A text message says you won a prize you never entered for. What's the best action?",
    options: [
      "Click the link to claim your prize",
      "Text back to confirm you're interested",
      "Delete the message and ignore it",
      "Share it on social media"
    ],
    correct: 2,
    explanation: "Legitimate contests require you to enter. Unsolicited prize notifications are almost always scams."
  }
];

const caseStudies = [
  {
    title: "The CEO Fraud",
    description: "An employee received an urgent email appearing to be from the CEO requesting an immediate wire transfer.",
    threat: "Business Email Compromise (BEC)",
    outcome: "The employee verified the request by calling the CEO directly, preventing a $50,000 loss.",
    lesson: "Always verify urgent requests through a secondary channel, especially those involving money or sensitive data."
  },
  {
    title: "The Gift Card Scam",
    description: "A victim received a text from someone claiming to be their boss asking them to purchase gift cards urgently.",
    threat: "Impersonation Scam",
    outcome: "The victim purchased $500 in gift cards before realizing it was a scam.",
    lesson: "Legitimate employers never ask employees to purchase gift cards. Always verify unusual requests."
  },
  {
    title: "The IRS Phone Call",
    description: "A caller claimed to be from the IRS threatening immediate arrest for unpaid taxes.",
    threat: "Government Impersonation",
    outcome: "The victim recognized the scam tactics (urgency, threats) and hung up immediately.",
    lesson: "Government agencies like the IRS communicate via mail first, never threaten arrest over the phone."
  }
];

const securityTips = [
  {
    category: "Email Security",
    tips: [
      "Verify sender email addresses carefully - look for misspellings",
      "Hover over links before clicking to see the actual URL",
      "Be wary of unexpected attachments, even from known contacts",
      "Enable two-factor authentication on all email accounts"
    ]
  },
  {
    category: "Password Safety",
    tips: [
      "Use unique passwords for each account",
      "Create passwords with 12+ characters including symbols",
      "Use a password manager to store credentials securely",
      "Never share passwords via email or text"
    ]
  },
  {
    category: "Mobile Security",
    tips: [
      "Don't click links in unsolicited text messages",
      "Verify apps before downloading from app stores",
      "Keep your phone's operating system updated",
      "Be cautious of QR codes from unknown sources"
    ]
  }
];

export function EducationHub() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
    
    if (index === quizQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizComplete(false);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="quiz" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quiz">
            <GraduationCap className="h-4 w-4 mr-2" />
            Phishing Quiz
          </TabsTrigger>
          <TabsTrigger value="cases">
            <BookOpen className="h-4 w-4 mr-2" />
            Case Studies
          </TabsTrigger>
          <TabsTrigger value="tips">
            <Lightbulb className="h-4 w-4 mr-2" />
            Security Tips
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quiz" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Your Phishing Awareness</CardTitle>
              <CardDescription>
                Answer questions to improve your scam detection skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!quizComplete ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">
                      Question {currentQuestion + 1} of {quizQuestions.length}
                    </Badge>
                    <p className="text-muted-foreground">Score: {score}</p>
                  </div>

                  <div className="space-y-4">
                    <h3>{quizQuestions[currentQuestion].question}</h3>
                    
                    <div className="space-y-2">
                      {quizQuestions[currentQuestion].options.map((option, index) => (
                        <Button
                          key={index}
                          variant={
                            showResult
                              ? index === quizQuestions[currentQuestion].correct
                                ? "default"
                                : index === selectedAnswer
                                ? "destructive"
                                : "outline"
                              : selectedAnswer === index
                              ? "secondary"
                              : "outline"
                          }
                          className="w-full justify-start h-auto py-3 px-4"
                          onClick={() => !showResult && handleAnswer(index)}
                          disabled={showResult}
                        >
                          <span className="text-left">
                            {showResult && index === quizQuestions[currentQuestion].correct && (
                              <CheckCircle className="h-4 w-4 inline mr-2" />
                            )}
                            {showResult && index === selectedAnswer && index !== quizQuestions[currentQuestion].correct && (
                              <XCircle className="h-4 w-4 inline mr-2" />
                            )}
                            {option}
                          </span>
                        </Button>
                      ))}
                    </div>

                    {showResult && (
                      <Alert>
                        <AlertTitle>
                          {selectedAnswer === quizQuestions[currentQuestion].correct ? "Correct!" : "Incorrect"}
                        </AlertTitle>
                        <AlertDescription>
                          {quizQuestions[currentQuestion].explanation}
                        </AlertDescription>
                      </Alert>
                    )}

                    {showResult && (
                      <Button onClick={handleNext} className="w-full">
                        {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4 py-8">
                  <GraduationCap className="h-16 w-16 mx-auto text-primary" />
                  <h3>Quiz Complete!</h3>
                  <p>
                    You scored {score} out of {quizQuestions.length}
                  </p>
                  <p className="text-muted-foreground">
                    {score === quizQuestions.length
                      ? "Perfect score! You're a scam detection expert!"
                      : score >= quizQuestions.length / 2
                      ? "Good job! Keep learning to improve your skills."
                      : "Review the case studies and tips to improve your awareness."}
                  </p>
                  <Button onClick={resetQuiz}>Retake Quiz</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cases" className="space-y-4">
          {caseStudies.map((study, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{study.title}</CardTitle>
                <Badge variant="destructive" className="w-fit">{study.threat}</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="mb-2">Scenario:</p>
                  <p className="text-muted-foreground">{study.description}</p>
                </div>
                <div>
                  <p className="mb-2">Outcome:</p>
                  <p className="text-muted-foreground">{study.outcome}</p>
                </div>
                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertTitle>Key Lesson</AlertTitle>
                  <AlertDescription>{study.lesson}</AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="tips" className="space-y-4">
          {securityTips.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{section.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
