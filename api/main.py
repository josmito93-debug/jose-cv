from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables (PLAID_, ALPACA_, etc)
load_dotenv()

app = FastAPI(title="JF.OS Quantitative Trading API", version="0.1.0")

# Configure CORS so the static HTML CV frontend can communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Set to specific domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "JF.OS Backend Active", "module": "Trading Core"}

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy", 
        "services": {
            "plaid_integration": "pending", 
            "alpaca_integration": "pending"
        }
    }

# Entrypoint for local development testing
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
