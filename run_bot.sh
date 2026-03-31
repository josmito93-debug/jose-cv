#!/bin/bash
# Script para iniciar el Bot de Trading JF.OS
cd "$(dirname "$0")"
source .venv/bin/activate
sleep 10 && python3 python_bot/jfos_engine.py
