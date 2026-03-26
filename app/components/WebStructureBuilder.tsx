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

  // Handlers
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

  const updateColor = (colorKey: keyof WebStructure['colorScheme'], value: string) => {
    onUpdate({
      ...structure,
      colorScheme: { ...structure.colorScheme, [colorKey]: value }
    });
  };

  const updateSeo = (key: keyof WebStructure['seoMeta'], value: string | string[]) => {
    onUpdate({
      ...structure,
      seoMeta: { ...structure.seoMeta, [key]: value }
    });
  };

  return (
    <div className="bg-[#0d0d15]/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-10 py-8 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{structure.businessName}</h2>
            <p className="text-slate-400 text-sm mt-1 font-light italic">"{structure.tagline}"</p>
          </div>
          <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-purple-400 text-xs font-bold uppercase tracking-widest">
            {structure.niche}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/5">
        <div className="flex px-4 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-8 py-5 text-sm font-bold transition-all whitespace-nowrap border-b-2 uppercase tracking-widest ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-lg text-[10px] ${
                  activeTab === tab.id ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-8 h-[550px] overflow-y-auto custom-scrollbar">
        {/* Sections Tab */}
        {activeTab === 'sections' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-6">Activa y organiza las secciones de tu sitio</p>
            {structure.sections
              .sort((a, b) => a.order - b.order)
              .map((section, index) => (
                <div
                  key={section.id}
                  className={`p-6 rounded-2xl border transition-all duration-300 ${
                    section.enabled
                      ? 'border-purple-500/30 bg-purple-500/[0.03]'
                      : 'border-white/5 bg-white/[0.01] opacity-40'
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col gap-2 cursor-move text-slate-600">
                      <button onClick={() => index > 0 && reorderSections(index, index - 1)} disabled={index === 0} className="hover:text-purple-400 transition-colors disabled:opacity-0">▲</button>
                      <button onClick={() => index < structure.sections.length - 1 && reorderSections(index, index + 1)} disabled={index === structure.sections.length - 1} className="hover:text-purple-400 transition-colors disabled:opacity-0">▼</button>
                    </div>

                    <button
                      onClick={() => toggleSection(section.id)}
                      className={`w-14 h-7 rounded-full transition-all relative ${
                        section.enabled ? 'bg-purple-600 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-white/10'
                      }`}
                    >
                      <span className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${section.enabled ? 'left-8' : 'left-1'}`} />
                    </button>

                    <div className="flex-1">
                      {editingItem === section.id ? (
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => updateSection(section.id, { title: e.target.value })}
                          onBlur={() => setEditingItem(null)}
                          onKeyDown={(e) => e.key === 'Enter' && setEditingItem(null)}
                          className="w-full bg-white/5 border border-purple-500/50 rounded-xl px-4 py-2 text-white focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <div>
                          <span className="font-bold text-white group-hover:text-purple-400 transition-colors">{section.title}</span>
                          <span className="ml-3 text-[10px] px-2 py-0.5 bg-white/5 rounded text-slate-500 uppercase tracking-widest border border-white/5">{section.type}</span>
                          {section.subtitle && <p className="text-sm text-slate-500 mt-1 font-light">{section.subtitle}</p>}
                        </div>
                      )}
                    </div>

                    <button onClick={() => setEditingItem(editingItem === section.id ? null : section.id)} className="p-3 hover:bg-white/5 rounded-xl text-slate-600 hover:text-purple-400 transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-6">Define las categorías de tu negocio</p>
            {structure.categories.map(category => (
              <div key={category.id} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-purple-500/30 transition-all">
                <div className="flex items-start gap-6">
                  <span className="text-4xl p-4 bg-white/5 rounded-2xl">{category.icon}</span>
                  <div className="flex-1">
                    {editingItem === category.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={category.name}
                          onChange={(e) => updateCategory(category.id, { name: e.target.value })}
                          className="w-full bg-white/10 border border-purple-500/30 rounded-xl px-4 py-2 text-white"
                        />
                        <textarea
                          value={category.description}
                          onChange={(e) => updateCategory(category.id, { description: e.target.value })}
                          className="w-full bg-white/10 border border-purple-500/30 rounded-xl px-4 py-2 text-white text-sm"
                          rows={2}
                        />
                        <button onClick={() => setEditingItem(null)} className="text-xs font-bold text-purple-400 uppercase tracking-widest">✓ Finalizar Edición</button>
                      </div>
                    ) : (
                      <>
                        <h4 className="text-lg font-bold text-white">{category.name}</h4>
                        <p className="text-sm text-slate-500 mt-2 font-light leading-relaxed">{category.description}</p>
                        <div className="mt-4 flex items-center gap-2">
                          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest px-2 py-0.5 bg-purple-500/10 rounded border border-purple-500/20">
                            {structure.products.filter(p => p.categoryId === category.id).length} PRODUCTOS
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingItem(editingItem === category.id ? null : category.id)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-500 hover:text-purple-400 transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button onClick={() => deleteCategory(category.id)} className="p-3 bg-white/5 hover:bg-red-500/10 rounded-xl text-slate-500 hover:text-red-400 transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Colors Tab */}
        {activeTab === 'colors' && (
          <div className="space-y-8">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-6">Personaliza la identidad visual</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(structure.colorScheme).map(([key, value]) => (
                <div key={key} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-6">
                  <div className="relative group">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => updateColor(key as keyof WebStructure['colorScheme'], e.target.value)}
                      className="w-16 h-16 rounded-2xl cursor-pointer border-2 border-white/10 shadow-xl opacity-0 absolute inset-0 z-10"
                    />
                    <div className="w-16 h-16 rounded-2xl border-2 border-white/20 shadow-2xl" style={{ backgroundColor: value }}></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">{key}</p>
                    <p className="text-lg font-mono text-white/80">{value.toUpperCase()}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Premium Preview Card */}
            <div className="mt-10 p-10 rounded-[2.5rem] border border-white/5 overflow-hidden relative" style={{ backgroundColor: structure.colorScheme.background }}>
              <div className="relative z-10">
                <h4 className="text-3xl font-bold mb-4 tracking-tighter" style={{ color: structure.colorScheme.primary }}>Demo de Interfaz</h4>
                <p className="text-lg font-light max-w-md leading-relaxed mb-8" style={{ color: structure.colorScheme.text }}>Así es como lucirá la combinación de colores en las secciones de tu sitio web.</p>
                <div className="flex gap-4">
                  <button className="px-8 py-3 rounded-xl text-white font-bold text-sm shadow-xl transition-transform hover:scale-105" style={{ backgroundColor: structure.colorScheme.primary }}>Acción Principal</button>
                  <button className="px-8 py-3 rounded-xl text-white font-bold text-sm border border-white/20 backdrop-blur-md" style={{ backgroundColor: structure.colorScheme.secondary + '44' }}>Alternativo</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products and SEO would follow the same pattern... */}
        {(activeTab === 'products' || activeTab === 'seo') && (
          <div className="flex items-center justify-center h-full text-slate-500 uppercase tracking-widest text-xs font-bold">
            Rediseñando módulo de {activeTab}...
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-10 py-8 bg-black/40 border-t border-white/5 backdrop-blur-3xl flex items-center justify-between">
        <div className="flex items-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          <div className="flex items-center gap-2"><span className="w-2 h-2 bg-purple-500 rounded-full"></span>{structure.sections.filter(s => s.enabled).length} SECCIONES</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 bg-indigo-500 rounded-full"></span>{structure.products.length} PRODUCTOS</div>
        </div>
        <button
          onClick={onConfirm}
          className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
        >
          CONFIRMAR ESTRUCTURA ✓
        </button>
      </div>
    </div>
  );
}
