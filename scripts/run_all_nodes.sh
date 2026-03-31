#!/bin/bash

# JF.OS Multi-Sector Bot Launcher
# This script starts the 4 intelligence nodes for the different markets.

echo "🚀 [JF.OS] Launching Professional Trading Terminal Nodes..."

# 1. First, train the memory nodes
echo "🧠 Training Neural Memory..."
python3 python_bot/train_memory.py

echo "--------------------------------------------------------"

# 2. Launch Nodes in background
# We assume the user has the credentials in python_bot/.env

echo "🛰️ Starting CRYPTO Node (BTC/USD)..."
python3 python_bot/jfos_engine.py --symbol "BTC/USD" --alpaca_symbol "BTCUSD" --category "Crypto" &

echo "🛰️ Starting FOREX Node (EUR/USD)..."
python3 python_bot/jfos_engine.py --symbol "EUR/USD" --alpaca_symbol "EURUSD" --category "Forex" &

echo "🛰️ Starting METALS Node (Gold - XAU/USD)..."
python3 python_bot/jfos_engine.py --symbol "XAU/USD" --alpaca_symbol "XAUUSD" --category "Metals" &

echo "🛰️ Starting STOCKS Node (NVIDIA - NVDA)..."
python3 python_bot/jfos_engine.py --symbol "NVDA" --alpaca_symbol "NVDA" --category "Stocks" &

echo "--------------------------------------------------------"
echo "✅ ALL NODES ACTIVE. Check dashboard for live updates."
echo "Use 'killall python3' to stop all nodes (Warning: this stops all python scripts)."
