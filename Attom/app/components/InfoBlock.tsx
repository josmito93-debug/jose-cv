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
        group relative bg-white rounded-xl border border-gray-100
        shadow-sm hover:shadow-md transition-all duration-300
        ${isAnimating ? 'animate-slide-in-up' : ''}
        ${isEditing ? 'ring-2 ring-purple-400 ring-opacity-50' : ''}
      `}
    >
      {/* Indicador de nuevo */}
      {isNew && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-ping" />
      )}

      <div className="p-4">
        {/* Header con icono y label */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{data.icon}</span>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {data.label}
            </span>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!isEditing ? (
              <>
                {/* Botón de editar - Lápiz */}
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 rounded-lg hover:bg-purple-50 text-gray-400 hover:text-purple-600 transition-all"
                  title="Editar"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>

                {/* Botón de eliminar */}
                <button
                  onClick={() => onDelete(data.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
                  title="Eliminar"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </>
            ) : (
              <>
                {/* Botón de guardar */}
                <button
                  onClick={handleSave}
                  className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all"
                  title="Guardar"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </button>

                {/* Botón de cancelar */}
                <button
                  onClick={handleCancel}
                  className="p-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all"
                  title="Cancelar"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Contenido / Editor */}
        {isEditing ? (
          <textarea
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-2 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent
                     resize-none min-h-[60px]"
            rows={2}
          />
        ) : (
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
            {data.value}
          </p>
        )}

        {/* Timestamp */}
        <div className="mt-2 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs text-gray-400">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Confirmado
          </span>
          <span className="text-xs text-gray-300">•</span>
          <span className="text-xs text-gray-400">
            {new Date(data.timestamp).toLocaleTimeString('es', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </div>

      {/* Barra de color lateral */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{
          background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
        }}
      />
    </div>
  );
}
