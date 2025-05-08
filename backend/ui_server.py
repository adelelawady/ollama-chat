from flask import Flask, send_from_directory
from pathlib import Path
import os
import sys
from waitress import serve
import argparse

app = Flask(__name__)

def get_build_dir():
    """Get the correct build directory path for both development and production"""
    if getattr(sys, 'frozen', False):
        # If the application is run as a bundle (exe)
        base_path = sys._MEIPASS
        return os.path.join(base_path, 'dist')
    else:
        # If the application is run from Python interpreter
        return str(Path(__file__).parent.parent / "dist")

# Get the directory containing the UI build files
BUILD_DIR = get_build_dir()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_path(path):
    try:
        if path and os.path.exists(os.path.join(BUILD_DIR, path)):
            return send_from_directory(BUILD_DIR, path)
        return send_from_directory(BUILD_DIR, 'index.html')
    except Exception as e:
        print(f"Error serving files: {e}")
        print(f"Current BUILD_DIR: {BUILD_DIR}")
        print(f"Requested path: {path}")
        return f"Error: {str(e)}", 500

@app.after_request
def add_header(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = '*'
    
    # Ensure correct MIME types for JavaScript modules
    if response.mimetype == 'text/html' and response.headers.get('Content-Type', '').endswith('.js'):
        response.headers['Content-Type'] = 'application/javascript'
    elif response.mimetype == 'text/html' and response.headers.get('Content-Type', '').endswith('.mjs'):
        response.headers['Content-Type'] = 'application/javascript'
    
    return response

def run_production_server(port=8080):
    """Production server using Waitress"""
    try:
        print(f"Starting production server on port {port}")
        print(f"Serving files from: {BUILD_DIR}")
        serve(app, host='0.0.0.0', port=port, threads=4)
    except Exception as e:
        print(f"Error starting production server: {e}")
        sys.exit(1)

def run_development_server(port=8080):
    """Development server with debug mode"""
    try:
        print(f"Starting development server on port {port}")
        print(f"Serving files from: {BUILD_DIR}")
        app.run(host='0.0.0.0', port=port, debug=True)
    except Exception as e:
        print(f"Error starting development server: {e}")
        sys.exit(1)

def run_ui_server(port=8080, env='production'):
    """Main server runner that handles both production and development"""
    try:
        # Verify the build directory exists
        if not os.path.exists(BUILD_DIR):
            print(f"Error: Build directory not found at {BUILD_DIR}")
            sys.exit(1)
        
        print(f"Starting UI server on port {port} in {env} mode...")
        print(f"Serving files from: {BUILD_DIR}")
        
        if env == 'development':
            app.run(host='0.0.0.0', port=port, debug=True)
        else:
            serve(app, host='0.0.0.0', port=port, threads=4)
            
    except Exception as e:
        print(f"Error starting UI server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_ui_server() 