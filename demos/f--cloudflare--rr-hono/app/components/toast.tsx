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
          <ToastPrimitive.Title className={styles.toastTitle}>{toast.title}</ToastPrimitive.Title>
          {toast.description && (
            <ToastPrimitive.Description className={styles.toastDescription}>
              {toast.description}
            </ToastPrimitive.Description>
          )}
          <ToastPrimitive.Action asChild altText="Dismiss">
            <button 
              className={styles.toastAction}
              onClick={() => removeToast(toast.id)}
            >
              Dismiss
            </button>
          </ToastPrimitive.Action>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport className={styles.toastViewport} />
    </>
  );
}
