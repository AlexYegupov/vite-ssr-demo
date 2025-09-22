import * as ToastPrimitive from '@radix-ui/react-toast';
import { useToast } from '../context/toast-context';
import styles from './toast.module.css';

export function GlobalToast() {
  const { toasts, removeToast } = useToast();

  return (
    <>
      {toasts.map((toast) => (
        <ToastPrimitive.Root 
          key={toast.id}
          className={styles.toastRoot}
          duration={toast.duration}
          onOpenChange={(open: boolean) => !open && removeToast(toast.id)}
        >
          <div className={styles.toastContent}>
            <ToastPrimitive.Title className={styles.toastTitle}>
              {toast.title}
            </ToastPrimitive.Title>
            {toast.description && (
              <ToastPrimitive.Description className={styles.toastDescription}>
                {toast.description}
              </ToastPrimitive.Description>
            )}
          </div>
          
          <div className={styles.toastActions}>
            {toast.action && (
              <ToastPrimitive.Action asChild altText={toast.action.label}>
                <button 
                  className={`${styles.toastButton} ${styles.toastAction}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.action?.onClick();
                    removeToast(toast.id);
                  }}
                >
                  {toast.action.label}
                </button>
              </ToastPrimitive.Action>
            )}
            <ToastPrimitive.Close asChild>
              <button 
                className={`${styles.toastButton} ${styles.toastClose}`}
                aria-label="Dismiss"
              >
                Dismiss
              </button>
            </ToastPrimitive.Close>
          </div>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport className={styles.toastViewport} />
    </>
  );
}
