import os
import requests
from dotenv import load_dotenv
import alpaca_trade_api as tradeapi
import google.generativeai as genai

load_dotenv('python_bot/.env')

def check_keys():
    print("🤖 INICIANDO TEST DE CONECTIVIDAD JF.OS TRADING BOT")
    print("="*60)
    
    # 1. ALPACA PAPER TRADING
    print("\n📈 1. Testeando ALPACA (Ejecución de Órdenes)...")
    try:
        api = tradeapi.REST(
            os.getenv("ALPACA_API_KEY"),
            os.getenv("ALPACA_SECRET_KEY"),
            os.getenv("ALPACA_BASE_URL"),
            api_version='v2'
        )
        account = api.get_account()
        print(f"✅ CONECTADO AL BROKER. Status: {account.status}")
        print(f"💰 Balance (Paper): ${account.portfolio_value}")
    except Exception as e:
        print(f"❌ ERROR ALPACA: {e}")
        
    # 2. TWELVE DATA
    print("\n📊 2. Testeando TWELVE DATA (Precios Tiempo Real)...")
    try:
        key = os.getenv("TWELVE_DATA_API_KEY")
        url = f"https://api.twelvedata.com/price?symbol=BTC/USD&apikey={key}"
        resp = requests.get(url).json()
        if "price" in resp:
            print(f"✅ TWELVE DATA ACTIVO. Precio BTC: ${resp['price']}")
        else:
            print(f"❌ ERROR TWELVE DATA: {resp}")
    except Exception as e:
        print(f"❌ ERROR TWELVE DATA: {e}")
        
    # 3. ALPHA VANTAGE
    print("\n📰 3. Testeando ALPHA VANTAGE (Noticias / Sentimiento)...")
    try:
        key = os.getenv("ALPHA_VANTAGE_API_KEY")
        url = f"https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=BTC&apikey={key}"
        resp = requests.get(url).json()
        if "feed" in resp:
            print(f"✅ ALPHA VANTAGE ACTIVO. Noticias encontradas: {len(resp['feed'])}")
        else:
            print(f"❌ ERROR ALPHA VANTAGE: Límite de API gratuito excedido o llave inválida.")
    except Exception as e:
        print(f"❌ ERROR ALPHA VANTAGE: {e}")

    # 4. GEMINI
    print("\n🧠 4. Testeando GEMINI AI (Razonamiento Lógico)...")
    try:
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        model = genai.GenerativeModel('gemini-2.0-flash')
        resp = model.generate_content("Responde solo: OK")
        print(f"✅ GEMINI ACTIVO. Respuesta: {resp.text.strip()}")
    except Exception as e:
        print(f"❌ ERROR GEMINI: {e}")
        
    print("\n" + "="*60)
    
if __name__ == "__main__":
    check_keys()
