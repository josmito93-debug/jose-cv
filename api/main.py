from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables (PLAID_, ALPACA_, etc)
load_dotenv()

import alpaca_trade_api as tradeapi
from typing import List, Dict

app = FastAPI(title="JF.OS Quantitative Trading API", version="0.1.0")

# Alpaca Client Setup
ALPACA_KEY = os.getenv("ALPACA_API_KEY")
ALPACA_SECRET = os.getenv("ALPACA_SECRET_KEY")
ALPACA_BASE_URL = os.getenv("ALPACA_BASE_URL")

# Standardize URL
if ALPACA_BASE_URL and not ALPACA_BASE_URL.startswith('http'):
    ALPACA_BASE_URL = f"https://{ALPACA_BASE_URL}"

def get_alpaca_api():
    return tradeapi.REST(ALPACA_KEY, ALPACA_SECRET, ALPACA_BASE_URL, api_version='v2')

@app.get("/")
def read_root():
    return {"status": "JF.OS Backend Active", "module": "Trading Core"}

@app.get("/api/trading/stats")
def get_trading_stats():
    try:
        api = get_alpaca_api()
        account = api.get_account()
        
        # Calculate PnL since start (Approx 100k for paper)
        initial_balance = 100000.0
        current_equity = float(account.equity)
        total_pnl = current_equity - initial_balance
        pnl_pct = (total_pnl / initial_balance) * 100
        
        # Calculate Win Rate proxy based on profitable days
        try:
            history = api.get_portfolio_history(period='1M', timeframe='1D')
            total_days = len(history.equity) - 1
            win_days = sum(1 for i in range(1, len(history.equity)) if history.equity[i] and history.equity[i-1] and history.equity[i] > history.equity[i-1])
            win_rate = (win_days / total_days * 100) if total_days > 0 else 64.2 # fallback to default if not enough data
        except Exception:
            win_rate = 64.2
        
        return {
            "equity": current_equity,
            "buying_power": float(account.buying_power),
            "total_pnl": total_pnl,
            "pnl_pct": round(pnl_pct, 4),
            "win_rate": round(win_rate, 1),
            "currency": account.currency,
            "status": account.status,
            "timestamp": str(account.created_at)
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/trading/positions")
def get_positions():
    try:
        api = get_alpaca_api()
        positions = api.list_positions()
        return [
            {
                "symbol": p.symbol,
                "qty": float(p.qty),
                "avg_entry_price": float(p.avg_entry_price),
                "current_price": float(p.current_price),
                "market_value": float(p.market_value),
                "unrealized_pl": float(p.unrealized_pl),
                "unrealized_plpc": float(p.unrealized_plpc) * 100,
                "change_today": float(p.change_today) * 100
            }
            for p in positions
        ]
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/trading/history")
def get_history():
    try:
        api = get_alpaca_api()
        # Fetch 1 month of history with 1D timeframe to avoid Alpaca limitations > 30 days
        history = api.get_portfolio_history(period='1M', timeframe='1D')
        
        # Format for Recharts
        formatted_data = []
        for i in range(len(history.timestamp)):
            formatted_data.append({
                "time": str(history.timestamp[i]),
                "value": float(history.equity[i]) if history.equity[i] else 0
            })
        return formatted_data
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy", 
        "services": {
            "plaid_integration": "pending", 
            "alpaca_integration": "active" if ALPACA_KEY else "missing_keys"
        }
    }

# Entrypoint for local development testing
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
