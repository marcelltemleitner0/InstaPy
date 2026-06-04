import { CheckCircle, XCircle, X } from "lucide-react";
import { type Toast } from "../types";

interface ToastItemProps {
  toast: Toast;
  anonymous: boolean;
  onClose: (id: string) => void;
}

export function ToastItem({ toast, anonymous, onClose }: ToastItemProps) {
  return (
    <div
      style={{
        transition:
          "opacity 350ms ease, transform 350ms cubic-bezier(0.21, 1.02, 0.73, 1)",
        opacity: toast.show ? 1 : 0,
        transform: toast.show
          ? "translateX(0) scale(1)"
          : "translateX(110%) scale(0.95)",
      }}
      className="pointer-events-auto flex w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5"
    >
      <div className="flex-1 p-4">
        <div className="flex items-start gap-3">
          {toast.success ? (
            <CheckCircle
              className="mt-0.5 size-5 shrink-0 text-green-400"
              strokeWidth={1.5}
            />
          ) : (
            <XCircle
              className="mt-0.5 size-5 shrink-0 text-red-400"
              strokeWidth={1.5}
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {toast.success ? "Unfollowed" : "Failed to unfollow"}
            </p>
            <p className="mt-0.5 text-sm text-gray-500">
              {anonymous ? "Instagram User" : `@${toast.username}`}
            </p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => onClose(toast.id)}
          className="flex w-10 items-center justify-center text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <X size={14} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
