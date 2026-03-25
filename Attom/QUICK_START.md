# ⚡ Attom - Guía Rápida de Inicio

Esta guía te ayudará a poner en marcha Attom en menos de 15 minutos.

## 🚀 Instalación Rápida

### 1. Arreglar permisos de node_modules

```bash
cd ~/Desktop/Attom
sudo rm -rf node_modules package-lock.json
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` y configura al menos estas claves esenciales:

```env
# Esencial para generación de contenido
OPENAI_API_KEY=sk-tu-clave-aqui

# Esencial para deployment
GITHUB_TOKEN=ghp_tu-token-aqui
GITHUB_USERNAME=tu-usuario-github

# Opcional pero recomendado
AIRTABLE_API_KEY=tu-clave
AIRTABLE_BASE_ID=tu-base
STRIPE_SECRET_KEY=sk_tu-clave
```

### 3. Crear primer cliente (modo test)

```bash
npm run attom:create-client
```

Responde las preguntas interactivas. Ejemplo:
```
Nombre del negocio: Pizza Express
Nombre del contacto: Juan Pérez
Teléfono: +58414123456
Email: juan@pizzaexpress.com
Tipo: 1 (restaurant)
Color principal: #FF5733
Monto: 500
```

Recibirás un `clientId` (ej: `abc123-def456-...`)

### 4. Procesar el cliente

```bash
node scripts/process-client.js abc123-def456 --skip-payment
```

Esto ejecutará:
- ✅ Generación de wireframes
- ✅ Creación de imágenes
- ✅ Optimización SEO
- ✅ Subida a Google Drive (si está configurado)
- ✅ Creación de repositorio GitHub
- ✅ Deployment

### 5. Ver el dashboard

```bash
npm run dev
```

Abre: `http://localhost:3000/dashboard/abc123-def456`

## 📱 Usar el Bot de WhatsApp

### Paso 1: Iniciar el bot

```bash
npm run start-whatsapp-bot
```

### Paso 2: Escanear QR

Aparecerá un código QR en la terminal. Escanéalo con WhatsApp:

1. Abre WhatsApp en tu teléfono
2. Ve a Configuración > Dispositivos Vinculados
3. Escanea el QR

### Paso 3: Prueba el bot

Envíate un mensaje desde otro número:
```
/start
```

El bot te guiará a través de 8 preguntas para recolectar la información.

## 🎯 Flujo de Trabajo Recomendado

### Para Desarrollo/Testing

```bash
# 1. Crear cliente manualmente
npm run attom:create-client

# 2. Procesar sin verificar pago
node scripts/process-client.js <clientId> --skip-payment

# 3. Ver dashboard
npm run dev
# Ir a http://localhost:3000/dashboard/<clientId>
```

### Para Producción

```bash
# 1. Iniciar bot de WhatsApp
npm run start-whatsapp-bot

# 2. Los clientes envían /start por WhatsApp
# El bot recolecta información automáticamente

# 3. Procesar clientes cuando paguen
node scripts/process-client.js <clientId>

# O procesar todos los que pagaron
npm run attom:process-all
```

## 📊 Comandos Útiles

### Ver todos los clientes

```bash
ls data/
```

### Leer info de un cliente

```bash
cat data/<clientId>/info.json
```

### Ver logs de un cliente

```bash
cat data/<clientId>/logs.json
```

### Procesar múltiples clientes

```bash
# Solo los que tienen pago completado
npm run attom:process-all

# Todos, incluso sin pago (testing)
npm run attom:process-all -- --skip-payment

# Reprocesar todos (incluso completados)
npm run attom:process-all -- --force
```

## 🔧 Configuración Mínima vs Completa

### Configuración Mínima (para testing)

Solo necesitas:
- `OPENAI_API_KEY` - Para generar wireframes e imágenes
- `GITHUB_TOKEN` + `GITHUB_USERNAME` - Para crear repos

Con esto puedes:
- ✅ Crear clientes
- ✅ Generar wireframes
- ✅ Generar imágenes
- ✅ Crear repos en GitHub
- ✅ Ver dashboard

No funcionará:
- ❌ Subida a Google Drive
- ❌ Sincronización con Airtable
- ❌ Sincronización con Coda
- ❌ Procesamiento de pagos
- ❌ Bot de WhatsApp

### Configuración Completa (producción)

Configura todas las variables en `.env`:
- OpenAI API
- Google Drive API
- Airtable API
- Coda API
- Stripe API
- GitHub API
- WhatsApp (opcional)
- Hostinger (opcional)

## 🎨 Personalización

### Cambiar colores del dashboard

Edita `app/dashboard/[clientId]/page.tsx`

### Modificar wireframes generados

Edita `lib/mcp-creative/wireframe-generator.ts`

### Cambiar template de pago

Edita `lib/mcp-operative/payment-processor.ts` método `generatePaymentTemplate()`

## 🐛 Solución Rápida de Problemas

### "Cannot find module"

```bash
npm install
```

### "Permission denied" en node_modules

```bash
sudo chown -R $(whoami) node_modules
```

### OpenAI API error

Verifica:
1. La API key es válida
2. Tienes créditos en tu cuenta
3. Tienes acceso a DALL-E 3

### GitHub API error

Verifica:
1. El token tiene permisos de `repo`
2. El username es correcto

## 📞 Próximos Pasos

1. ✅ Configura todas las APIs en `.env`
2. ✅ Crea un cliente de prueba
3. ✅ Procésalo con `--skip-payment`
4. ✅ Revisa el dashboard
5. ✅ Prueba el bot de WhatsApp
6. ✅ Configura Airtable y Coda
7. ✅ Integra sistema de pagos
8. ✅ Deploy a producción

## 💡 Tips Pro

### Modo Debug

Activa logs detallados:
```bash
DEBUG=* node scripts/process-client.js <clientId>
```

### Procesamiento en segundo plano

```bash
nohup node scripts/process-client.js <clientId> > output.log 2>&1 &
```

### Webhook para pagos de Stripe

Configura un webhook en Stripe que apunte a:
```
https://tu-dominio.com/api/webhooks/stripe
```

### Cron job para procesar clientes automáticamente

```bash
# Editar crontab
crontab -e

# Agregar línea (procesa cada hora)
0 * * * * cd ~/Desktop/Attom && node scripts/process-all-clients.js
```

¡Listo! 🎉 Ya tienes Attom funcionando.
