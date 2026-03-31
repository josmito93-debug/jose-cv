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

# Webhook y Configuración de Red
DASHBOARD_WEBHOOK_URL = os.getenv("DASHBOARD_WEBHOOK_URL")
WEBHOOK_SECRET = os.getenv("DASHBOARD_WEBHOOK_SECRET")


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

def obtener_modelo_generativo():
    """Prueba varios nombres de modelos para evitar errores 404"""
    modelos_a_probar = [
        'models/gemini-2.0-flash',
        'models/gemini-1.5-flash',
        'gemini-1.5-flash',
        'models/gemini-pro',
        'models/gemini-flash-latest'
    ]
    for nombre in modelos_a_probar:
        try:
            m = genai.GenerativeModel(nombre)
            print(f"✅ Modelo vinculado con éxito: {nombre}")
            return m
        except Exception as e:
            print(f"⚠️ Fallo con {nombre}: {e}")
            continue
    raise Exception("No se pudo vincular ningún modelo de Gemini compatible.")

model = obtener_modelo_generativo()

# Configuración de Activos por Categoría
CATEGORIAS = {
    "Crypto": {
        "activo": "BTC/USD",
        "alpaca": "BTCUSD",
        "monto": 0.0005,
        "descripcion": "Mercado Digital de Alta Volatilidad"
    },
    "Metals": {
        "activo": "GLD",
        "alpaca": "GLD",
        "monto": 1,
        "descripcion": "Refugio Seguro (ETF de Oro)"
    },
    "Forex": {
        "activo": "EUR/USD",
        "alpaca": "EURUSD",
        "monto": 1000,
        "descripcion": "Divisas Globales"
    },
    "Stocks": {
        "activo": "NVDA",
        "alpaca": "NVDA",
        "monto": 1,
        "descripcion": "Capital de Tecnología (Nvidia)"
    }
}

TIEMPO_REVISION_SEGUNDOS = 900 # 15 minutos entre barridos completos
TIEMPO_REVISION_RAPIDA = 30    # Revisión de señales del dashboard

# Inicialización de Memoria ChromaDB Local
collection = None
try:
    print("🧠 Inicializando memoria neuronal (ChromaDB)...")
    chroma_client = chromadb.PersistentClient(path="./chroma_db")
    collection = chroma_client.get_or_create_collection(name="memoria_trading_jfos")
except Exception as e:
    print(f"⚠️ Aviso: No se pudo cargar ChromaDB (Usando modo sin memoria): {e}")

# ==============================================================================
# 0.7. MÓDULO DE SEGUIMIENTO DE RENDIMIENTO (Performance tracking)
# ==============================================================================

def registrar_historial_rendimiento():
    """Registra el balance total de la cuenta en una tabla de historial diaria"""
    try:
        cuenta = api.get_account()
        balance = float(cuenta.portfolio_value)
        
        # Tabla de Historial (Performance History)
        # Nota: Asegúrate de tener esta tabla en Airtable con campos: Timestamp, Portfolio Value
        url = f"https://api.airtable.com/v0/{os.getenv('AIRTABLE_BASE_ID')}/Performance%20History"
        headers = {
            "Authorization": f"Bearer {os.getenv('AIRTABLE_API_KEY')}",
            "Content-Type": "application/json"
        }
        payload = {
            "records": [{
                "fields": {
                    "Timestamp": datetime.now().isoformat(),
                    "Portfolio Value": balance
                }
            }]
        }
        res = requests.post(url, headers=headers, json=payload)
        if res.status_code == 200:
            print(f"📊 [PROGRESO] Historial de rendimiento actualizado: ${balance}")
        else:
            # Si la tabla no existe, fallará silenciosamente o podemos reportarlo
            print(f"⚠️ Aviso: No se pudo actualizar historial (¿Existe la tabla 'Performance History'?): {res.text}")
    except Exception as e:
        print(f"Error registrando historial: {e}")

# ==============================================================================
# 0.8. MÓDULO DE DISPARADORES MANUALES (Airtable)
# ==============================================================================

def revisar_disparador_manual():
    """Busca en Airtable señales manuales y retorna (tipo, categoria)"""
    try:
        url = f"https://api.airtable.com/v0/{os.getenv('AIRTABLE_BASE_ID')}/{os.getenv('AIRTABLE_TABLE_NAME_LOGS')}"
        headers = {"Authorization": f"Bearer {os.getenv('AIRTABLE_API_KEY')}"}
        
        # Filtramos por señales pendientes (TRIGGER o INTEL)
        resp = requests.get(url, headers=headers, params={
            "filterByFormula": "OR({Razon} = 'TRIGGER', {Razon} = 'INTEL')",
            "maxRecords": 1, "sort": [{"field": "Timestamp", "direction": "desc"}]
        }).json()
        
        if resp.get("records"):
            record = resp["records"][0]
            fields = record["fields"]
            tipo = "TRADE" if fields.get("Razon") == "TRIGGER" else "INTEL"
            cat = fields.get("Categoria", "Crypto")
            
            print(f"⚡ [DISPARADOR] {tipo} manual para {cat} detectado.")
            requests.delete(f"{url}/{record['id']}", headers=headers)
            # Retornamos el tipo y la categoría si existe en nuestro mapa, sino Crypto por defecto
            return tipo, cat if cat in CATEGORIAS else "Crypto"

    except Exception as e:
        print(f"Error revisando disparador manual: {e}")
    return None, None


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
    if not collection: return
    try:
        fecha = datetime.now().strftime("%Y-%m-%d %H:%M")
        documento = f"[{fecha}] Acción: {accion}. Precio: {precio}. Razón: {razon}. Noticias: {noticias}"
        
        collection.add(
            documents=[documento],
            metadatas=[{"tipo": accion, "precio": precio}],
            ids=[f"trade_{datetime.now().timestamp()}"]
        )
        print(f"✅ Memoria actualizada en ChromaDB: {accion} @ {precio}")
    except Exception as e:
        print(f"⚠️ Error guardando memoria: {e}")

def consultar_memoria(contexto):
    if not collection: return ["No hay memoria disponible."]
    try:
        results = collection.query(
            query_texts=[contexto],
            n_results=2
        )
        documentos = results.get('documents', [[]])[0]
        return documentos if documentos else ["No hay recuerdos similares aún."]
    except Exception:
        return ["La memoria está vacía."]

def enviar_dashboard(accion, precio, razon, balance, news_analysis, categoria="Crypto", raw_intel=""):
    payload = {
        "webhook_secret": WEBHOOK_SECRET,
        "accion": accion,
        "precio": precio,
        "razon": razon,
        "capital_actual": float(balance),
        "news_analysis": news_analysis,
        "categoria": categoria,
        "raw_intel": raw_intel
    }
    try:
        requests.post(WEBHOOK_URL, json=payload, timeout=5)
        print(f"🌐 [{categoria}] Información sincronizada con Vercel Dashboard.")
    except Exception as e:
        print(f"⚠️ Error Webhook Dashboard: {e}")

# ==============================================================================
# 2. EL BUCLE PRINCIPAL (JF.OS CORE)
# ==============================================================================

def ejecutar_analisis_y_accion(cat_nombre, config):
    """Ejecuta un ciclo completo de análisis y trading para una categoría específica"""
    simbolo = config["activo"]
    simbolo_alpaca = config["alpaca"]
    monto = config["monto"]
    desc = config["descripcion"]

    print(f"\n--- 🔎 ANALIZANDO: {cat_nombre} ({simbolo}) ---")
    print(f"📍 {desc}")

    try:
        # 1. Recolectar Información
        precio_actual = extraer_precio(simbolo)
        if not precio_actual: return

        noticias = extraer_noticias(simbolo)
        cuenta = api.get_account()
        balance = cuenta.portfolio_value
        
        recuerdos = consultar_memoria(f"Valor {precio_actual} en {cat_nombre} con noticias {noticias}")

        # 3. Definir Guías Específicas por Sector
        guias_sector = {
            "Crypto": "Enfócate en la volatilidad, adopción institucional y sentimiento social.",
            "Metals": "Prioriza la inflación, tasas de interés y tensiones geopolíticas (Refugio Seguro).",
            "Forex": "Analiza diferenciales de tasas, balanza comercial y datos macro de bancos centrales.",
            "Stocks": "Considera reportes de ganancias, innovación tecnológica y tendencias del sector Equity."
        }
        guia = guias_sector.get(cat_nombre, "Análisis de mercado estándar.")

        # 4. Construir el Prompt para el Cerebro Generativo (Gemini)
        prompt = f"""
        Eres JF.OS, el cerebro financiero de Jose Figueroa. 
        ESTÁS ANALIZANDO EL MERCADO DE: {cat_nombre} ({desc}).
        GUÍA SECTORIAL: {guia}
        
        DATA FEED:
        - Activo: {simbolo} | Precio Actual: ${precio_actual}
        - Capital en Portfolio: ${balance}
        - Análisis de Sentimiento (News): {noticias}
        - Memoria: {recuerdos}

        TAREA: Ejecuta una decisión de mercado (COMPRAR, VENDER o ESPERAR).
        IMPORTANTE: Responde ESTRICTAMENTE en 3 líneas:
        L1: ACCION (COMPRAR/VENDER/ESPERAR)
        L2: RAZONAMIENTO FINANCIERO (Máximo 20 palabras)
        L3: IMPACTO EN MERCADO (Análisis de noticias condensado)
        """
        
        res_text = ""
        for i in range(3):
            try:
                response = model.generate_content(prompt)
                res_text = response.text
                break
            except Exception:
                time.sleep(5)
        
        if not res_text: return

        res = [l for l in res_text.strip().split('\n') if l.strip()]
        decision = res[0].strip().upper() if res else "ESPERAR"
        razonamiento = res[1].strip() if len(res) > 1 else "Optimización en curso."
        news_analysis = res[2].strip() if len(res) > 2 else "Neutral."

        print(f"🧠 {cat_nombre} Decision: {decision} | {razonamiento}")

        # 4. Tomar Acción (Ejecución Real)
        if "COMPRAR" in decision:
            api.submit_order(symbol=simbolo_alpaca, qty=monto, side='buy', type='market', time_in_force='gtc')
            guardar_memoria("COMPRA", precio_actual, razonamiento, noticias)
            enviar_dashboard("COMPRA", precio_actual, razonamiento, balance, news_analysis, categoria=cat_nombre)
        
        elif "VENDER" in decision:
            api.submit_order(symbol=simbolo_alpaca, qty=monto, side='sell', type='market', time_in_force='gtc')
            guardar_memoria("VENTA", precio_actual, razonamiento, noticias)
            enviar_dashboard("VENTA", precio_actual, razonamiento, balance, news_analysis, categoria=cat_nombre)
        
        else:
            enviar_dashboard("ESPERA", precio_actual, razonamiento, balance, news_analysis, categoria=cat_nombre)

        registrar_historial_rendimiento()

    except Exception as e:
        print(f"🚨 Error en ciclo {cat_nombre}: {e}")

def ejecutar_solo_intel(cat_nombre, config):
    """Ejecuta únicamente el análisis de noticias e inteligencia"""
    simbolo = config["activo"]
    print(f"🔍 [MODO INTEL] Escaneando {cat_nombre}...")
    try:
        precio_actual = extraer_precio(simbolo)
        noticias = extraer_noticias(simbolo)
        cuenta = api.get_account()
        balance = cuenta.portfolio_value
        
        prompt = f"Analiza estas noticias para {cat_nombre} ({simbolo} @ ${precio_actual}) y devuelve un resumen de impacto de 1 párrafo: {noticias}"
        response = model.generate_content(prompt)
        news_analysis = response.text.strip()
        
        enviar_dashboard("INTEL", precio_actual, f"Actualización Intel: {cat_nombre}", balance, news_analysis, categoria=cat_nombre, raw_intel=str(noticias))
        print(f"✅ Inteligencia {cat_nombre} actualizada.")
    except Exception as e:
        print(f"🚨 Error en Modo Intel {cat_nombre}: {e}")

def jfos_core_loop():
    print(f"🤖 [JF.OS ACTIVO] Supervisando {len(CATEGORIAS)} sectores...")
    
    ultimo_analisis_completo = 0
    while True:
        ahora = time.time()
        
        # 1. Revisar disparadores manuales del Dashboard (Alta Prioridad)
        tipo_disparo, cat_disparo = revisar_disparador_manual()
        if tipo_disparo:
            config = CATEGORIAS[cat_disparo]
            if tipo_disparo == "TRADE":
                ejecutar_analisis_y_accion(cat_disparo, config)
            else:
                ejecutar_solo_intel(cat_disparo, config)
        
        # 2. Análisis cíclico automático (Barrido de todos los mercados)
        elif (ahora - ultimo_analisis_completo) > TIEMPO_REVISION_SEGUNDOS:
            for nombre, config in CATEGORIAS.items():
                ejecutar_analisis_y_accion(nombre, config)
                time.sleep(10) # Pausa estratégica entre mercados
            ultimo_analisis_completo = ahora
            
        time.sleep(TIEMPO_REVISION_RAPIDA)

if __name__ == "__main__":
    registrar_historial_rendimiento()
    jfos_core_loop()
