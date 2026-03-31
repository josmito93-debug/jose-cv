import os
import time
import requests
import chromadb
from datetime import datetime
from dotenv import load_dotenv

import alpaca_trade_api as tradeapi
import google.generativeai as genai

# ==============================================================================
# 0. CONFIGURACIÓN DEL SISTEMA
# ==============================================================================
load_dotenv()

ALPACA_KEY = os.getenv("ALPACA_API_KEY")
ALPACA_SECRET = os.getenv("ALPACA_SECRET_KEY")
ALPACA_URL = os.getenv("ALPACA_BASE_URL")

TWELVE_KEY = os.getenv("TWELVE_DATA_API_KEY")
ALPHA_VANTAGE_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")

GEMINI_KEY = os.getenv("GEMINI_API_KEY")

WEBHOOK_URL = os.getenv("DASHBOARD_WEBHOOK_URL")
WEBHOOK_SECRET = os.getenv("DASHBOARD_WEBHOOK_SECRET")

# Configuración Inicial de APIs
api = tradeapi.REST(ALPACA_KEY, ALPACA_SECRET, ALPACA_URL, api_version='v2')
genai.configure(api_key=GEMINI_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

# Inicialización de Memoria ChromaDB Local
# Esto generará una carpeta `chroma_db` para guardar los registros
chroma_client = chromadb.PersistentClient(path="./chroma_db")
collection = chroma_client.get_or_create_collection(name="memoria_trading_jfos")

# Parámetros del Bot
SIMBOLO_ACTIVO = "BTC/USD"
SIMBOLO_ALPACA = "BTCUSD"
CANTIDAD_INVERSION = 0.0005 # Ajustable, equivalente a pocos dólares de prueba
TIEMPO_REVISION_SEGUNDOS = 300 # 5 Minutos

# ==============================================================================
# 1. MÓDULOS DE EXTRACCIÓN Y MEMORIA
# ==============================================================================

def extraer_precio(simbolo):
    try:
        url = f"https://api.twelvedata.com/price?symbol={simbolo}&apikey={TWELVE_KEY}"
        resp = requests.get(url).json()
        return float(resp['price'])
    except Exception as e:
        print(f"Error al extraer precio de Twelve Data: {e}")
        return None

NEWS_API_KEY = os.getenv("NEWS_API_KEY")

def extraer_noticias(simbolo_buscar):
    simbolo_limpio = simbolo_buscar.split('/')[0]
    
    # Intento con NewsAPI primero (Mejores titulares en tiempo real)
    if NEWS_API_KEY:
        try:
            url = f"https://newsapi.org/v2/everything?q={simbolo_limpio}&sortBy=publishedAt&language=en&pageSize=3&apiKey={NEWS_API_KEY}"
            resp = requests.get(url).json()
            if resp.get("status") == "ok" and resp.get("articles"):
                titulares = [art["title"] for art in resp["articles"]]
                return f"Últimas Noticias (NewsAPI): {titulares}"
        except Exception as e:
            print(f"⚠️ Error NewsAPI: {e}")

    # Fallback a Alpha Vantage
    try:
        url = f"https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers={simbolo_limpio}&apikey={ALPHA_VANTAGE_KEY}"
        news_data = requests.get(url).json()
        if "feed" in news_data:
            top_news = [item['title'] for item in news_data['feed'][:2]]
            return f"Últimas Noticias (AlphaVantage): {top_news}"
        return "Sin noticias recientes."
    except Exception:
        return "No se pudieron obtener noticias."

def guardar_memoria(accion, precio, razon, noticias):
    fecha = datetime.now().strftime("%Y-%m-%d %H:%M")
    documento = f"[{fecha}] Acción: {accion}. Precio: {precio}. Razón: {razon}. Noticias: {noticias}"
    
    collection.add(
        documents=[documento],
        metadatas=[{"tipo": accion, "precio": precio}],
        ids=[f"trade_{datetime.now().timestamp()}"]
    )
    print(f"✅ Memoria actualizada en ChromaDB: {accion} @ {precio}")

def consultar_memoria(contexto):
    try:
        results = collection.query(
            query_texts=[contexto],
            n_results=2
        )
        documentos = results.get('documents', [[]])[0]
        return documentos if documentos else ["No hay recuerdos similares aún."]
    except Exception:
        return ["La memoria está vacía."]

def enviar_dashboard(accion, precio, razon, balance, news_analysis):
    payload = {
        "webhook_secret": WEBHOOK_SECRET,
        "accion": accion,
        "precio": precio,
        "razon": razon,
        "capital_actual": float(balance),
        "news_analysis": news_analysis
    }
    try:
        requests.post(WEBHOOK_URL, json=payload, timeout=5)
        print("🌐 Información sincronizada con Vercel Dashboard.")
    except Exception as e:
        print(f"⚠️ Error enviando Webhook al Dashboard: {e}")

# ==============================================================================
# 2. EL BUCLE PRINCIPAL (JF.OS CORE)
# ==============================================================================

def jfos_core_loop():
    print(f"🤖 [JF.OS ACTIVO] Iniciando supervisión del mercado para {SIMBOLO_ACTIVO}...")
    
    while True:
        print("-" * 50)
        try:
            # 1. Recolectar Información
            precio_actual = extraer_precio(SIMBOLO_ACTIVO)
            if not precio_actual:
                time.sleep(60)
                continue

            noticias = extraer_noticias(SIMBOLO_ACTIVO)
            
            # 2. Obtener Balance actual de Alpaca
            cuenta = api.get_account()
            balance = cuenta.portfolio_value
            
            contexto_busqueda = f"Valor {precio_actual} y noticias {noticias}"
            recuerdos = consultar_memoria(contexto_busqueda)

            # 3. Construir el Prompt para el Cerebro Generativo (Gemini)
            prompt = f"""
            Eres JF.OS, un bot de trading algorítmico diseñado para escalar una cuenta de $300 a $30,000 mediante interés compuesto y fondeo.
            SITUACIÓN ACTUAL:
            - Activo: {SIMBOLO_ACTIVO}
            - Precio Actual: ${precio_actual}
            - Capital de la Cuenta: ${balance}
            - Contexto (Noticias): {noticias}
            - Memoria a largo plazo (Tus trades similares): {recuerdos}

            REGLA DE RIESGO: Nunca arriesgues más del 1%. Sé conservador si las noticias son negativas.

            TAREA: ¿Debemos operar (COMPRAR o VENDER {CANTIDAD_INVERSION} unidades) o ESPERAR?
            Debes responder ESTRICTAMENTE en este formato de 3 líneas (no uses JSON, no uses viñetas, nada antes de la LINEA 1):
            LINEA 1: (Únicamente la palabra COMPRAR, VENDER o ESPERAR)
            LINEA 2: (Tu justificación técnica de la decisión)
            LINEA 3: (Análisis de cómo impactarán las Noticias en el mercado a corto plazo según tu criterio)
            """
            
            respuesta_cruda = model.generate_content(prompt).text.strip().split('\n')
            # Limpiar lineas vacias
            respuesta_cruda = [line for line in respuesta_cruda if line.strip()]
            
            decision = respuesta_cruda[0].strip().upper()
            razonamiento = respuesta_cruda[1].strip() if len(respuesta_cruda) > 1 else "Razonamiento no proporcionado."
            news_analysis = respuesta_cruda[2].strip() if len(respuesta_cruda) > 2 else "Análisis de noticias no proporcionado."

            print(f"🧠 Gemini Decidió: {decision} | Razón: {razonamiento}")
            print(f"📰 Análisis Noticias: {news_analysis}")

            # 4. Tomar Acción
            if "COMPRAR" in decision:
                try:
                    api.submit_order(symbol=SIMBOLO_ALPACA, qty=CANTIDAD_INVERSION, side='buy', type='market', time_in_force='gtc')
                    print(f"🚀 [EJECUTADO] Se ha emitido una orden de COMPRA.")
                    guardar_memoria("COMPRA", precio_actual, razonamiento, noticias)
                    enviar_dashboard("COMPRA", precio_actual, razonamiento, balance, news_analysis)
                except Exception as b_err:
                    print(f"Error operando en Alpaca (Compra): {b_err}")
            
            elif "VENDER" in decision:
                try:
                    # En Alpaca Paper Trading podemos abrir posiciones cortas o vender, pero para este bot conservador
                    # asumiremos que solo vendemos si tenemos la posición abierta. 
                    # El siguiente submit simplifica la operación.
                    api.submit_order(symbol=SIMBOLO_ALPACA, qty=CANTIDAD_INVERSION, side='sell', type='market', time_in_force='gtc')
                    print(f"📉 [EJECUTADO] Se ha emitido una orden de VENTA.")
                    guardar_memoria("VENTA", precio_actual, razonamiento, noticias)
                    enviar_dashboard("VENTA", precio_actual, razonamiento, balance, news_analysis)
                except Exception as s_err:
                    print(f"Error operando en Alpaca (Venta): {s_err}")
            
            else:
                print(f"💤 [ESPERANDO] No se ejecuta ninguna operación.")
                enviar_dashboard("ESPERA", precio_actual, razonamiento, balance, news_analysis)

        except Exception as e:
            print(f"🚨 Excepción severa en el ciclo JF.OS: {e}")
        
        # 5. Dormir hasta la próxima evaluación
        print(f"🕒 Durmiendo {TIEMPO_REVISION_SEGUNDOS} segundos...")
        time.sleep(TIEMPO_REVISION_SEGUNDOS)

if __name__ == "__main__":
    jfos_core_loop()
