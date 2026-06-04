import { type Toast } from "../types";
import { ToastItem } from "./toastItem";

interface ToastListProps {
  toasts: Toast[];
  anonymous: boolean;
  onDismiss: (id: string) => void;
}

export function ToastList({ toasts, anonymous, onDismiss }: ToastListProps) {
  return (
    <div className="pointer-events-none fixed top-4 right-4 z-50 flex w-80 flex-col gap-3">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          anonymous={anonymous}
          onClose={onDismiss}
        />
      ))}
    </div>
  );
}
