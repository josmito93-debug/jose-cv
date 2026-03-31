import os
import requests
from dotenv import load_dotenv
import alpaca_trade_api as tradeapi

# Cargar las llaves del root que parecen ser las mas recientes
load_dotenv('.env.local')

ALPACA_KEY = os.getenv("ALPACA_API_KEY")
ALPACA_SECRET = os.getenv("ALPACA_SECRET_KEY")
TWELVE_KEY = os.getenv("TWELVE_DATA_API_KEY")
ALPHA_VANTAGE_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")

# Alpaca URL (Forced to Paper for safety)
ALPACA_URL = "https://paper-api.alpaca.markets"

print(f"--- Verificando LLaves de .env.local ---")
print(f"Alpaca Key: {ALPACA_KEY[:5]}...")
print(f"Twelve Key: {TWELVE_KEY[:5]}...")

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
    trade = api.get_latest_crypto_trade("BTC/USD")
    print(f"Alpaca Crypto Trade: {trade.price}")
except Exception as e:
    print(f"Alpaca Error: {e}")
