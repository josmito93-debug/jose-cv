# 📁 Attom - Estructura del Proyecto

## Resumen General

```
Attom/
├── 📂 app/                      # Next.js App Router
├── 📂 lib/                      # Lógica principal del sistema
├── 📂 scripts/                  # Scripts de automatización
├── 📂 public/                   # Assets públicos
├── 📂 data/                     # Datos de clientes (generado)
└── 📄 Archivos de configuración
```

## 📂 Estructura Detallada

### `/app` - Next.js Application

```
app/
├── dashboard/[clientId]/
│   └── page.tsx                 # Dashboard del cliente (React)
├── api/
│   └── clients/[clientId]/
│       └── route.ts             # API para obtener/actualizar cliente
├── layout.tsx                   # Layout raíz de Next.js
├── page.tsx                     # Página principal (homepage)
├── globals.css                  # Estilos globales
└── favicon.ico                  # Favicon
```

**Archivos clave:**
- `dashboard/[clientId]/page.tsx` - Interfaz visual para que el cliente vea sus assets
- `api/clients/[clientId]/route.ts` - Endpoints REST para datos del cliente

### `/lib` - Lógica Principal

```
lib/
├── mcp-creative/                # MCP Creativo - Generación de Assets
│   ├── wireframe-generator.ts   # Genera wireframes con DALL-E
│   ├── image-generator.ts       # Genera imágenes (banners, mockups)
│   ├── seo-generator.ts         # Genera metadata SEO
│   ├── drive-manager.ts         # Gestiona Google Drive
│   └── index.ts                 # Orquestador MCP Creativo
│
├── mcp-operative/               # MCP Operativo - Deploy y Pagos
│   ├── payment-processor.ts     # Procesa pagos (Pago Móvil/Stripe)
│   ├── github-manager.ts        # Crea repos y sube archivos
│   ├── hosting-manager.ts       # Deploy a Hostinger/GitHub Pages
│   └── index.ts                 # Orquestador MCP Operativo
│
├── integrations/                # Integraciones Externas
│   ├── whatsapp-bot.ts          # Bot conversacional de WhatsApp
│   ├── airtable-crm.ts          # Sincronización con Airtable
│   └── coda-pm.ts               # Sincronización con Coda
│
├── types/                       # Tipos y Schemas
│   └── client.ts                # Schemas Zod + tipos TypeScript
│
└── utils/                       # Utilidades
    ├── file-manager.ts          # Gestión de archivos locales
    └── logger.ts                # Sistema de logs
```

#### MCP Creativo - Módulos

| Archivo | Responsabilidad | APIs usadas |
|---------|----------------|-------------|
| `wireframe-generator.ts` | Genera wireframes de páginas | OpenAI (GPT-4 + DALL-E 3) |
| `image-generator.ts` | Genera imágenes personalizadas | OpenAI (DALL-E 3) |
| `seo-generator.ts` | Genera metadata SEO y keywords | OpenAI (GPT-4) |
| `drive-manager.ts` | Organiza assets en Google Drive | Google Drive API |
| `index.ts` | Orquesta el flujo completo | - |

#### MCP Operativo - Módulos

| Archivo | Responsabilidad | APIs usadas |
|---------|----------------|-------------|
| `payment-processor.ts` | Procesa pagos y genera templates | Stripe API |
| `github-manager.ts` | Crea repos y sube código | GitHub API (Octokit) |
| `hosting-manager.ts` | Deploy a hosting y configura SSL | Hostinger API / FTP |
| `index.ts` | Orquesta el flujo completo | - |

#### Integraciones

| Archivo | Responsabilidad | APIs usadas |
|---------|----------------|-------------|
| `whatsapp-bot.ts` | Bot conversacional para recolectar info | WhatsApp Web.js |
| `airtable-crm.ts` | CRM para gestionar clientes | Airtable API |
| `coda-pm.ts` | Project management y tracking | Coda API |

### `/scripts` - Automatización

```
scripts/
├── create-client.js             # Crea cliente manualmente (CLI interactivo)
├── process-client.js            # Procesa un cliente específico
├── process-all-clients.js       # Procesa todos los clientes en batch
└── start-whatsapp-bot.js        # Inicia el bot de WhatsApp
```

**Uso de cada script:**

| Script | Propósito | Cuándo usar |
|--------|-----------|-------------|
| `create-client.js` | Crear cliente manualmente | Testing / Clientes sin WhatsApp |
| `process-client.js` | Procesar cliente individual | Cuando un cliente paga |
| `process-all-clients.js` | Procesar múltiples clientes | Procesamiento en batch |
| `start-whatsapp-bot.js` | Iniciar bot conversacional | Recolección automática vía WhatsApp |

### `/data` - Almacenamiento Local

```
data/                            # ⚠️ Creado automáticamente
└── {clientId}/                  # UUID único por cliente
    ├── info.json                # Datos completos del cliente
    ├── logs.json                # Historial de acciones
    ├── wireframes/              # Imágenes de wireframes
    │   ├── wireframe-home-0.png
    │   ├── wireframe-about-1.png
    │   └── ...
    ├── images/                  # Imágenes generadas
    │   ├── hero-banner.png
    │   ├── social-share.png
    │   └── ...
    └── exports/                 # Archivos exportados
        ├── payment.html         # Template de pago
        └── website/             # Sitio web generado
```

**Estructura de `info.json`:**
- `info` - Datos básicos del cliente
- `branding` - Logo, colores, fuentes
- `assets` - Wireframes, imágenes, SEO
- `payment` - Estado y detalles de pago
- `deployment` - URLs de GitHub y hosting
- `airtableRecordId` - ID en Airtable
- `codaRowId` - ID en Coda

### Archivos de Configuración

```
.
├── .env.example                 # Template de variables de entorno
├── .env                         # Variables de entorno (NO commitear)
├── .gitignore                   # Archivos ignorados por Git
├── package.json                 # Dependencias y scripts NPM
├── tsconfig.json                # Configuración TypeScript
├── next.config.ts               # Configuración Next.js
├── tailwind.config.js           # Configuración Tailwind CSS
├── postcss.config.mjs           # Configuración PostCSS
└── eslint.config.mjs            # Configuración ESLint
```

## 🔄 Flujo de Datos

### 1. Recolección de Información

```
WhatsApp Bot → lib/integrations/whatsapp-bot.ts
    ↓
Cliente responde preguntas
    ↓
Guardar en data/{clientId}/info.json
```

### 2. Procesamiento MCP Creativo

```
scripts/process-client.js
    ↓
lib/mcp-creative/index.ts
    ↓
├── wireframe-generator.ts → OpenAI DALL-E
├── image-generator.ts → OpenAI DALL-E
├── seo-generator.ts → OpenAI GPT-4
└── drive-manager.ts → Google Drive
    ↓
Actualizar data/{clientId}/info.json
```

### 3. Sincronización CRM

```
lib/integrations/airtable-crm.ts
    ↓
Crear/actualizar registro en Airtable
    ↓
lib/integrations/coda-pm.ts
    ↓
Crear/actualizar fila en Coda
```

### 4. Procesamiento de Pago

```
lib/mcp-operative/payment-processor.ts
    ↓
Generar template de pago (payment.html)
    ↓
Cliente paga vía Pago Móvil o Stripe
    ↓
Confirmar pago → payment.status = 'completed'
```

### 5. Deployment

```
lib/mcp-operative/index.ts
    ↓
├── github-manager.ts → Crear repo + subir archivos
├── hosting-manager.ts → Deploy a Hostinger
└── notification → WhatsApp Bot
    ↓
Cliente recibe URL del sitio
```

## 🎨 Personalización

### Agregar Nuevo Tipo de Negocio

1. Editar `lib/types/client.ts`:
```typescript
businessType: z.enum([
  'restaurant',
  'ecommerce',
  'portfolio',
  'blog',
  'corporate',
  'landing',
  'nuevo-tipo',  // ← Agregar aquí
  'other'
])
```

2. Editar `lib/mcp-creative/wireframe-generator.ts`:
```typescript
const pageTemplates: Record<string, string[]> = {
  // ...
  'nuevo-tipo': ['Home', 'Features', 'Pricing', 'Contact'],
};
```

### Agregar Nuevo Método de Pago

1. Editar `lib/types/client.ts`:
```typescript
method: z.enum(['pago_movil', 'stripe', 'nuevo-metodo', 'both'])
```

2. Implementar en `lib/mcp-operative/payment-processor.ts`

### Agregar Nueva Integración

1. Crear archivo en `lib/integrations/nueva-integracion.ts`
2. Exportar en `lib/integrations/index.ts`
3. Usar en `scripts/process-client.js`

## 📊 Monitoreo y Logs

### Ver logs de un cliente

```bash
cat data/{clientId}/logs.json
```

### Ver logs en tiempo real

```bash
tail -f data/{clientId}/logs.json
```

### Logs en consola

Todos los módulos usan el sistema de logger centralizado:

```typescript
import { createLogger } from '@/lib/utils/logger';
const logger = createLogger('ModuleName');

logger.info('Mensaje informativo');
logger.success('Operación exitosa');
logger.warn('Advertencia');
logger.error('Error', error);
```

## 🚀 Deployment del Sistema

### Opción 1: Servidor dedicado

```bash
# En el servidor
git clone <repo>
cd Attom
npm install
cp .env.example .env
# Configurar .env

# Iniciar servicios
pm2 start scripts/start-whatsapp-bot.js --name attom-whatsapp
pm2 start npm --name attom-dashboard -- run start

# Procesamiento automático cada hora
crontab -e
# Agregar: 0 * * * * cd /path/to/Attom && node scripts/process-all-clients.js
```

### Opción 2: Docker (futuro)

```dockerfile
# Dockerfile para Attom (ejemplo)
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## 📝 Convenciones de Código

- **TypeScript** para toda la lógica
- **Zod** para validación de datos
- **Async/Await** para operaciones asíncronas
- **Logs estructurados** con contexto
- **Error handling** con try/catch y logs
- **File management** centralizado en `file-manager.ts`

## 🔒 Seguridad

- `.env` nunca se commitea (está en `.gitignore`)
- Claves API nunca se hardcodean
- Validación con Zod antes de procesar datos
- Logs no contienen información sensible
- Assets del cliente se guardan localmente y en Drive

## 📚 Referencias

- [Next.js Docs](https://nextjs.org/docs)
- [OpenAI API](https://platform.openai.com/docs)
- [Zod Documentation](https://zod.dev/)
- [WhatsApp Web.js](https://wwebjs.dev/)
- [Airtable API](https://airtable.com/developers/web/api/introduction)
- [Coda API](https://coda.io/developers/apis/v1)
