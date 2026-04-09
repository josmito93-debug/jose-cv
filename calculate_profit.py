import os
import alpaca_trade_api as tradeapi
from dotenv import load_dotenv

dotenv_path = '/Users/josefigueroa/Desktop/jose-cv/python_bot/.env'
load_dotenv(dotenv_path)

ALPACA_KEY = os.getenv("ALPACA_API_KEY")
ALPACA_SECRET = os.getenv("ALPACA_SECRET_KEY")
ALPACA_BASE_URL = os.getenv("ALPACA_BASE_URL")

def get_trading_performance():
    print(f"Connecting to Alpaca Paper Trading...")
    api = tradeapi.REST(ALPACA_KEY, ALPACA_SECRET, ALPACA_BASE_URL, api_version='v2')
    
    try:
        account = api.get_account()
        current_equity = float(account.equity)
        
        # Default starting capital for Alpaca Paper is 100,000
        initial_balance = 100000.0
        
        # Try to find the actual start balance from history or activities
        try:
            # period 'all' might not be supported, but '1Y' usually is
            history = api.get_portfolio_history(period='1Y', timeframe='1D')
            if history and history.equity:
                initial_balance = float(history.equity[0])
                print(f"Detected starting equity from history: ${initial_balance:,.2f}")
        except Exception:
            pass

        total_profit = current_equity - initial_balance
        profit_percent = (total_profit / initial_balance) * 100 if initial_balance != 0 else 0
        
        print("\n" + "="*45)
        print("🚀 [JF.OS] TRADING BOT PERFORMANCE")
        print("="*45)
        print(f"Initial Capital: ${initial_balance:,.2f}")
        print(f"Current Equity:  ${current_equity:,.2f}")
        print("-" * 45)
        print(f"TOTAL PROFIT:    ${total_profit:,.2f}")
        print(f"PERCENT CHANGE:  {profit_percent:+.2f}%")
        print("="*45)
        
        # Show recent activity count
        activities = api.get_activities()
        print(f"\nTotal historical activities recorded: {len(activities)}")
        
        if len(activities) > 0:
            # Find first and last activity date
            # Handle different attribute names or use ._raw safely
            dates = []
            for act in activities:
                raw = act._raw
                date_str = raw.get('transaction_time') or raw.get('date') or raw.get('created_at')
                if date_str:
                    dates.append(date_str)
            
            if dates:
                dates.sort()
                print(f"Bot active since: {dates[0]}")
                print(f"Last trade on:    {dates[-1]}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_trading_performance()
