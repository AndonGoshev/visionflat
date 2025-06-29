import { useState } from 'react';
export function useToast() {
    // Dummy state for now; replace with your actual toast logic
    const [toasts, setToasts] = useState([]);
    // Dummy add/remove functions
    const addToast = (toast) => setToasts((prev) => [...prev, toast]);
    const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));
    return { toasts, addToast, removeToast };
}
