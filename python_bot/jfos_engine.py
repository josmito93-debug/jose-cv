import os
import time
import requests
import chromadb
import argparse
import json
from datetime import datetime
from dotenv import load_dotenv

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
# Usando gemini-flash-latest que es estable para este entorno
model = genai.GenerativeModel('gemini-flash-latest')

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

            prompt = f"""YOU ARE JF.OS INTELLIGENCE NODE. DECIDE: COMPRAR/VENDER/ESPERAR. REASON: 1 sentence. SECTOR: {args.category} | ASSET: {args.symbol} | PRICE: ${precio} | INTEL: {noticias} | HISTORY: {memoria}"""
            res = model.generate_content(prompt).text.strip().split('\n')
            decision = res[0].strip().upper()
            razon = ' '.join(res[1:]).strip() if len(res) > 1 else "Strategic position."

            print(f"🧠 {decision}: {razon}")

            if "COMPRAR" in decision:
                qty = calcular_qty(precio, args.risk)
                if qty > 0:
                    try:
                        api.submit_order(symbol=args.alpaca_symbol, qty=qty, side='buy', type='market', time_in_force='gtc',
                                         order_class='bracket', take_profit={'limit_price': round(precio * 1.05, 2)},
                                         stop_loss={'stop_price': round(precio * 0.98, 2)})
                        print(f"🚀 EXECUTED BUY: {qty} {args.symbol}")
                    except Exception as e: print(f"Error: {e}")
            elif "VENDER" in decision:
                try:
                    pos = api.get_position(args.alpaca_symbol)
                    api.submit_order(symbol=args.alpaca_symbol, qty=float(pos.qty), side='sell', type='market', time_in_force='gtc')
                    print(f"📉 EXECUTED SELL: {args.symbol}")
                except Exception: print("Buffer clear.")
            
            # Sync to Dashboard
            requests.post(WEBHOOK_URL, json={"webhook_secret": WEBHOOK_SECRET, "accion": decision, "precio": precio, "razon": razon, "capital_actual": balance, "sector": args.category, "simbolo": args.symbol})

        except Exception as e: print(f"🚨 Panic: {e}")
        time.sleep(300)

if __name__ == "__main__":
    main()
