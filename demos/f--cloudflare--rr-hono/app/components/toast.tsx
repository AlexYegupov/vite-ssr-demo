import * as ToastPrimitive from '@radix-ui/react-toast';
import { useToast } from '../context/toast-context';
import { useEffect, useState } from 'react';
import styles from './toast.module.css';

function ToastWithTimer({ toast, onDismiss }: { toast: any, onDismiss: () => void }) {
  const [timeLeft, setTimeLeft] = useState(
    toast.duration ? Math.ceil(toast.duration / 1000) : 0
  );

  useEffect(() => {
    if (!toast.duration) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [toast.duration]);

  return (
    <ToastPrimitive.Root 
      key={toast.id}
      data-toast-id={toast.id}
      className={styles.toastRoot}
      duration={toast.duration}
      onOpenChange={(open: boolean) => {
        if (!open) {
          onDismiss();
        }
      }}
    >
      <div className={styles.toastContent}>
        <div className={styles.toastHeader}>
          <ToastPrimitive.Title className={styles.toastTitle}>
            {toast.title}
          </ToastPrimitive.Title>
          {toast.duration && (
            <div className={styles.timer}>
              {timeLeft}s
            </div>
          )}
        </div>
        {toast.description && (
          <ToastPrimitive.Description className={styles.toastDescription}>
            {toast.description}
          </ToastPrimitive.Description>
        )}
      </div>
      
      {toast.action && (
        <div className={styles.toastActions}>
          <ToastPrimitive.Action asChild altText={toast.action.label}>
            <button 
              className={`${styles.toastButton} ${styles.toastAction}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Call the action handler
                toast.action?.onClick();
                // Remove the toast from the context
                // This will be handled by the toast's own cleanup
              }}
            >
              {toast.action.label}
            </button>
          </ToastPrimitive.Action>
        </div>
      )}
    </ToastPrimitive.Root>
  );
}

export function GlobalToast() {
  const { toasts, removeToast } = useToast();

  const handleDismiss = (toast: any) => {
    console.log('Toast dismiss triggered for:', toast.id);
    if (toast.onDismiss) {
      console.log('Calling onDismiss for toast:', toast.id);
      toast.onDismiss();
    }
    removeToast(toast.id);
  };

  return (
    <>
      {toasts.map((toast) => (
        <ToastWithTimer 
          key={toast.id} 
          toast={toast} 
          onDismiss={() => handleDismiss(toast)} 
        />
      ))}
      <ToastPrimitive.Viewport className={styles.toastViewport} />
    </>
  );
}
