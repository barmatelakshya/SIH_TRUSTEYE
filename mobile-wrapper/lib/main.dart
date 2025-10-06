import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:io';

void main() {
  runApp(PhishGuardApp());
}

class PhishGuardApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'PhishGuard Mobile',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: MainScreen(),
    );
  }
}

class MainScreen extends StatefulWidget {
  @override
  _MainScreenState createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;
  late WebViewController _webController;
  final String apiUrl = 'http://localhost:8000';

  final List<Widget> _screens = [];

  @override
  void initState() {
    super.initState();
    _screens.addAll([
      WebViewScreen(),
      ScannerScreen(),
      SMSAnalyzerScreen(),
      QRScannerScreen(),
    ]);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        selectedItemColor: Colors.blue[700],
        unselectedItemColor: Colors.grey[600],
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.web),
            label: 'Web',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.search),
            label: 'Scanner',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.sms),
            label: 'SMS',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.qr_code_scanner),
            label: 'QR Code',
          ),
        ],
      ),
    );
  }
}

// WebView Screen
class WebViewScreen extends StatefulWidget {
  @override
  _WebViewScreenState createState() => _WebViewScreenState();
}

class _WebViewScreenState extends State<WebViewScreen> {
  late WebViewController controller;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(NavigationDelegate(
        onPageStarted: (url) => setState(() => isLoading = true),
        onPageFinished: (url) => setState(() => isLoading = false),
      ))
      ..loadRequest(Uri.parse('http://localhost:3000'));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('🛡️ PhishGuard'),
        backgroundColor: Colors.blue[700],
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: () => controller.reload(),
          ),
        ],
      ),
      body: Stack(
        children: [
          WebViewWidget(controller: controller),
          if (isLoading)
            Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Colors.blue[700]!),
              ),
            ),
        ],
      ),
    );
  }
}

// Text/URL Scanner Screen
class ScannerScreen extends StatefulWidget {
  @override
  _ScannerScreenState createState() => _ScannerScreenState();
}

class _ScannerScreenState extends State<ScannerScreen> {
  final TextEditingController _textController = TextEditingController();
  final TextEditingController _urlController = TextEditingController();
  Map<String, dynamic>? _textResult;
  Map<String, dynamic>? _urlResult;
  bool _isAnalyzing = false;

  Future<void> _analyzeText() async {
    if (_textController.text.isEmpty) return;
    
    setState(() => _isAnalyzing = true);
    
    try {
      final response = await http.post(
        Uri.parse('http://localhost:8000/analyze-text'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'text': _textController.text}),
      );
      
      if (response.statusCode == 200) {
        setState(() => _textResult = json.decode(response.body));
      }
    } catch (e) {
      _showError('Failed to analyze text');
    } finally {
      setState(() => _isAnalyzing = false);
    }
  }

  Future<void> _analyzeUrl() async {
    if (_urlController.text.isEmpty) return;
    
    setState(() => _isAnalyzing = true);
    
    try {
      final response = await http.post(
        Uri.parse('http://localhost:8000/analyze-link'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'url': _urlController.text}),
      );
      
      if (response.statusCode == 200) {
        setState(() => _urlResult = json.decode(response.body));
      }
    } catch (e) {
      _showError('Failed to analyze URL');
    } finally {
      setState(() => _isAnalyzing = false);
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: Colors.red),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('🔍 Phishing Scanner'),
        backgroundColor: Colors.blue[700],
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Text Analysis
            Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Text Analysis', style: Theme.of(context).textTheme.headlineSmall),
                    SizedBox(height: 12),
                    TextField(
                      controller: _textController,
                      maxLines: 4,
                      decoration: InputDecoration(
                        hintText: 'Paste suspicious email or message...',
                        border: OutlineInputBorder(),
                      ),
                    ),
                    SizedBox(height: 12),
                    ElevatedButton(
                      onPressed: _isAnalyzing ? null : _analyzeText,
                      child: _isAnalyzing 
                        ? CircularProgressIndicator(color: Colors.white)
                        : Text('Analyze Text'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue[700],
                        foregroundColor: Colors.white,
                        minimumSize: Size(double.infinity, 48),
                      ),
                    ),
                    if (_textResult != null) _buildResult(_textResult!),
                  ],
                ),
              ),
            ),
            
            SizedBox(height: 16),
            
            // URL Analysis
            Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('URL Analysis', style: Theme.of(context).textTheme.headlineSmall),
                    SizedBox(height: 12),
                    TextField(
                      controller: _urlController,
                      decoration: InputDecoration(
                        hintText: 'Enter suspicious URL...',
                        border: OutlineInputBorder(),
                      ),
                    ),
                    SizedBox(height: 12),
                    ElevatedButton(
                      onPressed: _isAnalyzing ? null : _analyzeUrl,
                      child: _isAnalyzing 
                        ? CircularProgressIndicator(color: Colors.white)
                        : Text('Analyze URL'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green[700],
                        foregroundColor: Colors.white,
                        minimumSize: Size(double.infinity, 48),
                      ),
                    ),
                    if (_urlResult != null) _buildResult(_urlResult!),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildResult(Map<String, dynamic> result) {
    final isRisky = result['is_phishing'] == true || result['is_suspicious'] == true;
    final confidence = (result['phishing_score'] ?? result['domain_risk'] ?? 0.0) * 100;
    
    return Container(
      margin: EdgeInsets.only(top: 12),
      padding: EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: isRisky ? Colors.red[50] : Colors.green[50],
        border: Border.all(
          color: isRisky ? Colors.red[300]! : Colors.green[300]!,
          width: 2,
        ),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                isRisky ? Icons.warning : Icons.check_circle,
                color: isRisky ? Colors.red[700] : Colors.green[700],
              ),
              SizedBox(width: 8),
              Text(
                isRisky ? 'SUSPICIOUS' : 'SAFE',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: isRisky ? Colors.red[700] : Colors.green[700],
                ),
              ),
              Spacer(),
              Text('${confidence.toStringAsFixed(1)}%'),
            ],
          ),
          if (result['explanation'] != null) ...[
            SizedBox(height: 8),
            Text(result['explanation']),
          ],
        ],
      ),
    );
  }
}

// SMS Analyzer Screen
class SMSAnalyzerScreen extends StatefulWidget {
  @override
  _SMSAnalyzerScreenState createState() => _SMSAnalyzerScreenState();
}

class _SMSAnalyzerScreenState extends State<SMSAnalyzerScreen> {
  final TextEditingController _smsController = TextEditingController();
  Map<String, dynamic>? _result;
  bool _isAnalyzing = false;

  Future<void> _analyzeSMS() async {
    if (_smsController.text.isEmpty) return;
    
    setState(() => _isAnalyzing = true);
    
    try {
      final response = await http.post(
        Uri.parse('http://localhost:8000/analyze-text'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'text': _smsController.text}),
      );
      
      if (response.statusCode == 200) {
        setState(() => _result = json.decode(response.body));
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to analyze SMS'), backgroundColor: Colors.red),
      );
    } finally {
      setState(() => _isAnalyzing = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('📱 SMS Analyzer'),
        backgroundColor: Colors.blue[700],
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'SMS Content Analysis',
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    SizedBox(height: 12),
                    TextField(
                      controller: _smsController,
                      maxLines: 6,
                      decoration: InputDecoration(
                        hintText: 'Paste SMS content here...\n\nExample: "URGENT: Your account will be suspended. Click here to verify..."',
                        border: OutlineInputBorder(),
                      ),
                    ),
                    SizedBox(height: 16),
                    ElevatedButton.icon(
                      onPressed: _isAnalyzing ? null : _analyzeSMS,
                      icon: _isAnalyzing 
                        ? SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                            ),
                          )
                        : Icon(Icons.security),
                      label: Text(_isAnalyzing ? 'Analyzing...' : 'Analyze SMS'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.orange[700],
                        foregroundColor: Colors.white,
                        minimumSize: Size(double.infinity, 48),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            
            if (_result != null) ...[
              SizedBox(height: 16),
              _buildSMSResult(_result!),
            ],
            
            Spacer(),
            
            // Quick Tips
            Card(
              color: Colors.blue[50],
              child: Padding(
                padding: EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '💡 SMS Phishing Tips:',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    SizedBox(height: 8),
                    Text('• Be wary of urgent language'),
                    Text('• Check sender authenticity'),
                    Text('• Don\'t click suspicious links'),
                    Text('• Verify through official channels'),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSMSResult(Map<String, dynamic> result) {
    final isPhishing = result['is_phishing'] == true;
    final confidence = (result['phishing_score'] ?? 0.0) * 100;
    
    return Card(
      color: isPhishing ? Colors.red[50] : Colors.green[50],
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  isPhishing ? Icons.warning_amber : Icons.verified_user,
                  color: isPhishing ? Colors.red[700] : Colors.green[700],
                  size: 32,
                ),
                SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        isPhishing ? '⚠️ PHISHING DETECTED' : '✅ SMS APPEARS SAFE',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: isPhishing ? Colors.red[700] : Colors.green[700],
                        ),
                      ),
                      Text(
                        'Confidence: ${confidence.toStringAsFixed(1)}%',
                        style: TextStyle(color: Colors.grey[600]),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            
            if (result['explanation'] != null) ...[
              SizedBox(height: 12),
              Text(
                'Analysis:',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 4),
              Text(result['explanation']),
            ],
            
            if (result['recommendations'] != null) ...[
              SizedBox(height: 12),
              Text(
                'Recommendations:',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 4),
              ...((result['recommendations'] as List).map((rec) => 
                Padding(
                  padding: EdgeInsets.only(left: 8, top: 2),
                  child: Text('• $rec'),
                )
              )),
            ],
          ],
        ),
      ),
    );
  }
}

// QR Code Scanner Screen (Future-ready)
class QRScannerScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('📷 QR Scanner'),
        backgroundColor: Colors.blue[700],
        foregroundColor: Colors.white,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.qr_code_scanner,
              size: 100,
              color: Colors.grey[400],
            ),
            SizedBox(height: 24),
            Text(
              'QR Code Scanner',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            SizedBox(height: 12),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 32),
              child: Text(
                'Future feature: AR overlay for QR code scanning and real-time phishing detection',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey[600]),
              ),
            ),
            SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('QR Scanner coming soon!'),
                    backgroundColor: Colors.blue[700],
                  ),
                );
              },
              icon: Icon(Icons.camera_alt),
              label: Text('Open Camera'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue[700],
                foregroundColor: Colors.white,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
