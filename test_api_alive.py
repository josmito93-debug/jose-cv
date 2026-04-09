import sys
import os
import json
from dotenv import load_dotenv

# Load env variables directly in the test before importing API
load_dotenv('/Users/josefigueroa/Desktop/websites/jose-cv/.env.local')

# Add api directory to path to import main
sys.path.append('/Users/josefigueroa/Desktop/websites/jose-cv/api')

from main import get_trading_stats, get_positions, get_history, health_check

def test_api():
    print("Testing /api/health...")
    print(json.dumps(health_check(), indent=2))
    
    print("\nTesting /api/trading/stats...")
    stats = get_trading_stats()
    print(json.dumps(stats, indent=2))
    
    print("\nTesting /api/trading/positions...")
    positions = get_positions()
    print(json.dumps(positions, indent=2))
    
    print("\nTesting /api/trading/history (first 2 records)...")
    history = get_history()
    if isinstance(history, list) and len(history) > 0:
        print(json.dumps(history[:2], indent=2))
    else:
        print(json.dumps(history, indent=2))

if __name__ == "__main__":
    test_api()
