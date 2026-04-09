import os
import alpaca_trade_api as tradeapi
from dotenv import load_dotenv

dotenv_path = '/Users/josefigueroa/Desktop/jose-cv/python_bot/.env'
load_dotenv(dotenv_path)

ALPACA_KEY = os.getenv("ALPACA_API_KEY")
ALPACA_SECRET = os.getenv("ALPACA_SECRET_KEY")
ALPACA_BASE_URL = os.getenv("ALPACA_BASE_URL")

api = tradeapi.REST(ALPACA_KEY, ALPACA_SECRET, ALPACA_BASE_URL, api_version='v2')
positions = api.list_positions()
print(f"Current Positions: {len(positions)}")
for pos in positions:
    print(f"{pos.symbol}: {pos.qty} units | Cost Basis: ${pos.cost_basis} | Unrealized PnL: ${pos.unrealized_pl}")
