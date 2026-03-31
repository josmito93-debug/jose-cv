import os
import requests
from dotenv import load_dotenv

load_dotenv()

ALPACA_KEY = os.getenv("ALPACA_API_KEY")
ALPACA_SECRET = os.getenv("ALPACA_SECRET_KEY")

def extraer_noticias_alpaca(simbolo):
    print(f"📡 Probando Alpaca News para: {simbolo}")
    # Limpiar símbolo para Alpaca (ej: BTC/USD -> BTC)
    simbolo_limpio = simbolo.split('/')[0].replace('USD', '')
    
    url = "https://data.alpaca.markets/v1beta1/news"
    headers = {
        "APCA-API-KEY-ID": ALPACA_KEY,
        "APCA-API-SECRET-KEY": ALPACA_SECRET
    }
    params = {
        "symbols": simbolo_limpio,
        "limit": 3
    }
    
    try:
        resp = requests.get(url, headers=headers, params=params)
        print(f"DEBUG: Status {resp.status_code}")
        if resp.status_code != 200:
            print(f"DEBUG: Body {resp.text}")
        data = resp.json()
        if "news" in data:
            titulares = [n["headline"] for n in data["news"]]
            return f"AlpacaNews: {titulares}"
        return f"AlpacaNews: Sin noticias (Status: {resp.status_code})"
    except Exception as e:
        return f"AlpacaNews Error: {e}"

if __name__ == "__main__":
    for s in ["BTC", "GLD", "NVDA", "EURUSD"]:
        print(extraer_noticias_alpaca(s))
