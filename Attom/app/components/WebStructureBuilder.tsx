'use client';

import { useState } from 'react';

// Types
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

interface WebStructureBuilderProps {
  structure: WebStructure;
  onUpdate: (structure: WebStructure) => void;
  onConfirm: () => void;
}

type ActiveTab = 'sections' | 'categories' | 'products' | 'colors' | 'seo';

export default function WebStructureBuilder({ structure, onUpdate, onConfirm }: WebStructureBuilderProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('sections');
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const tabs: { id: ActiveTab; label: string; icon: string; count?: number }[] = [
    { id: 'sections', label: 'Secciones', icon: '📄', count: structure.sections.filter(s => s.enabled).length },
    { id: 'categories', label: 'Categorías', icon: '📁', count: structure.categories.length },
    { id: 'products', label: 'Productos', icon: '🛍️', count: structure.products.length },
    { id: 'colors', label: 'Colores', icon: '🎨' },
    { id: 'seo', label: 'SEO', icon: '🔍' },
  ];

  // Section handlers
  const toggleSection = (sectionId: string) => {
    const updatedSections = structure.sections.map(s =>
      s.id === sectionId ? { ...s, enabled: !s.enabled } : s
    );
    onUpdate({ ...structure, sections: updatedSections });
  };

  const updateSection = (sectionId: string, updates: Partial<WebSection>) => {
    const updatedSections = structure.sections.map(s =>
      s.id === sectionId ? { ...s, ...updates } : s
    );
    onUpdate({ ...structure, sections: updatedSections });
  };

  const reorderSections = (fromIndex: number, toIndex: number) => {
    const newSections = [...structure.sections];
    const [movedSection] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, movedSection);
    const reorderedSections = newSections.map((s, i) => ({ ...s, order: i }));
    onUpdate({ ...structure, sections: reorderedSections });
  };

  // Category handlers
  const updateCategory = (categoryId: string, updates: Partial<ProductCategory>) => {
    const updatedCategories = structure.categories.map(c =>
      c.id === categoryId ? { ...c, ...updates } : c
    );
    onUpdate({ ...structure, categories: updatedCategories });
  };

  const deleteCategory = (categoryId: string) => {
    const updatedCategories = structure.categories.filter(c => c.id !== categoryId);
    const updatedProducts = structure.products.filter(p => p.categoryId !== categoryId);
    onUpdate({ ...structure, categories: updatedCategories, products: updatedProducts });
  };

  // Product handlers
  const updateProduct = (productId: string, updates: Partial<Product>) => {
    const updatedProducts = structure.products.map(p =>
      p.id === productId ? { ...p, ...updates } : p
    );
    onUpdate({ ...structure, products: updatedProducts });
  };

  const deleteProduct = (productId: string) => {
    const updatedProducts = structure.products.filter(p => p.id !== productId);
    onUpdate({ ...structure, products: updatedProducts });
  };

  const toggleProductHighlight = (productId: string) => {
    const updatedProducts = structure.products.map(p =>
      p.id === productId ? { ...p, highlighted: !p.highlighted } : p
    );
    onUpdate({ ...structure, products: updatedProducts });
  };

  // Color handlers
  const updateColor = (colorKey: keyof WebStructure['colorScheme'], value: string) => {
    onUpdate({
      ...structure,
      colorScheme: { ...structure.colorScheme, [colorKey]: value }
    });
  };

  // SEO handlers
  const updateSeo = (key: keyof WebStructure['seoMeta'], value: string | string[]) => {
    onUpdate({
      ...structure,
      seoMeta: { ...structure.seoMeta, [key]: value }
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div
        className="px-6 py-5"
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">{structure.businessName}</h2>
            <p className="text-white/80 text-sm mt-1">"{structure.tagline}"</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-white/20 rounded-full text-white text-xs font-medium">
              {structure.niche}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-100">
        <div className="flex overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600 bg-purple-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-h-[500px] overflow-y-auto">
        {/* Sections Tab */}
        {activeTab === 'sections' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-4">
              Activa/desactiva y reordena las secciones de tu sitio web
            </p>
            {structure.sections
              .sort((a, b) => a.order - b.order)
              .map((section, index) => (
                <div
                  key={section.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    section.enabled
                      ? 'border-purple-200 bg-purple-50/30'
                      : 'border-gray-100 bg-gray-50/50 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Drag handle */}
                    <div className="flex flex-col gap-1 cursor-move text-gray-400">
                      <button
                        onClick={() => index > 0 && reorderSections(index, index - 1)}
                        disabled={index === 0}
                        className="hover:text-purple-500 disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => index < structure.sections.length - 1 && reorderSections(index, index + 1)}
                        disabled={index === structure.sections.length - 1}
                        className="hover:text-purple-500 disabled:opacity-30"
                      >
                        ▼
                      </button>
                    </div>

                    {/* Toggle */}
                    <button
                      onClick={() => toggleSection(section.id)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        section.enabled ? 'bg-purple-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          section.enabled ? 'left-7' : 'left-1'
                        }`}
                      />
                    </button>

                    {/* Content */}
                    <div className="flex-1">
                      {editingItem === section.id ? (
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => updateSection(section.id, { title: e.target.value })}
                          onBlur={() => setEditingItem(null)}
                          onKeyDown={(e) => e.key === 'Enter' && setEditingItem(null)}
                          className="w-full px-2 py-1 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800">{section.title}</span>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-500">
                            {section.type}
                          </span>
                        </div>
                      )}
                      {section.subtitle && (
                        <p className="text-sm text-gray-500 mt-1">{section.subtitle}</p>
                      )}
                    </div>

                    {/* Edit button */}
                    <button
                      onClick={() => setEditingItem(editingItem === section.id ? null : section.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-purple-500"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 mb-4">
              Organiza tus productos/servicios en categorías
            </p>
            {structure.categories.map(category => (
              <div
                key={category.id}
                className="p-4 rounded-xl border border-gray-200 hover:border-purple-200 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{category.icon}</span>
                  <div className="flex-1">
                    {editingItem === category.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={category.name}
                          onChange={(e) => updateCategory(category.id, { name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                          placeholder="Nombre de categoría"
                        />
                        <textarea
                          value={category.description}
                          onChange={(e) => updateCategory(category.id, { description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                          placeholder="Descripción"
                          rows={2}
                        />
                        <button
                          onClick={() => setEditingItem(null)}
                          className="text-sm text-purple-600 hover:text-purple-700"
                        >
                          ✓ Guardar
                        </button>
                      </div>
                    ) : (
                      <>
                        <h4 className="font-semibold text-gray-800">{category.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                        <p className="text-xs text-purple-500 mt-2">
                          {structure.products.filter(p => p.categoryId === category.id).length} productos
                        </p>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingItem(editingItem === category.id ? null : category.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-purple-500"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 mb-4">
              Edita los detalles de cada producto/servicio
            </p>
            {structure.categories.map(category => (
              <div key={category.id} className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                  <span>{category.icon}</span> {category.name}
                </h4>
                <div className="space-y-3">
                  {structure.products
                    .filter(p => p.categoryId === category.id)
                    .map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        isEditing={editingItem === product.id}
                        onEdit={() => setEditingItem(editingItem === product.id ? null : product.id)}
                        onUpdate={(updates) => updateProduct(product.id, updates)}
                        onDelete={() => deleteProduct(product.id)}
                        onToggleHighlight={() => toggleProductHighlight(product.id)}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Colors Tab */}
        {activeTab === 'colors' && (
          <div className="space-y-6">
            <p className="text-sm text-gray-500 mb-4">
              Personaliza la paleta de colores de tu sitio
            </p>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(structure.colorScheme).map(([key, value]) => (
                <div key={key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => updateColor(key as keyof WebStructure['colorScheme'], e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer border-2 border-white shadow"
                  />
                  <div>
                    <p className="font-medium text-gray-700 capitalize">{key}</p>
                    <p className="text-xs text-gray-400 font-mono">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Preview */}
            <div className="mt-6 p-6 rounded-xl" style={{ backgroundColor: structure.colorScheme.background }}>
              <h4 className="font-bold mb-2" style={{ color: structure.colorScheme.primary }}>
                Vista Previa
              </h4>
              <p className="text-sm mb-4" style={{ color: structure.colorScheme.text }}>
                Así se verán tus colores en la web
              </p>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 rounded-lg text-white text-sm"
                  style={{ backgroundColor: structure.colorScheme.primary }}
                >
                  Botón Primario
                </button>
                <button
                  className="px-4 py-2 rounded-lg text-white text-sm"
                  style={{ backgroundColor: structure.colorScheme.secondary }}
                >
                  Secundario
                </button>
                <button
                  className="px-4 py-2 rounded-lg text-white text-sm"
                  style={{ backgroundColor: structure.colorScheme.accent }}
                >
                  Acento
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <p className="text-sm text-gray-500 mb-4">
              Optimiza cómo aparece tu sitio en Google
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título SEO
                  <span className="text-gray-400 font-normal ml-2">
                    ({structure.seoMeta.title.length}/60)
                  </span>
                </label>
                <input
                  type="text"
                  value={structure.seoMeta.title}
                  onChange={(e) => updateSeo('title', e.target.value)}
                  maxLength={60}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Descripción
                  <span className="text-gray-400 font-normal ml-2">
                    ({structure.seoMeta.description.length}/160)
                  </span>
                </label>
                <textarea
                  value={structure.seoMeta.description}
                  onChange={(e) => updateSeo('description', e.target.value)}
                  maxLength={160}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {structure.seoMeta.keywords.map((keyword, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-2"
                    >
                      {keyword}
                      <button
                        onClick={() => {
                          const newKeywords = structure.seoMeta.keywords.filter((_, idx) => idx !== i);
                          updateSeo('keywords', newKeywords);
                        }}
                        className="hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Agregar keyword y presionar Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      updateSeo('keywords', [...structure.seoMeta.keywords, e.currentTarget.value]);
                      e.currentTarget.value = '';
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                />
              </div>

              {/* Google Preview */}
              <div className="mt-6 p-4 bg-white border border-gray-200 rounded-xl">
                <p className="text-xs text-gray-400 mb-3">Vista previa en Google:</p>
                <div className="font-medium text-blue-700 text-lg hover:underline cursor-pointer">
                  {structure.seoMeta.title || 'Título de tu página'}
                </div>
                <div className="text-green-700 text-sm">
                  www.tu-dominio.com
                </div>
                <div className="text-gray-600 text-sm mt-1">
                  {structure.seoMeta.description || 'Descripción de tu página...'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          <span className="font-medium text-purple-600">{structure.sections.filter(s => s.enabled).length}</span> secciones •{' '}
          <span className="font-medium text-purple-600">{structure.categories.length}</span> categorías •{' '}
          <span className="font-medium text-purple-600">{structure.products.length}</span> productos
        </div>
        <button
          onClick={onConfirm}
          className="px-6 py-3 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          Confirmar Estructura ✓
        </button>
      </div>
    </div>
  );
}

// Product Card Component
function ProductCard({
  product,
  isEditing,
  onEdit,
  onUpdate,
  onDelete,
  onToggleHighlight,
}: {
  product: Product;
  isEditing: boolean;
  onEdit: () => void;
  onUpdate: (updates: Partial<Product>) => void;
  onDelete: () => void;
  onToggleHighlight: () => void;
}) {
  if (isEditing) {
    return (
      <div className="p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
        <div className="space-y-3">
          <input
            type="text"
            value={product.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400"
            placeholder="Nombre del producto"
          />
          <textarea
            value={product.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 text-sm"
            rows={2}
            placeholder="Descripción completa"
          />
          <input
            type="text"
            value={product.shortDescription}
            onChange={(e) => onUpdate({ shortDescription: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 text-sm"
            placeholder="Descripción corta"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Beneficios</label>
              {product.benefits.map((benefit, i) => (
                <input
                  key={i}
                  type="text"
                  value={benefit}
                  onChange={(e) => {
                    const newBenefits = [...product.benefits];
                    newBenefits[i] = e.target.value;
                    onUpdate({ benefits: newBenefits });
                  }}
                  className="w-full px-2 py-1 border border-gray-200 rounded text-xs mb-1"
                />
              ))}
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Características</label>
              {product.features.map((feature, i) => (
                <input
                  key={i}
                  type="text"
                  value={feature}
                  onChange={(e) => {
                    const newFeatures = [...product.features];
                    newFeatures[i] = e.target.value;
                    onUpdate({ features: newFeatures });
                  }}
                  className="w-full px-2 py-1 border border-gray-200 rounded text-xs mb-1"
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={onEdit} className="text-sm text-purple-600 font-medium">
              ✓ Guardar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-xl border transition-all ${
      product.highlighted
        ? 'border-yellow-300 bg-yellow-50'
        : 'border-gray-200 hover:border-purple-200'
    }`}>
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h5 className="font-semibold text-gray-800">{product.name}</h5>
            {product.highlighted && (
              <span className="text-yellow-500 text-sm">⭐</span>
            )}
            {product.price && (
              <span className="text-purple-600 font-medium text-sm">{product.price}</span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">{product.shortDescription}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {product.benefits.slice(0, 2).map((b, i) => (
              <span key={i} className="text-xs px-2 py-0.5 bg-green-50 text-green-600 rounded">
                ✓ {b}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onToggleHighlight}
            className={`p-2 rounded-lg transition-colors ${
              product.highlighted ? 'bg-yellow-100 text-yellow-600' : 'hover:bg-gray-100 text-gray-400'
            }`}
            title="Destacar"
          >
            ⭐
          </button>
          <button
            onClick={onEdit}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-purple-500"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
