'use client'
import Link from 'next/link'

export default function About() {
  const teamMembers = [
    {
      name: "Lakshya Barmate",
      role: "Lead Developer & AI Specialist",
      github: "https://github.com/barmatelakshya",
      skills: ["Machine Learning", "NLP", "Backend Development"]
    },
    {
      name: "Team Member 2",
      role: "Frontend Developer",
      github: "https://github.com/member2",
      skills: ["React", "UI/UX", "Mobile Development"]
    },
    {
      name: "Team Member 3", 
      role: "Security Researcher",
      github: "https://github.com/member3",
      skills: ["Cybersecurity", "Threat Analysis", "GNN"]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">🛡️ PhishGuard</span>
            </Link>
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-indigo-600">Home</Link>
              <Link href="/how-it-works" className="text-gray-700 hover:text-indigo-600">How It Works</Link>
              <Link href="/demo" className="text-gray-700 hover:text-indigo-600">Demo</Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600">Dashboard</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About PhishGuard</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            An AI-powered phishing detection system developed for Smart India Hackathon 2024, 
            combining advanced machine learning techniques to protect users from cyber threats.
          </p>
        </div>

        {/* SIH Context */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Smart India Hackathon 2024</h2>
              <p className="text-gray-600 mb-4">
                PhishGuard was developed as part of Smart India Hackathon 2024, addressing the critical 
                need for advanced cybersecurity solutions in today's digital landscape.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-indigo-600 mr-2">🎯</span>
                  <span><strong>Problem Statement:</strong> AI-powered phishing detection</span>
                </div>
                <div className="flex items-center">
                  <span className="text-indigo-600 mr-2">🏆</span>
                  <span><strong>Category:</strong> Cybersecurity & Digital Innovation</span>
                </div>
                <div className="flex items-center">
                  <span className="text-indigo-600 mr-2">📅</span>
                  <span><strong>Timeline:</strong> October 2024</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-8 rounded-lg">
              <div className="text-center">
                <div className="text-6xl mb-4">🇮🇳</div>
                <h3 className="text-xl font-semibold mb-2">Digital India Initiative</h3>
                <p className="text-gray-600">
                  Contributing to India's digital security infrastructure through innovative AI solutions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Technology Stack</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="font-semibold mb-2">AI/ML Backend</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>FastAPI</li>
                <li>Scikit-learn</li>
                <li>Natural Language Processing</li>
                <li>Graph Neural Networks</li>
              </ul>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="font-semibold mb-2">Frontend</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Next.js</li>
                <li>React</li>
                <li>Tailwind CSS</li>
                <li>Responsive Design</li>
              </ul>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="font-semibold mb-2">Extensions</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Chrome Extension</li>
                <li>Flutter Mobile App</li>
                <li>Real-time Protection</li>
                <li>Cross-platform Support</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👨‍💻</span>
                </div>
                <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                <p className="text-indigo-600 text-sm mb-3">{member.role}</p>
                <div className="flex flex-wrap justify-center gap-1 mb-4">
                  {member.skills.map((skill, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
                <a 
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-gray-600 hover:text-indigo-600 transition"
                >
                  <span className="mr-1">📱</span>
                  GitHub Profile
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Project Links */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Project Resources</h2>
            <p className="text-indigo-100">
              Explore our open-source implementation and contribute to the project
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <a 
              href="https://github.com/barmatelakshya/barmatelakshya.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 hover:bg-opacity-30 transition"
            >
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">📱</span>
                <h3 className="font-semibold">GitHub Repository</h3>
              </div>
              <p className="text-indigo-100 text-sm">
                Complete source code, documentation, and setup instructions
              </p>
            </a>
            
            <a 
              href="https://barmatelakshya.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 hover:bg-opacity-30 transition"
            >
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">🌐</span>
                <h3 className="font-semibold">Live Demo</h3>
              </div>
              <p className="text-indigo-100 text-sm">
                Try the live version of PhishGuard in your browser
              </p>
            </a>
          </div>
          
          <div className="text-center mt-8">
            <Link href="/demo" className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Try PhishGuard Now
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Get In Touch</h2>
          <p className="text-gray-600 mb-6">
            Have questions about PhishGuard or want to collaborate? We'd love to hear from you!
          </p>
          <div className="flex justify-center space-x-6">
            <a href="mailto:contact@phishguard.dev" className="text-indigo-600 hover:text-indigo-800 transition">
              📧 Email Us
            </a>
            <a href="https://github.com/barmatelakshya" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 transition">
              📱 GitHub
            </a>
            <a href="https://linkedin.com/in/lakshya-barmate" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 transition">
              💼 LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
