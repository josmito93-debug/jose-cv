import os
import time
import requests
import chromadb
import google.generativeai as genai
from datetime import datetime, timedelta
from dotenv import load_dotenv
import alpaca_trade_api as tradeapi

# ==============================================================================
# SELF-CORRECTION LOOP (VILLASMIL-OMEGA)
# ==============================================================================
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

ALPACA_KEY = os.getenv("ALPACA_API_KEY")
ALPACA_SECRET = os.getenv("ALPACA_SECRET_KEY")
ALPACA_BASE_URL = os.getenv("ALPACA_BASE_URL")
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
AIRTABLE_API_KEY = os.getenv("AIRTABLE_API_KEY")
AIRTABLE_BASE_ID = os.getenv("AIRTABLE_BASE_ID")

api = tradeapi.REST(ALPACA_KEY, ALPACA_SECRET, ALPACA_BASE_URL, api_version='v2')
genai.configure(api_key=GEMINI_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

chroma_client = chromadb.PersistentClient(path="./chroma_db")

def get_latest_logs():
    url = f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/Trading%20Logs?maxRecords=10&sort[0][field]=Timestamp&sort[0][direction]=desc"
    headers = {"Authorization": f"Bearer {AIRTABLE_API_KEY}"}
    resp = requests.get(url, headers=headers).json()
    return resp.get("records", [])

def run_self_correction():
    print("🧠 Starting JF.OS Self-Correction Loop...")
    
    # 1. Get recent logs from Airtable
    logs = get_latest_logs()
    
    # 2. Get closed trades from Alpaca
    # For simplicity, we check trades in the last 24h
    now = datetime.utcnow()
    since = (now - timedelta(days=1)).strftime('%Y-%m-%dT%H:%M:%SZ')
    
    orders = api.list_orders(status='all', after=since, limit=50)
    
    for log in logs:
        fields = log["fields"]
        symbol = fields.get("Simbolo")
        accion = fields.get("Accion")
        razon_original = fields.get("Razon")
        timestamp_log = fields.get("Timestamp")
        
        if not symbol or not accion or accion == "ESPERA":
            continue
            
        # Find matching order in Alpaca
        match = None
        for o in orders:
            # Match by symbol and side
            side_match = (accion == "COMPRA" and o.side == "buy") or (accion == "VENTA" and o.side == "sell")
            if o.symbol.replace("USD", "") in symbol and side_match:
                match = o
                break
        
        if match and match.status == 'filled':
            print(f"🔍 Analyzing {symbol} trade outcome...")
            
            # Calculate Profit/Loss
            entry_price = float(match.filled_avg_price)
            # Fetch latest price to estimate current performance if still holding or use close price if sold
            current_price = entry_price # Default
            try:
                if accion == "COMPRA":
                    # For a buy, we want to know if current price > entry
                    current_price = float(api.get_latest_trade(match.symbol).p)
                else:
                    # For a sell, we want to know if we sold higher than we bought (simple estimate)
                    current_price = float(match.filled_avg_price)
            except: pass

            pnl = (current_price - entry_price) / entry_price * 100 if accion == "COMPRA" else 0
            
            # 3. Analyze with Gemini
            prompt = f"""
            SELF-CORRECTION AUDIT (VILLASMIL-OMEGA).
            TRADE: {accion} {symbol}
            ORIGINAL REASONING: {razon_original}
            ALPACA STATUS: {match.status} | FILLED AT: ${entry_price} | CURRENT/CLOSE: ${current_price}
            PERFORMANCE: {pnl:.2f}%
            
            TASK: Evaluate if this decision was coherent with the outcome. 
            Prioritize financial excellence and law alignment. 
            
            FORMAT: 
            RESULT: [SUCCESS/FAILURE]
            LESSON: [1 sentence lesson for neural memory]
            """
            
            analysis = model.generate_content(prompt).text.strip()
            print(f"🤖 Analysis: {analysis}")
            
            if "LESSON:" in analysis:
                lesson = analysis.split("LESSON:")[1].strip()
                # 4. Save to ChromaDB
                sector = fields.get("Sector", "General").lower()
                collection = chroma_client.get_or_create_collection(name=f"memoria_trading_{sector}")
                
                doc_id = f"correction_{log['id']}"
                existing = collection.get(ids=[doc_id])
                if not existing['ids']:
                    collection.add(
                        documents=[f"Self-Correction: {lesson}"],
                        metadatas=[{"type": "correction", "pnl": pnl, "original_log": log["id"], "symbol": symbol}],
                        ids=[doc_id]
                    )
                    print(f"✅ Neural memory updated with lesson: {lesson} (PnL Impact: {pnl:.2f}%)")

if __name__ == "__main__":
    run_self_correction()
