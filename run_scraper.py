#!/usr/bin/env python3
"""
Simple script to run the Udyam web scraper
"""

import sys
import os

# Add the scraper directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'scraper'))

try:
    from udyam_scraper import main
    print("Starting Udyam Registration Portal Scraper...")
    main()
except ImportError as e:
    print(f"Error importing scraper: {e}")
    print("Please make sure you have installed the required dependencies:")
    print("cd scraper && pip install -r requirements.txt")
    sys.exit(1)
except Exception as e:
    print(f"Error running scraper: {e}")
    sys.exit(1) 