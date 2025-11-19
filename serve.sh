#!/bin/bash

# Simple script to serve the static portfolio locally

echo "🚀 Starting local server for static portfolio..."
echo ""
echo "Choose your preferred method:"
echo "1) Python 3 (recommended)"
echo "2) Python 2"
echo "3) PHP"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo "Starting Python 3 server on http://localhost:8000"
        python3 -m http.server 8000
        ;;
    2)
        echo "Starting Python 2 server on http://localhost:8000"
        python -m SimpleHTTPServer 8000
        ;;
    3)
        echo "Starting PHP server on http://localhost:8000"
        php -S localhost:8000
        ;;
    *)
        echo "Invalid choice. Defaulting to Python 3..."
        python3 -m http.server 8000
        ;;
esac
