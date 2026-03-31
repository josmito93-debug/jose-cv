import os
import chromadb
from datetime import datetime
from dotenv import load_dotenv

# ==============================================================================
# 0. CONFIGURACIÓN DEL ENTRENAMIENTO
# ==============================================================================
load_dotenv()

# We train sectors specifically
SECTORS = ["crypto", "forex", "metals", "stocks"]

chroma_client = chromadb.PersistentClient(path="./chroma_db")

# Historical high-impact events for training
HISTORICAL_LESSONS = {
    "crypto": [
        "FTX Collapse (Nov 2022): Massive panic, BTC dropped -25% in 3 days. Strategy: Wait for bottom signal, do not catch falling knives.",
        "Halving 2024: Accumulation phase before the event. Strategy: Buy local dips and hold for medium term.",
        "Bitcoin Spot ETF Approval (Jan 2024): Buy the rumor, sell the news. Volatility spiked +10% and then corrected."
    ],
    "forex": [
        "CPI Data Day: High volatility if numbers exceed forecast. Strategy: Wait for 15m after candle close to confirm direction.",
        "Fed Rate Hike: Dollar strength (DXY) usually kills the EUR/USD pair. Strategy: Follow the DXY trend."
    ],
    "metals": [
        "Geopolitical Tensions: Gold (XAU) surges as a safe haven. Strategy: Buy breakouts on resistance.",
        "Dollar Strength: Usually inverse to Gold. If DXY is bullish, XAU stays bearish."
    ],
    "stocks": [
        "NVIDIA Earnings: AI sector catalyst. Strategy: If NVDA beats, buy semi-conductor ETFs like SMH.",
        "Tech Sell-off 2022: High interest rates kill growth stocks. Strategy: Stick to Dow Jones value stocks."
    ]
}

def train_neural_memory():
    print("🧠 Starting Neural Memory Training for JF.OS Node...")
    
    for sector, lessons in HISTORICAL_LESSONS.items():
        print(f"--- Training Sector: {sector.upper()} ---")
        collection = chroma_client.get_or_create_collection(name=f"memoria_trading_{sector}")
        
        for i, lesson in enumerate(lessons):
            doc_id = f"lesson_{sector}_{i}"
            # Check if exists
            existing = collection.get(ids=[doc_id])
            if not existing['ids']:
                collection.add(
                    documents=[lesson],
                    metadatas=[{"type": "training", "sector": sector, "priority": "high"}],
                    ids=[doc_id]
                )
                print(f"Added lesson: {lesson[:50]}...")
            else:
                print(f"Lesson {doc_id} already exists in node memory.")

    print("\n✅ Training complete. The JF.OS nodes now have historical intelligence.")

if __name__ == "__main__":
    train_neural_memory()
