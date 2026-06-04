import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

/* ──────────────────────────────────────────────
   Toast + Toaster System (shadcn-style)

   1. Wrap root with <Toaster />
   2. useToast() hook anywhere to fire toasts

   const { toast } = useToast();
   toast({ type: "success", title: "Saved!", description: "..." });
────────────────────────────────────────────── */

const ToastContext = createContext(null);

const typeConfig = {
  success: {
    bg: "bg-white border-l-4 border-l-green-500",
    icon: CheckCircle,
    iconColor: "text-green-500",
    titleColor: "text-green-800",
    descColor: "text-green-700",
    progressBg: "bg-green-500",
  },
  error: {
    bg: "bg-white border-l-4 border-l-red-500",
    icon: AlertCircle,
    iconColor: "text-red-500",
    titleColor: "text-red-800",
    descColor: "text-red-700",
    progressBg: "bg-red-500",
  },
  warning: {
    bg: "bg-white border-l-4 border-l-amber-500",
    icon: AlertTriangle,
    iconColor: "text-amber-500",
    titleColor: "text-amber-800",
    descColor: "text-amber-700",
    progressBg: "bg-amber-500",
  },
  info: {
    bg: "bg-white border-l-4 border-l-blue-500",
    icon: Info,
    iconColor: "text-blue-500",
    titleColor: "text-blue-800",
    descColor: "text-blue-700",
    progressBg: "bg-blue-500",
  },
};

let toastIdCounter = 0;

function ToastItem({ id, type = "info", title, description, duration = 4000, onDismiss }) {
  const [exiting, setExiting] = useState(false);
  const cfg = typeConfig[type] ?? typeConfig.info;
  const Icon = cfg.icon;

  const dismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => onDismiss(id), 280);
  }, [id, onDismiss]);

  useEffect(() => {
    const t = setTimeout(dismiss, duration);
    return () => clearTimeout(t);
  }, [dismiss, duration]);

  return (
    <div
      className={`
        relative ${cfg.bg} rounded-xl shadow-xl border border-gray-100
        flex items-start gap-3 p-4 min-w-[300px] max-w-sm overflow-hidden
        transition-all duration-300
        ${exiting
          ? "opacity-0 translate-x-4 scale-95"
          : "opacity-100 translate-x-0 scale-100"
        }
      `}
    >
      <Icon className={`w-5 h-5 ${cfg.iconColor} flex-shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        {title && <p className={`text-sm font-semibold ${cfg.titleColor}`}>{title}</p>}
        {description && <p className={`text-xs ${cfg.descColor} mt-0.5 leading-relaxed`}>{description}</p>}
      </div>
      <button
        onClick={dismiss}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded"
      >
        <X className="w-3.5 h-3.5" />
      </button>
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100 overflow-hidden">
        <div
          className={`h-full ${cfg.progressBg} origin-left`}
          style={{ animation: `toast-progress ${duration}ms linear forwards` }}
        />
      </div>
    </div>
  );
}

export function Toaster() {
  const ctx = useContext(ToastContext);
  if (!ctx) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {ctx.toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem {...t} onDismiss={ctx.dismiss} />
        </div>
      ))}
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ type = "info", title, description, duration = 4000 }) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev.slice(-4), { id, type, title, description, duration }]);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return { toast: ctx.toast };
}
