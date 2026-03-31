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
    url = os.getenv("ALPACA_BASE_URL") or "https://paper-api.alpaca.markets"
    if not key or not secret: return False, "Missing Keys"
    
    headers = {"APCA-API-KEY-ID": key, "APCA-API-SECRET-KEY": secret}
    resp = requests.get(f"{url}/v2/account", headers=headers)
    if resp.status_code == 200:
        return True, "Connected Successfully"
    return False, f"Status {resp.status_code}: {resp.text}"

def test_gemini():
    key = os.getenv("GEMINI_API_KEY")
    if not key: return False, "Missing Key"
    import google.generativeai as genai
    genai.configure(api_key=key)
    # Try common model names
    for model_name in ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-pro']:
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content("Repite: JF.OS Operativo")
            return True, f"AI Response ({model_name}): {response.text.strip()}"
        except Exception:
            continue
    return False, "Failed to connect to any Gemini model."

def test_newsapi():
    key = os.getenv("NEWS_API_KEY")
    if not key: return False, "Missing Key"
    resp = requests.get(f"https://newsapi.org/v2/top-headlines?country=us&apiKey={key}")
    if resp.status_code == 200:
        return True, f"Fetched {resp.json().get('totalResults')} news items"
    return False, resp.text

def test_finnhub():
    key = os.getenv("FINNHUB_API_KEY")
    if not key: return False, "Missing Key"
    resp = requests.get(f"https://finnhub.io/api/v1/news?category=general&token={key}")
    if resp.status_code == 200:
        return True, "Connected Successfully"
    return False, resp.text

def test_alphavantage():
    key = os.getenv("ALPHA_VANTAGE_API_KEY")
    if not key: return False, "Missing Key"
    resp = requests.get(f"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey={key}")
    if "Global Quote" in resp.text:
        return True, "Connected Successfully"
    return False, resp.text

def test_airtable():
    key = os.getenv("AIRTABLE_API_KEY")
    base_id = os.getenv("AIRTABLE_BASE_ID")
    if not key or not base_id: return False, "Missing Config"
    headers = {"Authorization": f"Bearer {key}"}
    resp = requests.get(f"https://api.airtable.com/v0/{base_id}/Trading%20Logs", headers=headers)
    if resp.status_code == 200:
        return True, "Connected Successfully"
    return False, resp.text

if __name__ == "__main__":
    print(f"🚀 JF.OS API DIAGNOSTIC - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*50)
    
    results = [
        test_api("Alpaca (Trading)", test_alpaca),
        test_api("Gemini (Neural Brain)", test_gemini),
        test_api("NewsAPI (Global Intel)", test_newsapi),
        test_api("Finnhub (Institutional Intel)", test_finnhub),
        test_api("Alpha Vantage (Market Trends)", test_alphavantage),
        test_api("Airtable (Database)", test_airtable)
    ]
    
    print("="*50)
    if all(results):
        print("🎉 STATUS: ALL SYSTEMS GO. 100% OPERATIONAL.")
    else:
        print("⚠️ STATUS: DEGRADED. Some services failed.")
