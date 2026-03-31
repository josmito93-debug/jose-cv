#!/bin/bash

# Configuration
DROPLET_IP="137.184.139.97"
USER="root"
REMOTE_PATH="/root/jfos-trading-bot"
LOCAL_PATH="python_bot"

echo "🚀 Iniciando despliegue de JF.OS Trading Bot..."

# 1. Empaquetar y subir archivos
echo "📦 Transfiriendo archivos a $DROPLET_IP..."
scp -r $LOCAL_PATH $USER@$DROPLET_IP:$REMOTE_PATH

# 2. Configurar servidor remoto
echo "⚙️ Configurando el entorno remoto..."
ssh $USER@$DROPLET_IP << EOF
    cd $REMOTE_PATH
    
    # Actualizar sistema e instalar python/pip
    apt update && apt install -y python3-venv python3-pip pm2
    
    # Crear entorno virtual
    python3 -m venv .venv
    source .venv/bin/activate
    
    # Instalar dependencias
    pip install -r requirements.txt
    
    # Iniciar con PM2 para persistencia
    pm2 stop jfos-bot || true
    pm2 start .venv/bin/python --name "jfos-bot" -- jfos_engine.py
    pm2 save
EOF

echo "✅ Despliegue completado. El bot ahora está corriendo en PM2."
