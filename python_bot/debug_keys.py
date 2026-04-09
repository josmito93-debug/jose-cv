import os
import requests
from dotenv import load_dotenv
import alpaca_trade_api as tradeapi

load_dotenv('python_bot/.env')

ALPACA_KEY = os.getenv("ALPACA_API_KEY")
ALPACA_SECRET = os.getenv("ALPACA_SECRET_KEY")
ALPACA_URL = os.getenv("ALPACA_BASE_URL")
TWELVE_KEY = os.getenv("TWELVE_DATA_API_KEY")
ALPHA_VANTAGE_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")

print(f"--- API Verification ---")

# Test TwelveData
print(f"Testing TwelveData...")
resp = requests.get(f"https://api.twelvedata.com/price?symbol=BTC/USD&apikey={TWELVE_KEY}").json()
print(f"TwelveData Response: {resp}")

# Test Alpaca
print(f"Testing Alpaca...")
try:
    api = tradeapi.REST(ALPACA_KEY, ALPACA_SECRET, ALPACA_URL, api_version='v2')
    acct = api.get_account()
    print(f"Alpaca Account: {acct.status}")
    trade = api.get_latest_crypto_trade("BTC/USD") # For crypto
    print(f"Alpaca Crypto Trade: {trade.price}")
except Exception as e:
    print(f"Alpaca Error: {e}")

# Test AlphaVantage
print(f"Testing AlphaVantage...")
resp = requests.get(f"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=BTC&apikey={ALPHA_VANTAGE_KEY}").json()
print(f"AlphaVantage Response: {resp}")
