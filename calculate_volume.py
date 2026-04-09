import os
import alpaca_trade_api as tradeapi
from dotenv import load_dotenv

dotenv_path = '/Users/josefigueroa/Desktop/jose-cv/python_bot/.env'
load_dotenv(dotenv_path)

api = tradeapi.REST(os.getenv("ALPACA_API_KEY"), os.getenv("ALPACA_SECRET_KEY"), os.getenv("ALPACA_BASE_URL"), api_version='v2')
fills = api.get_activities(activity_types=['FILL'])
print(f"Total Fills: {len(fills)}")
total_cost = 0
total_proceeds = 0
for fill in fills:
    raw = fill._raw
    qty = float(raw['qty'])
    price = float(raw['price'])
    if raw['side'] == 'buy':
        total_cost += qty * price
    else:
        total_proceeds += qty * price

print(f"Total Buying: ${total_cost:,.2f}")
print(f"Total Selling: ${total_proceeds:,.2f}")
