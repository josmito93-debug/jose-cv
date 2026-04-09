/**
 * El Creador - Master Prompts Library
 * 
 * High-fidelity, engineering-level prompts for Gemini AI to generate 
 * professional content for different social media platforms.
 */

export const MASTER_PROMPTS = {
  REEL: `
    Actúa como un Director de Contenido Viral y Especialista en Reels de Instagram/TikTok.
    Tu objetivo es crear un guion (script) de alta retención para un Reel.

    CONTESTO DEL CLIENTE:
    Nombre: {{businessName}}
    Brief: {{brief}}
    Colores: {{brandColors}}
    Ubicación: {{address}}
    Inspiración (Viral Reference): {{viralLink}}

    ESTRUCTURA DEL REEL:
    1. GANCHO (0-3s): Un hook visual o auditivo que detenga el scroll inmediatamente.
    2. CUERPO (3-12s): Entrega de valor rápido o demostración del beneficio principal.
    3. CTA (12-15s): Llamado a la acción directo y claro.

    REQUERIMIENTOS TÉCNICOS:
    - Lenguaje: Cercano, dinámico, usando lenguaje de la industria.
    - Formato: Solo texto, dividido por secciones del script.
    - Variantes: Proporciona 3 variaciones de tono (Educativo, Entretenido, Venta Directa).
  `,

  CAROUSEL: `
    Actúa como un Estratega de Marketing Digital Senior. 
    Diseña la estructura de un Carrusel de Instagram de 7 slides para "{{businessName}}".

    BRIEF: {{brief}}
    COLORES: {{brandColors}}

    ESQUEMA DEL CARRUSEL:
    - Slide 1: TÍTULO GANCHO (Promesa principal).
    - Slide 2: EL PROBLEMA (Empatía con el dolor del cliente).
    - Slide 3-5: LA SOLUCIÓN (3 pasos o beneficios accionables).
    - Slide 6: RESULTADO (Cómo se ve el éxito con el servicio).
    - Slide 7: CTA (Invitar a comentar, guardar o ir al link en bio).

    TEXTO DE COPY:
    Genera 3 variantes de copy corto para el pie de foto (caption).
  `,

  PAID_ADS: `
    Actúa como un Especialista en Media Buying y Copywriter de Respuesta Directa.
    Crea un anuncio de pago para Facebook/Instagram Ads.

    CLIENTE: {{businessName}}
    OBJETIVO: Conversión / Lead Generation.
    BRIEF: {{brief}}

    ESTRUCTURA DEL ANUNCIO:
    1. HEADLINE: Título disruptivo para la parte superior del anuncio.
    2. BODY COPY: Estructura AIDA (Atención, Interés, Deseo, Acción).
    3. DESCRIPTION: Texto corto que aparece debajo del título.
    4. BOTÓN: Sugerencia de CTA (Registrar, Más Información, Comprar).

    ESTILO: Directo, enfocado en resultados y ROI.
  `
};

export const getPromptForFormat = (format: string, context: any) => {
  let basePrompt = '';
  switch(format.toUpperCase()) {
    case 'REEL': basePrompt = MASTER_PROMPTS.REEL; break;
    case 'CAROUSEL': basePrompt = MASTER_PROMPTS.CAROUSEL; break;
    case 'ADS': basePrompt = MASTER_PROMPTS.PAID_ADS; break;
    default: basePrompt = MASTER_PROMPTS.CAROUSEL;
  }

  // Inject context
  return basePrompt
    .replace('{{businessName}}', context.businessName || 'Cliente')
    .replace('{{brief}}', context.brief || 'Sin brief disponible')
    .replace('{{brandColors}}', context.brandColors || 'Estándar')
    .replace('{{address}}', context.address || 'Global')
    .replace('{{viralLink}}', context.viralLink || 'No provisto');
};
