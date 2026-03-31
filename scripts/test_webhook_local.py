import requests
import json

url = "http://localhost:3000/api/trading-webhook"
payload = {
    "webhook_secret": "JFOS_SECURE_2026",
    "accion": "ESPERA",
    "precio": 50000.0,
    "razon": "Local Sync Test - 2026 Verification",
    "capital_actual": 100000.0,
    "sector": "Crypto",
    "simbolo": "TEST/USD"
}

try:
    print(f"Sending test POST to {url}...")
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
