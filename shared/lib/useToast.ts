import { useToast } from "primevue/usetoast";

type ToastType = "error" | "success" | "info" | "warn";

interface ToastOptions {
  title?: string;
  message: string;
  life?: number;
}

export function useAppToast() {
  const toast = useToast();

  const show = (type: ToastType, options: ToastOptions) => {
    toast.add({
      severity: type,
      summary: options.title,
      detail: options.message,
      life: options.life ?? 4000,
      group: "app",
      
    });
  };

  const showError = (message: string, life?: number) =>
    show("error", { message, life });

  const showSuccess = (message: string, life?: number) =>
    show("success", { message, life });

  return {
    show,
    showError,
    showSuccess,
  };
}


export { useToast };

