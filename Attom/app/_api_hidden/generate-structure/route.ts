
import { NextRequest, NextResponse } from 'next/server';

// Tipos para la estructura del sitio web
export interface WebSection {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  content?: string;
  order: number;
  enabled: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  shortDescription: string;
  benefits: string[];
  features: string[];
  price?: string;
  highlighted: boolean;
  order: number;
}

export interface WebStructure {
  businessName: string;
  tagline: string;
  niche: string;
  sections: WebSection[];
  categories: ProductCategory[];
  products: Product[];
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  seoMeta: {
    title: string;
    description: string;
    keywords: string[];
  };
}

interface BusinessInfo {
  field: string;
  value: string;
  label: string;
}

// Generar estructura simulada basada en la información del negocio
function generateSimulatedStructure(businessInfo: BusinessInfo[]): WebStructure {
  // Extraer información
  const getField = (field: string) => businessInfo.find(i => i.field === field)?.value || '';

  const businessName = getField('businessName') || 'Mi Negocio';
  const services = getField('services') || 'Servicios profesionales';
  const city = getField('city') || 'Tu ciudad';
  const brandColors = getField('brandColors')?.toLowerCase() || 'azul';

  // Detectar nicho basado en servicios
  let niche = 'Servicios Generales';
  const servicesLower = services.toLowerCase();
  if (servicesLower.includes('restaur') || servicesLower.includes('comida') || servicesLower.includes('cocina')) {
    niche = 'Restaurante / Gastronomía';
  } else if (servicesLower.includes('belleza') || servicesLower.includes('salón') || servicesLower.includes('cabello')) {
    niche = 'Salón de Belleza';
  } else if (servicesLower.includes('tienda') || servicesLower.includes('venta') || servicesLower.includes('producto')) {
    niche = 'E-commerce / Tienda';
  } else if (servicesLower.includes('médic') || servicesLower.includes('salud') || servicesLower.includes('clínica')) {
    niche = 'Salud / Medicina';
  } else if (servicesLower.includes('abogad') || servicesLower.includes('legal') || servicesLower.includes('jurídic')) {
    niche = 'Servicios Legales';
  } else if (servicesLower.includes('tecnolog') || servicesLower.includes('software') || servicesLower.includes('web')) {
    niche = 'Tecnología / Software';
  }

  // Seleccionar colores basados en preferencia
  let colorScheme = {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#ec4899',
    background: '#ffffff',
    text: '#1f2937'
  };

  if (brandColors.includes('azul')) {
    colorScheme.primary = '#3b82f6';
    colorScheme.secondary = '#1d4ed8';
  } else if (brandColors.includes('rojo')) {
    colorScheme.primary = '#ef4444';
    colorScheme.secondary = '#dc2626';
  } else if (brandColors.includes('verde')) {
    colorScheme.primary = '#22c55e';
    colorScheme.secondary = '#16a34a';
  } else if (brandColors.includes('morado') || brandColors.includes('púrpura')) {
    colorScheme.primary = '#8b5cf6';
    colorScheme.secondary = '#7c3aed';
  } else if (brandColors.includes('naranja')) {
    colorScheme.primary = '#f97316';
    colorScheme.secondary = '#ea580c';
  }

  // Generar secciones
  const sections: WebSection[] = [
    { id: 'hero', type: 'hero', title: `Bienvenido a ${businessName}`, subtitle: `Tu mejor opción en ${city}`, content: 'Ofrecemos calidad y profesionalismo en cada servicio.', order: 0, enabled: true },
    { id: 'about', type: 'about', title: 'Sobre Nosotros', subtitle: 'Nuestra Historia', content: getField('companyHistory') || 'Somos una empresa comprometida con la excelencia.', order: 1, enabled: true },
    { id: 'services', type: 'services', title: 'Nuestros Servicios', subtitle: 'Lo que ofrecemos', content: 'Descubre todo lo que podemos hacer por ti.', order: 2, enabled: true },
    { id: 'features', type: 'features', title: '¿Por qué elegirnos?', subtitle: 'Nuestras ventajas', content: 'Calidad, confianza y resultados garantizados.', order: 3, enabled: true },
    { id: 'gallery', type: 'gallery', title: 'Galería', subtitle: 'Nuestro trabajo', content: 'Mira algunos de nuestros mejores trabajos.', order: 4, enabled: true },
    { id: 'testimonials', type: 'testimonials', title: 'Testimonios', subtitle: 'Lo que dicen nuestros clientes', content: 'Historias de éxito de quienes confían en nosotros.', order: 5, enabled: true },
    { id: 'team', type: 'team', title: 'Nuestro Equipo', subtitle: 'Profesionales dedicados', content: getField('team') || 'Un equipo comprometido con tu satisfacción.', order: 6, enabled: !!getField('team') },
    { id: 'contact', type: 'contact', title: 'Contáctanos', subtitle: 'Estamos para ayudarte', content: `📧 ${getField('email') || 'contacto@email.com'}\n📞 ${getField('phone') || 'Teléfono'}\n📍 ${getField('exactLocation') || city}`, order: 7, enabled: true },
    { id: 'faq', type: 'faq', title: 'Preguntas Frecuentes', subtitle: 'Resolvemos tus dudas', content: 'Las respuestas que necesitas.', order: 8, enabled: true },
    { id: 'cta', type: 'cta', title: '¿Listo para empezar?', subtitle: 'Contáctanos hoy', content: '¡No esperes más! Comunícate con nosotros.', order: 9, enabled: true },
  ];

  // Generar categorías basadas en servicios
  const servicesList = services.split(',').map(s => s.trim()).filter(s => s.length > 0);
  const categories: ProductCategory[] = servicesList.length > 0
    ? servicesList.slice(0, 4).map((service, i) => ({
        id: `cat-${i}`,
        name: service,
        description: `Todo sobre ${service.toLowerCase()}`,
        icon: ['🌟', '💎', '🎯', '✨'][i] || '📦',
        order: i
      }))
    : [
        { id: 'cat-0', name: 'Servicio Principal', description: 'Nuestro servicio estrella', icon: '🌟', order: 0 },
        { id: 'cat-1', name: 'Servicio Premium', description: 'La mejor experiencia', icon: '💎', order: 1 }
      ];

  // Generar productos/servicios
  const products: Product[] = categories.flatMap((cat, catIndex) => [
    {
      id: `prod-${catIndex}-0`,
      categoryId: cat.id,
      name: `${cat.name} Básico`,
      description: `Nuestro paquete básico de ${cat.name.toLowerCase()} incluye todo lo esencial para comenzar. Ideal para quienes buscan calidad a un precio accesible.`,
      shortDescription: `Paquete esencial de ${cat.name.toLowerCase()}`,
      benefits: [
        'Atención personalizada',
        'Garantía de satisfacción',
        'Soporte incluido'
      ],
      features: [
        'Servicio completo',
        'Materiales de calidad',
        'Entrega rápida'
      ],
      highlighted: false,
      order: 0
    },
    {
      id: `prod-${catIndex}-1`,
      categoryId: cat.id,
      name: `${cat.name} Premium`,
      description: `Nuestra opción premium de ${cat.name.toLowerCase()} con beneficios exclusivos y atención VIP. La mejor inversión para resultados excepcionales.`,
      shortDescription: `Experiencia premium en ${cat.name.toLowerCase()}`,
      benefits: [
        'Atención VIP prioritaria',
        'Garantía extendida',
        'Soporte 24/7',
        'Beneficios exclusivos'
      ],
      features: [
        'Servicio completo premium',
        'Materiales de primera',
        'Entrega express',
        'Seguimiento personalizado'
      ],
      highlighted: true,
      order: 1
    }
  ]);

  return {
    businessName,
    tagline: `Tu mejor opción en ${niche.toLowerCase()} en ${city}`,
    niche,
    sections,
    categories,
    products,
    colorScheme,
    seoMeta: {
      title: `${businessName} | ${niche} en ${city}`,
      description: `${businessName} ofrece ${services.toLowerCase()} en ${city}. Calidad, profesionalismo y los mejores precios. ¡Contáctanos!`,
      keywords: [businessName.toLowerCase(), niche.toLowerCase(), city.toLowerCase(), ...servicesList.map(s => s.toLowerCase())]
    }
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessInfo } = body;

    if (!businessInfo || businessInfo.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere información del negocio', success: false },
        { status: 400 }
      );
    }

    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));

    const structure = generateSimulatedStructure(businessInfo);

    return NextResponse.json({
      success: true,
      structure,
      mode: 'SIMULADO'
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al generar estructura' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    mode: 'SIMULADO',
    message: 'API de generación de estructura funcionando'
  });
}
