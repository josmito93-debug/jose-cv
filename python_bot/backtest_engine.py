import os
import requests
import pandas as pd
from datetime import datetime
from dotenv import load_dotenv
import google.generativeai as genai
import time

# ==============================================================================
# 0. CONFIGURACIÓN DEL SIMULADOR
# ==============================================================================
load_dotenv()

ALPHA_VANTAGE_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")
GEMINI_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

def get_historical_data(symbol, interval='5min'):
    print(f"📥 Fetching historical data for {symbol}...")
    url = f"https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval={interval}&outputsize=full&apikey={ALPHA_VANTAGE_KEY}"
    r = requests.get(url)
    data = r.json()
    
    time_series_key = f"Time Series ({interval})"
    if time_series_key not in data:
        print(f"Error fetching data: {data}")
        return None
    
    df = pd.DataFrame.from_dict(data[time_series_key], orient='index')
    df.columns = ['open', 'high', 'low', 'close', 'volume']
    df = df.astype(float)
    df.index = pd.to_datetime(df.index)
    return df.sort_index()

def simulate_trading(df, symbol, initial_balance=300):
    balance = initial_balance
    position = 0
    trades = []
    
    print(f"🚀 Starting Backtest for {symbol} | Initial Balance: ${initial_balance}")
    
    # Simulate step-by-step
    # To keep it fast/cost-efficient, we take a subset of the last 100 periods
    sample_df = df.tail(50) 
    
    for timestamp, row in sample_df.iterrows():
        price = row['close']
        
        # Build Backtest Prompt
        prompt = f"""
        BACKTESTING MODE: You are JF.OS Trading Engine.
        Date: {timestamp}
        Asset: {symbol}
        Price: ${price}
        Account Balance: ${balance}
        Position: {position} units

        TASK: Should we COMPRAR, VENDER, or ESPERAR based on this historical snapshot?
        Assume the goal is to grow the account safely.
        
        RESPONSE FORMAT: ACTION (Just one word)
        """
        
        try:
            decision = model.generate_content(prompt).text.strip().upper()
            
            if "COMPRAR" in decision and balance > (price * 0.005):
                qty = (balance * 0.1) / price # Simulate 10% risk for backtest
                cost = qty * price
                balance -= cost
                position += qty
                trades.append({"time": timestamp, "type": "BUY", "price": price, "qty": qty, "balance": balance})
                print(f"[{timestamp}] BUY {qty:.4f} @ {price:.2f}")
                
            elif "VENDER" in decision and position > 0:
                proceeds = position * price
                balance += proceeds
                win_loss = proceeds - (trades[-1]['qty'] * trades[-1]['price'] if trades else 0)
                trades.append({"time": timestamp, "type": "SELL", "price": price, "qty": position, "balance": balance, "pnl": win_loss})
                print(f"[{timestamp}] SELL {position:.4f} @ {price:.2f} | PnL: ${win_loss:.2f}")
                position = 0
            
            time.sleep(1) # Rate limit Gemini
        except Exception as e:
            print(f"Simulation error: {e}")
            
    # Finalize
    final_equity = balance + (position * df.iloc[-1]['close'])
    total_return = ((final_equity - initial_balance) / initial_balance) * 100
    
    print("\n" + "="*40)
    print(f"📊 BACKTEST RESULTS FOR {symbol}")
    print(f"Initial Balance: ${initial_balance}")
    print(f"Final Equity: ${final_equity:.2f}")
    print(f"Total Return: {total_return:.2f}%")
    print(f"Total Trades: {len(trades)}")
    print("="*40)
    
    return trades

if __name__ == "__main__":
    # Test with BTC
    df = get_historical_data("BTC")
    if df is not None:
        simulate_trading(df, "BTC")
