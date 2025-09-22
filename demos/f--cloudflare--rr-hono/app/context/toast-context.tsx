import { createContext, useContext, useState } from 'react';
import * as Toast from '@radix-ui/react-toast';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  createdAt: number;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
}

interface ToastContextType {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id' | 'createdAt'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id' | 'createdAt'>) => {
    const newToast = {
      ...toast,
      id: `toast-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      createdAt: Date.now(),
      duration: toast.duration || 5000,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <Toast.Provider>
      <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
        {children}
      </ToastContext.Provider>
    </Toast.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
