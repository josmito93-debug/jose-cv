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

# Parámetros del Bot
SIMBOLO_ACTIVO = "BTC/USD"
SIMBOLO_ALPACA = "BTCUSD"
CANTIDAD_INVERSION = 0.0005 
TIEMPO_REVISION_SEGUNDOS = 300 
TIEMPO_REVISION_RAPIDA = 30 # Para revisar disparadores manuales

# Inicialización de Memoria ChromaDB Local
collection = None
try:
    print("🧠 Inicializando memoria neuronal (ChromaDB)...")
    chroma_client = chromadb.PersistentClient(path="./chroma_db")
    collection = chroma_client.get_or_create_collection(name="memoria_trading_jfos")
except Exception as e:
    print(f"⚠️ Aviso: No se pudo cargar ChromaDB (Usando modo sin memoria): {e}")

# ==============================================================================
# 0.5. MÓDULO DE DISPARADORES MANUALES (Airtable)
# ==============================================================================

def revisar_disparador_manual():
    """Busca en Airtable si hay una señal de 'TRIGGER' manual"""
    try:
        # Buscamos el registro más reciente con Accion: TRIGGER
        url = f"https://api.airtable.com/v0/{os.getenv('AIRTABLE_BASE_ID')}/{os.getenv('AIRTABLE_TABLE_NAME_LOGS')}"
        headers = {"Authorization": f"Bearer {os.getenv('AIRTABLE_API_KEY')}"}
        params = {
            "filterByFormula": "{Accion} = 'TRIGGER'",
            "maxRecords": 1,
            "sort": [{"field": "Timestamp", "direction": "desc"}]
        }
        resp = requests.get(url, headers=headers, params=params).json()
        if resp.get("records"):
            record = resp["records"][0]
            # Borramos el disparador para no repetirlo
            requests.delete(f"{url}/{record['id']}", headers=headers)
            return True
    except Exception as e:
        print(f"Error revisando disparador manual: {e}")
    return False

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

def ejecutar_analisis_y_accion():
    """Ejecuta un ciclo completo de análisis y trading"""
    print("-" * 50)
    try:
        # 1. Recolectar Información
        precio_actual = extraer_precio(SIMBOLO_ACTIVO)
        if not precio_actual:
            return

        noticias = extraer_noticias(SIMBOLO_ACTIVO)
        
        # 2. Obtener Balance actual de Alpaca
        cuenta = api.get_account()
        balance = cuenta.portfolio_value
        
        recuerdos = ["No hay recuerdos similares."]
        if collection:
            contexto_busqueda = f"Valor {precio_actual} y noticias {noticias}"
            recuerdos = consultar_memoria(contexto_busqueda)

        # 3. Construir el Prompt para el Cerebro Generativo (Gemini)
        prompt = f"""
        Eres JF.OS, un bot de trading algorítmico diseñado para escalar una cuenta de $300 a $30,000.
        SITUACIÓN ACTUAL:
        - Activo: {SIMBOLO_ACTIVO}
        - Precio Actual: ${precio_actual}
        - Capital de la Cuenta: ${balance}
        - Contexto (Noticias): {noticias}
        - Memoria (Trades previos): {recuerdos}

        TAREA: ¿Debemos operar (COMPRAR o VENDER {CANTIDAD_INVERSION} unidades) o ESPERAR?
        Responde ESTRICTAMENTE en 3 líneas:
        L1: ACCION (COMPRAR/VENDER/ESPERAR)
        L2: RAZONAMIENTO
        L3: ANALISIS NOTICIAS
        """
        
        res = model.generate_content(prompt).text.strip().split('\n')
        res = [l for l in res if l.strip()]
        
        decision = res[0].strip().upper() if res else "ESPERAR"
        razonamiento = res[1].strip() if len(res) > 1 else "Auto-evaluación."
        news_analysis = res[2].strip() if len(res) > 2 else "Análisis técnico estándar."

        print(f"🧠 Decision: {decision} | {razonamiento}")

        # 4. Tomar Acción
        if "COMPRAR" in decision:
            api.submit_order(symbol=SIMBOLO_ALPACA, qty=CANTIDAD_INVERSION, side='buy', type='market', time_in_force='gtc')
            print(f"🚀 [ORDEN COMPRA ENVIADA]")
            if collection: guardar_memoria("COMPRA", precio_actual, razonamiento, noticias)
            enviar_dashboard("COMPRA", precio_actual, razonamiento, balance, news_analysis)
        
        elif "VENDER" in decision:
            api.submit_order(symbol=SIMBOLO_ALPACA, qty=CANTIDAD_INVERSION, side='sell', type='market', time_in_force='gtc')
            print(f"📉 [ORDEN VENTA ENVIADA]")
            if collection: guardar_memoria("VENTA", precio_actual, razonamiento, noticias)
            enviar_dashboard("VENTA", precio_actual, razonamiento, balance, news_analysis)
        
        else:
            print(f"💤 [ESPERANDO]")
            enviar_dashboard("ESPERA", precio_actual, razonamiento, balance, news_analysis)

    except Exception as e:
        print(f"🚨 Error en ciclo: {e}")

def jfos_core_loop():
    print(f"🤖 [JF.OS ACTIVO] Supervisando {SIMBOLO_ACTIVO}...")
    
    ultimo_analisis_completo = 0
    
    while True:
        ahora = time.time()
        
        # Revisar si hay un disparador manual (Botón 'Deploy Capital' en Dash)
        if revisar_disparador_manual():
            print("⚡ [DISPARADOR MANUAL] Ejecutando ahora por solicitud del Dashboard...")
            ejecutar_analisis_y_accion()
            ultimo_analisis_completo = ahora
        
        # O si ya pasaron los 5 minutos de rigor
        elif (ahora - ultimo_analisis_completo) > TIEMPO_REVISION_SEGUNDOS:
            ejecutar_analisis_y_accion()
            ultimo_analisis_completo = ahora
            
        time.sleep(TIEMPO_REVISION_RAPIDA)

if __name__ == "__main__":
    jfos_core_loop()
