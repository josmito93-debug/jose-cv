'use client';

import { useState, useRef, useEffect } from 'react';

export interface InfoBlockData {
  id: string;
  field: string;
  label: string;
  value: string;
  icon: string;
  confirmed: boolean;
  timestamp: string;
}

interface InfoBlockProps {
  data: InfoBlockData;
  onEdit: (id: string, newValue: string) => void;
  onDelete: (id: string) => void;
  isNew?: boolean;
}

export default function InfoBlock({ data, onEdit, onDelete, isNew = false }: InfoBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(data.value);
  const [isAnimating, setIsAnimating] = useState(isNew);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (isNew) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  const handleSave = () => {
    if (editValue.trim() !== data.value) {
      onEdit(data.id, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(data.value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div
      className={`
        group relative bg-white/5 backdrop-blur-md rounded-2xl border border-white/10
        hover:border-purple-500/30 transition-all duration-300
        ${isAnimating ? 'animate-slide-in-up' : ''}
        ${isEditing ? 'ring-1 ring-purple-500/50 bg-white/10' : ''}
      `}
    >
      {/* Indicador de nuevo */}
      {isNew && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
      )}

      <div className="p-4 flex flex-col h-full">
        {/* Header con icono y label */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-white/5 rounded-lg border border-white/5 text-lg">{data.icon}</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              {data.label}
            </span>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-purple-400 transition-all"
                  title="Editar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(data.id)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all"
                  title="Eliminar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-all"
                  title="Guardar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  onClick={handleCancel}
                  className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 transition-all"
                  title="Cancelar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Contenido / Editor */}
        <div className="flex-1">
          {isEditing ? (
            <textarea
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-3 text-sm text-white bg-white/5 border border-purple-500/30 rounded-xl
                       focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent
                       resize-none min-h-[80px]"
              rows={3}
            />
          ) : (
            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-light">
              {data.value}
            </p>
          )}
        </div>

        {/* Timestamp */}
        <div className="mt-4 flex items-center justify-between opacity-40 group-hover:opacity-100 transition-opacity">
          <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 uppercase tracking-widest font-bold">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
            Extraído
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            {new Date(data.timestamp).toLocaleTimeString('es', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
