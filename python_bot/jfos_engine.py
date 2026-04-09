import os
import time
import requests
import chromadb
import argparse
import json
from datetime import datetime
from dotenv import load_dotenv
from formulas.constants import ALPHA, BETA, LAWS_24, calculate_c_ia, calculate_c_ia_omega

import alpaca_trade_api as tradeapi
import google.generativeai as genai

# ==============================================================================
# 0. CONFIGURACIÓN DEL SISTEMA
# ==============================================================================
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

parser = argparse.ArgumentParser(description='JF.OS Professional Trading Engine')
parser.add_argument('--symbol', type=str, default='BTC/USD', help='Ticker symbol')
parser.add_argument('--alpaca_symbol', type=str, default='BTCUSD', help='Alpaca ticker')
parser.add_argument('--category', type=str, default='Crypto', help='Sector category')
parser.add_argument('--risk', type=float, default=0.01, help='Risk percentage')
args = parser.parse_args()

ALPACA_KEY = os.getenv("ALPACA_API_KEY")
ALPACA_SECRET = os.getenv("ALPACA_SECRET_KEY")
ALPACA_BASE_URL = os.getenv("ALPACA_BASE_URL")
TWELVE_KEY = os.getenv("TWELVE_DATA_API_KEY")
CODEX_KEY = os.getenv("CODEX_API_KEY")
ALPHA_VANTAGE_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
WEBHOOK_URL = os.getenv("DASHBOARD_WEBHOOK_URL")
WEBHOOK_SECRET = os.getenv("DASHBOARD_WEBHOOK_SECRET")

# Configuración APIs
api = tradeapi.REST(ALPACA_KEY, ALPACA_SECRET, ALPACA_BASE_URL, api_version='v2')
genai.configure(api_key=GEMINI_KEY)
# Usando gemini-2.5-flash que es estable para este entorno
model = genai.GenerativeModel('gemini-2.5-flash')

# ChromaDB
chroma_client = chromadb.PersistentClient(path="./chroma_db")
collection = chroma_client.get_or_create_collection(name=f"memoria_trading_{args.category.lower()}")

# Mappings for Codex (DEX Crypto)
CODEX_ASSETS = {
    "BTC/USD": {"address": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", "networkId": 1},
    "ETH/USD": {"address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "networkId": 1}
}

# Mappings for Yahoo Finance (Forex/Metals)
YAHOO_SYMBOLS = {
    "BTC/USD": "BTC-USD",
    "EUR/USD": "EURUSD=X",
    "GBP/USD": "GBPUSD=X",
    "XAU/USD": "GC=F",
    "XAG/USD": "SI=F",
    "AAPL": "AAPL",
    "NVDA": "NVDA"
}

def extraer_precio(simbolo):
    if args.category == 'Crypto' and CODEX_KEY and simbolo in CODEX_ASSETS:
        try:
            asset = CODEX_ASSETS[simbolo]
            query = f"""query {{ getTokenPrices(inputs: [{{ address: "{asset['address']}", networkId: {asset['networkId']} }}]) {{ priceUsd }} }}"""
            headers = {"Authorization": CODEX_KEY, "Content-Type": "application/json"}
            resp = requests.post("https://graph.codex.io/graphql", json={"query": query}, headers=headers).json()
            prices = resp.get('data', {}).get('getTokenPrices', [])
            if prices and prices[0].get('priceUsd'):
                return float(prices[0]['priceUsd'])
        except Exception:
            pass

    try:
        headers = {"APCA-API-KEY-ID": ALPACA_KEY, "APCA-API-SECRET-KEY": ALPACA_SECRET}
        if args.category == 'Crypto':
            url = f"https://data.alpaca.markets/v1beta3/crypto/us/latest/trades?symbols={args.alpaca_symbol}"
            resp = requests.get(url, headers=headers).json()
            if 'trades' in resp and args.alpaca_symbol in resp['trades']:
                return float(resp['trades'][args.alpaca_symbol]['p'])
        elif args.category == 'Stocks':
            url = f"https://data.alpaca.markets/v2/stocks/{args.alpaca_symbol}/trades/latest"
            resp = requests.get(url, headers=headers).json()
            if 'trade' in resp:
                return float(resp['trade']['p'])
    except Exception:
        pass

    try:
        y_symbol = YAHOO_SYMBOLS.get(simbolo, simbolo.replace("/", "-"))
        url = f"https://query1.finance.yahoo.com/v8/finance/chart/{y_symbol}?interval=1m&range=1d"
        headers = {'User-Agent': 'Mozilla/5.0'}
        resp = requests.get(url, headers=headers).json()
        meta = resp.get('chart', {}).get('result', [{}])[0].get('meta', {})
        if 'regularMarketPrice' in meta:
            return float(meta['regularMarketPrice'])
    except Exception:
        pass

    try:
        url = f"https://api.twelvedata.com/price?symbol={simbolo}&apikey={TWELVE_KEY}"
        resp = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'}).json()
        if 'price' in resp:
            return float(resp['price'])
    except Exception:
        pass

    return None

def extraer_noticias(simbolo):
    simbolo_limpio = simbolo.split('/')[0]
    try:
        url = f"https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers={simbolo_limpio}&apikey={ALPHA_VANTAGE_KEY}"
        resp = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'}).json()
        if "feed" in resp:
            feed = resp["feed"][:3]
            return " | ".join([f"{n['title']} ({n['overall_sentiment_label']})" for n in feed])
    except Exception:
        pass
    return "Stable market condition monitored."

def calcular_qty(precio, risk):
    try:
        cuenta = api.get_account()
        equity = float(cuenta.equity)
        budget = equity * risk
        qty = budget / precio
        if args.category == 'Crypto': return round(qty, 6)
        return round(qty, 2)
    except Exception: return 0.001

def main():
    print(f"🛰️ [JF.OS NODE {args.category.upper()} STARTING] Asset: {args.symbol}")
    
    while True:
        try:
            precio = extraer_precio(args.symbol)
            if not precio:
                print(f"⚠️ Market data starvation for {args.symbol}. Resetting link...")
                time.sleep(60); continue

            noticias = extraer_noticias(args.symbol)
            balance = float(api.get_account().equity)
            results = collection.query(query_texts=[f"{args.symbol} {noticias}"], n_results=1)
            memoria = results.get('documents', [[]])[0]

            prompt = f"""
            YOU ARE JF.OS INTELLIGENCE NODE (VILLASMIL-OMEGA PRO). 
            OPERATIONAL FRAMEWORK: UCF v3.3 | 24 LAWS OF COHERENCE.
            
            LAWS TO PRIORITIZE:
            - Law 2 (No contradiction): Logical consistency in trend.
            - Law 4 (No internal fiction): Don't hallucinate patterns.
            - Law 16 (Adversarial detection): Beware of market traps.
            - Law 20 (Transparency in uncertainty): Admit if Intel is insufficient.
            
            MARKET DATA:
            SECTOR: {args.category} | ASSET: {args.symbol} | PRICE: ${precio}
            INTEL: {noticias}
            NEURAL MEMORY: {memoria}
            
            TASK: 
            1. DECIDE: COMPRAR, VENDER, or ESPERAR.
            2. COHERENCE SCORE (0-24): How many of the 24 laws are satisfied by this decision?
            3. EXPECTED R:R (e.g. 3.5): What is the expected Reward/Risk ratio? Aim for > 3.0 (Convexity).
            4. REASON: 1 concise sentence explaining the logic, law alignment, and convexity.
            
            RESPONSE FORMAT:
            DECISION: [ACTION]
            COHERENCE: [SCORE]
            EXPECTED_RR: [RATIO]
            REASON: [TEXT]
            """
            
            res_raw = model.generate_content(prompt).text.strip()
            lines = res_raw.split('\n')
            
            # Parsing flexible response
            decision = "ESPERAR"
            score = 12
            expected_rr = 1.0
            razon = "Analytical processing."
            
            for line in lines:
                if line.startswith("DECISION:"): decision = line.split(":", 1)[1].strip().upper()
                if line.startswith("COHERENCE:"): 
                    try: score = int(line.split(":", 1)[1].strip())
                    except: score = 12
                if line.startswith("EXPECTED_RR:"):
                    try: expected_rr = float(line.split(":", 1)[1].strip())
                    except: expected_rr = 1.0
                if line.startswith("REASON:"): razon = line.split(":", 1)[1].strip()

            c_ia = calculate_c_ia(score)
            c_omega = calculate_c_ia_omega(c_ia)
            
            # Dynamic Risk Multiplier: High coherence + High R:R = Aggressive position
            # Normal risk (1.0x) as baseline. Max 2.0x, Min 0.1x.
            risk_multiplier = 1.0
            if c_ia > 0.8 and expected_rr >= 3.0: risk_multiplier = 1.5
            if c_ia > 0.95 and expected_rr >= 4.0: risk_multiplier = 2.0
            if c_ia < 0.6: risk_multiplier = 0.5
            if c_ia < 0.3: risk_multiplier = 0.1

            dynamic_risk = args.risk * risk_multiplier

            print(f"🧠 {decision} (Coh: {c_ia:.2f} | Ω: {c_omega:.2f} | R:R: {expected_rr} | RM: {risk_multiplier}x): {razon}")

            if "COMPRAR" in decision:
                qty = calcular_qty(precio, dynamic_risk)
                if qty > 0:
                    try:
                        # Change: fractional orders must be 'day' orders, not 'gtc'
                        tif = 'day' if qty < 1.0 or args.category == 'Crypto' else 'gtc'
                        api.submit_order(symbol=args.alpaca_symbol, qty=qty, side='buy', type='market', time_in_force=tif,
                                         order_class='bracket', take_profit={'limit_price': round(precio * 1.05, 2)},
                                         stop_loss={'stop_price': round(precio * 0.98, 2)})
                        print(f"🚀 EXECUTED BUY: {qty} {args.symbol} (TIF: {tif})")
                    except Exception as e: print(f"Error: {e}")
            elif "VENDER" in decision:
                try:
                    pos = api.get_position(args.alpaca_symbol)
                    api.submit_order(symbol=args.alpaca_symbol, qty=float(pos.qty), side='sell', type='market', time_in_force='gtc')
                    print(f"📉 EXECUTED SELL: {args.symbol}")
                except Exception: print("Buffer clear.")
            
            # Sync to Dashboard
            requests.post(WEBHOOK_URL, json={
                "webhook_secret": WEBHOOK_SECRET, 
                "accion": decision, 
                "precio": precio, 
                "razon": razon, 
                "capital_actual": balance, 
                "sector": args.category, 
                "simbolo": args.symbol,
                "coherence_score": c_ia,
                "omega_score": c_omega,
                "expected_rr": expected_rr,
                "risk_multiplier": risk_multiplier
            })

        except Exception as e: print(f"🚨 Panic: {e}")
        time.sleep(300)

if __name__ == "__main__":
    main()
