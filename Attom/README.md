# 🚀 Attom - Automated Website Creation System

**Attom** es un sistema automatizado completo para gestionar el flujo de creación de páginas web, desde la recolección de información del cliente por WhatsApp hasta el deployment final en hosting.

## 📋 Características Principales

### 🎨 MCP Creativo
- **Generación Automática de Wireframes** usando AI (DALL-E)
- **Creación de Imágenes Personalizadas** (banners, mockups, redes sociales)
- **Optimización SEO** (meta tags, keywords, structured data)
- **Integración con Google Drive** para organizar todos los assets

### ⚙️ MCP Operativo
- **Procesamiento de Pagos** (Pago Móvil Venezuela / Stripe)
- **Creación Automática de Repositorios GitHub**
- **Deployment a Hosting** (Hostinger / GitHub Pages)
- **Configuración de Dominio y SSL**

### 📱 Integraciones
- **WhatsApp Bot** para recolectar información de clientes
- **Airtable CRM** para gestión de clientes
- **Coda Project Management** para seguimiento de tareas
- **Google Drive** para organización de assets

### 🎯 Dashboard del Cliente
- Visualización de wireframes y assets generados
- Tracking de estado de pago y deployment
- Enlaces a GitHub y sitio web deployado
- Vista de SEO metadata

### 🔧 Admin Dashboard
- **Vista general de todos los clientes** con estadísticas en tiempo real
- **Gestión centralizada** de proyectos desde un solo lugar
- **Procesamiento con un click** - lanza el workflow completo para cualquier cliente
- **Monitoreo de estados** - tracking visual de pagos y deployments
- **Acceso directo** a dashboards de clientes, GitHub repos y sitios web
- **Diseño editorial moderno** con dark theme y animaciones sutiles

## 🏗️ Arquitectura del Sistema

```
Attom/
├── lib/
│   ├── mcp-creative/          # Módulo creativo (wireframes, imágenes, SEO)
│   │   ├── wireframe-generator.ts
│   │   ├── image-generator.ts
│   │   ├── seo-generator.ts
│   │   ├── drive-manager.ts
│   │   └── index.ts
│   ├── mcp-operative/         # Módulo operativo (pagos, GitHub, hosting)
│   │   ├── payment-processor.ts
│   │   ├── github-manager.ts
│   │   ├── hosting-manager.ts
│   │   └── index.ts
│   ├── integrations/          # Integraciones externas
│   │   ├── whatsapp-bot.ts
│   │   ├── airtable-crm.ts
│   │   └── coda-pm.ts
│   ├── types/                 # Schemas y tipos TypeScript
│   │   └── client.ts
│   └── utils/                 # Utilidades
│       ├── file-manager.ts
│       └── logger.ts
├── app/                       # Next.js App (Dashboard)
│   ├── dashboard/[clientId]/  # Dashboard del cliente
│   └── api/clients/           # API routes
├── scripts/                   # Scripts de automatización
│   ├── create-client.js
│   ├── process-client.js
│   ├── process-all-clients.js
│   └── start-whatsapp-bot.js
└── data/                      # Datos de clientes (creado automáticamente)
    └── {clientId}/
        ├── info.json
        ├── wireframes/
        ├── images/
        ├── exports/
        └── logs.json
```

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <repo-url>
cd Attom
```

### 2. Instalar dependencias

**IMPORTANTE:** Hay un problema de permisos con `node_modules`. Ejecuta:

```bash
# Eliminar node_modules con permisos de root (si es necesario)
sudo rm -rf node_modules package-lock.json

# Reinstalar dependencias
npm install
```

### 3. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y configura todas las claves API:

```bash
cp .env.example .env
```

Luego edita `.env` con tus credenciales:

```env
# OpenAI (para generación de imágenes y contenido)
OPENAI_API_KEY=sk-...

# Google Cloud (Drive)
GOOGLE_CLIENT_EMAIL=...
GOOGLE_PRIVATE_KEY=...
GOOGLE_PROJECT_ID=...
GOOGLE_DRIVE_FOLDER_ID=...

# Airtable
AIRTABLE_API_KEY=...
AIRTABLE_BASE_ID=...
AIRTABLE_TABLE_NAME=Clients

# Coda
CODA_API_KEY=...
CODA_DOC_ID=...
CODA_TABLE_ID=...

# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...

# GitHub
GITHUB_TOKEN=ghp_...
GITHUB_USERNAME=your-username

# Hostinger (opcional)
HOSTINGER_API_KEY=...

# Pago Móvil
PAGO_MOVIL_BANK=Banco Provincial
PAGO_MOVIL_PHONE=0414-1234567
PAGO_MOVIL_ID=V-12345678
PAGO_MOVIL_NAME=Tu Nombre
```

## 📱 Uso

### Opción 1: Bot de WhatsApp (Automatizado)

Inicia el bot de WhatsApp para que los clientes se registren automáticamente:

```bash
npm run start-whatsapp-bot
```

El bot:
1. Escanea código QR para autenticar WhatsApp
2. Escucha mensajes de clientes
3. Recolecta información (nombre, negocio, colores, etc.)
4. Guarda todo en `/data/{clientId}/info.json`

Los clientes deben enviar `/start` para iniciar la conversación.

### Opción 2: Crear Cliente Manualmente

```bash
npm run attom:create-client
```

Este script interactivo te pedirá la información del cliente.

### Procesar un Cliente Específico

Una vez creado el cliente, procésalo con:

```bash
node scripts/process-client.js <clientId>
```

Opciones:
- `--skip-payment` - Omitir verificación de pago
- `--skip-notification` - No enviar notificación por WhatsApp
- `--domain=example.com` - Configurar dominio personalizado

Ejemplo:
```bash
node scripts/process-client.js abc123-def456 --skip-payment
```

### Procesar Todos los Clientes

Para procesar todos los clientes pendientes en lote:

```bash
npm run attom:process-all
```

Opciones:
- `--force` - Reprocesar todos (incluso completados)
- `--skip-payment` - Omitir verificación de pago
- `--skip-notification` - No enviar notificaciones

## 🎯 Flujo de Trabajo Completo

```
1. RECOLECCIÓN (WhatsApp Bot)
   ↓ Cliente envía /start
   ↓ Bot recolecta info (nombre, colores, productos, presupuesto)
   ↓ Guarda en /data/{clientId}/info.json

2. MCP CREATIVO
   ↓ Genera wireframes con DALL-E
   ↓ Crea imágenes (banners, mockups)
   ↓ Optimiza SEO (títulos, keywords, meta tags)
   ↓ Sube todo a Google Drive

3. SINCRONIZACIÓN
   ↓ Actualiza Airtable CRM
   ↓ Actualiza Coda Project Management
   ↓ Genera template de pago (Pago Móvil / Stripe)

4. CONFIRMACIÓN DE PAGO
   ↓ Cliente realiza pago
   ↓ Se confirma manualmente o vía Stripe

5. MCP OPERATIVO
   ↓ Crea repositorio en GitHub
   ↓ Sube archivos del sitio web
   ↓ Deploy a Hostinger o GitHub Pages
   ↓ Configura dominio y SSL

6. NOTIFICACIÓN
   ↓ Envía mensaje por WhatsApp con URLs
   ↓ Cliente puede ver dashboard en /dashboard/{clientId}
```

## 📊 Dashboard del Cliente

Accede al dashboard en:

```
http://localhost:3000/dashboard/{clientId}
```

El dashboard muestra:
- ✅ Estado del proyecto
- 💰 Información de pago
- 🎨 Wireframes generados
- 🖼️ Imágenes personalizadas
- 📈 SEO metadata
- 🔗 Enlaces a GitHub y sitio web

## 🔧 Admin Dashboard

El Admin Dashboard es tu centro de control para gestionar todos los clientes y proyectos de Attom.

### Acceso

```
http://localhost:3000/admin
```

### Características

**📊 Estadísticas en Tiempo Real**
- Total de clientes en el sistema
- Clientes con pago pendiente
- Proyectos en progreso
- Proyectos completados

**👥 Gestión de Clientes**
- Lista completa de todos los clientes
- Vista detallada de cada proyecto
- Badges de estado visuales (pago y deployment)
- Información de contacto y tipo de negocio

**⚡ Acciones Rápidas**
- **Process Client** - Lanza el workflow completo con un click
- **View Dashboard** - Acceso directo al dashboard del cliente
- **GitHub** - Enlace al repositorio
- **Visit Site** - Enlace al sitio web deployado

**🎨 Diseño**
- Dark theme editorial moderno
- Animaciones sutiles de entrada
- Layout responsive
- Tipografía refinada y espaciado generoso

### Uso

1. **Ver todos los clientes:**
   - Abre `/admin` para ver la lista completa
   - Las estadísticas se actualizan automáticamente

2. **Procesar un cliente:**
   - Click en "Process Client" para clientes con pago completado
   - El proceso se ejecuta en segundo plano
   - Refresca la página para ver actualizaciones

3. **Navegar a recursos:**
   - Click en "View Dashboard" para ver assets del cliente
   - Click en "GitHub" para ver el repositorio
   - Click en "Visit Site" para ver el sitio web live

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor Next.js

# Attom Scripts
npm run attom:create-client       # Crear cliente nuevo (interactivo)
npm run attom:process-all         # Procesar todos los clientes pendientes

# Scripts directos
node scripts/start-whatsapp-bot.js          # Iniciar bot de WhatsApp
node scripts/create-client.js               # Crear cliente
node scripts/process-client.js <clientId>   # Procesar cliente específico
node scripts/process-all-clients.js         # Procesar todos
```

## 🗂️ Estructura de Datos del Cliente

Cada cliente se guarda en `/data/{clientId}/info.json`:

```json
{
  "info": {
    "clientId": "uuid",
    "businessName": "Mi Negocio",
    "contactName": "Juan Pérez",
    "phone": "1234567890",
    "email": "juan@example.com",
    "businessType": "restaurant",
    "createdAt": "2024-01-15T00:00:00Z",
    "updatedAt": "2024-01-15T00:00:00Z"
  },
  "branding": {
    "colors": {
      "primary": "#FF5733",
      "secondary": "#000000"
    },
    "logo": {
      "url": "https://...",
      "driveUrl": "https://drive.google.com/..."
    }
  },
  "assets": {
    "wireframes": { ... },
    "images": [ ... ],
    "seo": { ... }
  },
  "payment": {
    "method": "pago_movil",
    "status": "completed",
    "amount": 500,
    "currency": "USD"
  },
  "deployment": {
    "status": "completed",
    "github": {
      "repoUrl": "https://github.com/..."
    },
    "hosting": {
      "url": "https://mi-negocio.com",
      "sslEnabled": true
    }
  }
}
```

## 📝 Logs y Auditoría

Todos los eventos se registran en:
- `/data/{clientId}/logs.json` - Logs específicos del cliente
- Consola con timestamps y contexto

Ejemplo de log:
```json
[
  {
    "timestamp": "2024-01-15T12:00:00Z",
    "action": "client-info-collected",
    "details": { "source": "whatsapp" }
  },
  {
    "timestamp": "2024-01-15T12:05:00Z",
    "action": "mcp-creative-completed",
    "details": { "wireframesGenerated": 5, "imagesGenerated": 8 }
  }
]
```

## 🛠️ Tecnologías Utilizadas

- **Next.js 16** - Framework React
- **TypeScript** - Tipado estático
- **Zod** - Validación de schemas
- **OpenAI API** - Generación de imágenes y contenido
- **Google Drive API** - Almacenamiento de assets
- **Airtable API** - CRM
- **Coda API** - Project Management
- **Stripe API** - Procesamiento de pagos
- **GitHub API (Octokit)** - Gestión de repositorios
- **WhatsApp Web.js** - Bot de WhatsApp

## 🚨 Solución de Problemas

### Error de permisos en node_modules

```bash
sudo chown -R $(whoami) node_modules
# O eliminar y reinstalar:
sudo rm -rf node_modules package-lock.json
npm install
```

### WhatsApp Bot no conecta

1. Asegúrate de tener WhatsApp instalado en tu teléfono
2. Escanea el código QR que aparece en la consola
3. El bot necesita mantener sesión activa

### Generación de imágenes falla

- Verifica que `OPENAI_API_KEY` esté configurada correctamente
- Asegúrate de tener créditos en tu cuenta de OpenAI
- Las imágenes DALL-E 3 requieren una API key con acceso

### Google Drive no funciona

- Verifica las credenciales del Service Account
- Asegúrate de que el Service Account tenga permisos en la carpeta de Drive
- El `GOOGLE_PRIVATE_KEY` debe tener los `\n` correctamente formateados

## 🤝 Contribuir

Este es un sistema interno de Universa Agency. Para contribuir:

1. Crea un branch: `git checkout -b feature/nueva-funcionalidad`
2. Haz commit de tus cambios: `git commit -m 'Add: nueva funcionalidad'`
3. Push al branch: `git push origin feature/nueva-funcionalidad`
4. Abre un Pull Request

## 📄 Licencia

© 2024 Universa Agency. Todos los derechos reservados.

## 📞 Soporte

Para soporte técnico, contacta al equipo de desarrollo de Universa Agency.
