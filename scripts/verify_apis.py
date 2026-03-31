import os
import requests
import json
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()
load_dotenv('python_bot/.env')

def test_api(name, test_fn):
    print(f"🔍 Testing {name}...")
    try:
        success, message = test_fn()
        if success:
            print(f"✅ {name}: {message}")
        else:
            print(f"❌ {name}: {message}")
        return success
    except Exception as e:
        print(f"💥 {name} CRASHED: {e}")
        return False

def test_alpaca():
    key = os.getenv("ALPACA_API_KEY")
    secret = os.getenv("ALPACA_SECRET_KEY")
    url = "https://paper-api.alpaca.markets"
    if not key or not secret: return False, "Missing Keys"
    headers = {"APCA-API-KEY-ID": key, "APCA-API-SECRET-KEY": secret}
    resp = requests.get(f"{url}/v2/account", headers=headers, timeout=10)
    if resp.status_code == 200:
        return True, "Connected Successfully"
    return False, f"Status {resp.status_code}: {resp.text}"

def test_gemini():
    key = os.getenv("GEMINI_API_KEY")
    if not key: return False, "Missing Key"
    resp = requests.get(f"https://generativelanguage.googleapis.com/v1beta/models?key={key}", timeout=10)
    if resp.status_code == 200:
        return True, "Neural Link Active"
    return False, resp.text

def test_twelvedata():
    key = os.getenv("TWELVE_DATA_API_KEY")
    if not key: return False, "Missing Key"
    resp = requests.get(f"https://api.twelvedata.com/quote?symbol=BTC/USD&apikey={key}", timeout=10)
    if resp.status_code == 200:
        return True, "Price Feed Online"
    return False, resp.text

def test_alphavantage():
    key = os.getenv("ALPHA_VANTAGE_API_KEY")
    if not key: return False, "Missing Key"
    resp = requests.get(f"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey={key}", timeout=10)
    if "Global Quote" in resp.text:
        return True, "Market Intel Online"
    return False, resp.text

def test_airtable():
    key = os.getenv("AIRTABLE_API_KEY")
    base_id = os.getenv("AIRTABLE_BASE_ID")
    if not key or not base_id: return False, "Missing Config"
    headers = {"Authorization": f"Bearer {key}"}
    resp = requests.get(f"https://api.airtable.com/v0/{base_id}/Trading%20Logs?maxRecords=1", headers=headers, timeout=10)
    if resp.status_code == 200:
        return True, "Ledger Sync Online"
    return False, resp.text

def test_postman():
    key = os.getenv("POSTMAN_API_KEY")
    if not key: return False, "Missing Key"
    resp = requests.get("https://api.getpostman.com/me", headers={"X-Api-Key": key}, timeout=10)
    if resp.status_code == 200:
        return True, f"Legacy Interface Online (User: {resp.json().get('user', {}).get('username', 'Active')})"
    return False, resp.text

if __name__ == "__main__":
    print(f"🚀 JF.OS API DIAGNOSTIC - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*50)
    
    results = [
        test_api("Alpaca (Trading)", test_alpaca),
        test_api("Gemini (Neural Brain)", test_gemini),
        test_api("Twelve Data (Price Feed)", test_twelvedata),
        test_api("Alpha Vantage (Market Intel)", test_alphavantage),
        test_api("Airtable (Database)", test_airtable),
        test_api("Postman (Legacy Interface)", test_postman)
    ]
    
    print("="*50)
    if all(results):
        print("🎉 STATUS: ALL SYSTEMS GO. 100% OPERATIONAL.")
    else:
        print("⚠️ STATUS: DEGRADED. Some services failed.")
