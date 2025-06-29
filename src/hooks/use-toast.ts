import { useState } from 'react';

export interface ToastItem {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  [key: string]: any;
}

export function useToast() {
  // Dummy state for now; replace with your actual toast logic
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Dummy add/remove functions
  const addToast = (toast: ToastItem) => setToasts((prev) => [...prev, toast]);
  const removeToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return { toasts, addToast, removeToast };
} 