import os
import alpaca_trade_api as tradeapi
from dotenv import load_dotenv

dotenv_path = '/Users/josefigueroa/Desktop/jose-cv/python_bot/.env'
load_dotenv(dotenv_path)

ALPACA_KEY = os.getenv("ALPACA_API_KEY")
ALPACA_SECRET = os.getenv("ALPACA_SECRET_KEY")
ALPACA_BASE_URL = os.getenv("ALPACA_BASE_URL")

api = tradeapi.REST(ALPACA_KEY, ALPACA_SECRET, ALPACA_BASE_URL, api_version='v2')
activities = api.get_activities()
if activities:
    print(dir(activities[0]))
    print(activities[0])
else:
    print("No activities found")
