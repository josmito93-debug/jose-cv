'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Plus, Minus, Trash2, ShieldAlert } from 'lucide-react';
import { TicketType } from './TicketSelector';

interface CartItem {
  ticket: TicketType;
  quantity: number;
}

interface CartSummaryProps {
  cart: Record<string, number>;
  tickets: TicketType[];
  onUpdateQuantity: (ticketId: string, delta: number) => void;
  onCheckout: () => void;
  isSubmitting: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  cart,
  tickets,
  onUpdateQuantity,
  onCheckout,
  isSubmitting,
}) => {
  // Convert cart mapping to array of CartItems
  const cartItems = Object.entries(cart)
    .map(([id, quantity]) => {
      const ticket = tickets.find(t => t.id === id);
      return { ticket, quantity };
    })
    .filter((item): item is { ticket: TicketType; quantity: number } => !!item.ticket && item.quantity > 0);

  const subtotal = cartItems.reduce((sum, item) => sum + item.ticket.price * item.quantity, 0);
  const serviceFee = Math.round(subtotal * 0.1); // 10% fee
  const total = subtotal + serviceFee;

  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col h-full bg-[#08080a] border border-white/5 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
      <div className="p-5 border-b border-white/5 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-black tracking-wider uppercase text-white">Carrito de Compra</h3>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            {totalItemsCount} {totalItemsCount === 1 ? 'ticket seleccionado' : 'tickets seleccionados'}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[400px] md:max-h-[none]">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-500">
            <ShoppingBag className="w-10 h-10 mb-3 opacity-30 text-indigo-500 animate-pulse" />
            <p className="text-xs font-black uppercase tracking-wider">Tu carrito está vacío</p>
            <p className="text-[10px] text-zinc-600 mt-1">Elige una experiencia para comenzar</p>
          </div>
        ) : (
          <AnimatePresence>
            {cartItems.map(item => (
              <motion.div
                key={item.ticket.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase text-white tracking-wider">
                    {item.ticket.name}
                  </h4>
                  <p className="text-xs text-zinc-400 font-black">
                    ${item.ticket.price} <span className="text-[10px] text-zinc-600">c/u</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-black/40 border border-white/10 rounded-lg p-1">
                    <button
                      onClick={() => onUpdateQuantity(item.ticket.id, -1)}
                      className="p-1.5 hover:bg-white/5 text-zinc-400 hover:text-white rounded-md transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-black text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.ticket.id, 1)}
                      className="p-1.5 hover:bg-white/5 text-zinc-400 hover:text-white rounded-md transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="p-5 border-t border-white/5 bg-black/40 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Tickets</span>
              <span className="font-bold">${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-zinc-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Service fee (10%)</span>
              <span className="font-bold">${serviceFee.toLocaleString()}</span>
            </div>
            <div className="h-px bg-white/5 my-2" />
            <div className="flex justify-between text-white">
              <span className="font-black uppercase tracking-wider text-[11px] text-indigo-400">Total</span>
              <span className="text-lg font-black tracking-tighter text-white">
                ${total.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10 text-zinc-400 text-[10px]">
            <ShieldAlert className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p>
              Tus tickets y reserva estarán vinculados a tu nombre y correo. Recibirás tu ticket QR inmediatamente después del pago.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCheckout}
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black text-xs uppercase tracking-wider hover:from-indigo-500 hover:to-violet-500 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Procesando...
              </span>
            ) : (
              'Continuar al pago'
            )}
          </motion.button>
        </div>
      )}
    </div>
  );
};
