// Tipos para la información de negocio recopilada por el chat collector

export interface BusinessInfo {
  id: string;
  field: BusinessField;
  label: string;
  value: string;
  icon: string;
  confirmed: boolean;
  timestamp: string;
}

export type BusinessField =
  | 'businessName'
  | 'city'
  | 'email'
  | 'phone'
  | 'socialMedia'
  | 'services'
  | 'brandColors'
  | 'logo'
  | 'schedule'
  | 'exactLocation'
  | 'companyHistory'
  | 'team';

export interface BusinessFieldMeta {
  field: BusinessField;
  label: string;
  icon: string;
  required: boolean;
  description: string;
}

export const BUSINESS_FIELDS_META: BusinessFieldMeta[] = [
  {
    field: 'businessName',
    label: 'Nombre del Negocio',
    icon: '🏢',
    required: true,
    description: 'El nombre oficial o comercial de tu negocio',
  },
  {
    field: 'city',
    label: 'Ciudad/Zona',
    icon: '📍',
    required: true,
    description: 'Ciudad o zona donde operas principalmente',
  },
  {
    field: 'email',
    label: 'Email de Contacto',
    icon: '📧',
    required: true,
    description: 'Email donde los clientes pueden contactarte',
  },
  {
    field: 'phone',
    label: 'Teléfono',
    icon: '📞',
    required: true,
    description: 'Número de teléfono o WhatsApp de contacto',
  },
  {
    field: 'socialMedia',
    label: 'Redes Sociales',
    icon: '📱',
    required: false,
    description: 'Instagram, Facebook, LinkedIn, etc.',
  },
  {
    field: 'services',
    label: 'Servicios/Productos',
    icon: '🛍️',
    required: true,
    description: 'Lista de servicios o productos que ofreces',
  },
  {
    field: 'brandColors',
    label: 'Colores de Marca',
    icon: '🎨',
    required: false,
    description: 'Colores que identifican tu marca',
  },
  {
    field: 'logo',
    label: 'Logo',
    icon: '🖼️',
    required: false,
    description: 'Información sobre tu logo o si necesitas uno',
  },
  {
    field: 'schedule',
    label: 'Horarios de Atención',
    icon: '🕐',
    required: false,
    description: 'Días y horas en que atiendes',
  },
  {
    field: 'exactLocation',
    label: 'Ubicación Exacta',
    icon: '🗺️',
    required: false,
    description: 'Dirección física o zona de cobertura',
  },
  {
    field: 'companyHistory',
    label: 'Historia de la Empresa',
    icon: '📖',
    required: false,
    description: 'Breve historia o misión de tu negocio',
  },
  {
    field: 'team',
    label: 'Equipo',
    icon: '👥',
    required: false,
    description: 'Información sobre tu equipo de trabajo',
  },
];

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  extractedInfo?: BusinessInfo[];
}

export interface ChatCollectorState {
  messages: ChatMessage[];
  collectedInfo: BusinessInfo[];
  isLoading: boolean;
  isComplete: boolean;
}

export interface ChatCollectorResponse {
  response: string;
  extractedInfo: BusinessInfo[];
  success: boolean;
  error?: string;
}

// Función helper para obtener los campos faltantes
export function getMissingFields(collectedInfo: BusinessInfo[]): BusinessFieldMeta[] {
  const collectedFields = new Set(collectedInfo.map(info => info.field));
  return BUSINESS_FIELDS_META.filter(meta => !collectedFields.has(meta.field));
}

// Función helper para obtener los campos requeridos faltantes
export function getMissingRequiredFields(collectedInfo: BusinessInfo[]): BusinessFieldMeta[] {
  const collectedFields = new Set(collectedInfo.map(info => info.field));
  return BUSINESS_FIELDS_META.filter(meta => meta.required && !collectedFields.has(meta.field));
}

// Función helper para calcular el progreso
export function calculateProgress(collectedInfo: BusinessInfo[]): {
  percentage: number;
  completed: number;
  total: number;
  requiredCompleted: number;
  requiredTotal: number;
} {
  const total = BUSINESS_FIELDS_META.length;
  const completed = collectedInfo.length;
  const requiredTotal = BUSINESS_FIELDS_META.filter(m => m.required).length;
  const requiredCompleted = collectedInfo.filter(info => {
    const meta = BUSINESS_FIELDS_META.find(m => m.field === info.field);
    return meta?.required;
  }).length;

  return {
    percentage: Math.round((completed / total) * 100),
    completed,
    total,
    requiredCompleted,
    requiredTotal,
  };
}
