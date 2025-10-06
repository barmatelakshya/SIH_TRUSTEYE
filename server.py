#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import threading
import time

PORT = 8080

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def open_browser():
    time.sleep(1)
    webbrowser.open(f'http://localhost:{PORT}')

if __name__ == "__main__":
    import os
    os.chdir('/Users/barmate_lakshya/Documents/SIH_NEW')
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"🚀 TrustEye Server running at http://localhost:{PORT}")
        threading.Thread(target=open_browser).start()
        httpd.serve_forever()
