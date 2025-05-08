import uvicorn
import os
import sys
import argparse
from main import app  # Import the FastAPI app from main.py
import subprocess
import multiprocessing
from ui_server import run_ui_server

def resource_path(relative_path):
    """Get absolute path to resource, works for dev and for PyInstaller"""
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")

    return os.path.join(base_path, relative_path)


def get_environment():
    """Determine the environment (production/development)"""
    if getattr(sys, 'frozen', False):
        # Running as bundled exe
        try:
            env_file = os.path.join(sys._MEIPASS, 'env.txt')
            if os.path.exists(env_file):
                with open(env_file, 'r') as f:
                    return f.read().strip()
        except Exception:
            pass
        # Default to production for bundled exe
        return 'production'
    # Get from command line args or default
    return None  # Will be set by argparse later

def run_ui_server_process(port, env):
    """Wrapper function to run UI server without argument parsing"""
    try:
        run_ui_server(port=port, env=env)
    except Exception as e:
        print(f"UI server error: {e}")
        sys.exit(1)

def main():
    # Handle multiprocessing freeze support for Windows
    if sys.platform.startswith('win'):
        multiprocessing.freeze_support()
    
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Run the Clipify Backend Server')
    parser.add_argument('--port', type=int, default=5000,
                      help='Port to run the server on (default: 5000)')
    parser.add_argument('--ui-port', type=int, default=8080,
                      help='Port to run the UI server on (default: 8080)')
    parser.add_argument('--env', choices=['development', 'production'], 
                      default=get_environment() or 'production',
                      help='Environment to run the servers in (default: production)')
    
    # Only parse known args to avoid issues with multiprocessing
    args, _ = parser.parse_known_args()

    # Check and setup FFmpeg
    # check_ffmpeg()

    # Create required directories
    # create_required_directories()

    # Ensure settings.json exists, create with defaults if not
    # Determine the path to the settings file
    #settings_path = os.path.join(os.getcwd(), 'settings.json')
    
    # Check if the settings file exists
    #if not os.path.exists(settings_path):
        # If not, print a message and create default settings
    #    print(f"Settings file not found. Creating default settings at {settings_path}")
    #    settings_path = create_default_settings()
    #else:
        # If the file exists, update the font path in the settings
        #with open(settings_path, 'r') as f:
        #    settings = json.load(f)
        #font_path = download_bangers_font()
        # Check if the font path is not already set in the settings
        #        if not settings.get('videoProcessorOptions', {}).get('font'):
    #        # If not, set the font path in the settings
    #        settings['videoProcessorOptions']['font'] = font_path
    #        # Save the updated settings back to the file
    #        with open(settings_path, 'w') as f:
    #            json.dump(settings, f, indent=2)

    # Start UI server in a separate process with environment setting
    ui_process = multiprocessing.Process(
        target=run_ui_server_process,
        args=(args.ui_port, args.env)
    )
    ui_process.start()
    print(f"UI server started on port {args.ui_port} in {args.env} mode")

    # Run the existing app from main.py with specified port
    print(f"Starting API server on port {args.port} in {args.env} mode")
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=args.port, 
        reload=(args.env == 'development')
    )

    # Clean up UI server process when main process exits
    ui_process.terminate()
    ui_process.join()

if __name__ == "__main__":
    main()