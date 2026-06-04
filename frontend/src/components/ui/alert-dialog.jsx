import React, { useEffect } from "react";
import { AlertTriangle, Trash2, CheckCircle2, Info } from "lucide-react";

/* ──────────────────────────────────────────────
   AlertDialog — dark-themed, shadcn-compatible
   variant: "destructive" | "warning" | "info" | "success"
────────────────────────────────────────────── */

const variantConfig = {
  destructive: {
    icon: Trash2,
    iconBg: "bg-red-500/15",
    iconColor: "text-red-400",
    iconBorder: "border-red-500/20",
    confirmBg: "bg-red-600 hover:bg-red-500 text-white",
    confirmRing: "focus:ring-red-500",
    titleColor: "text-white",
    accent: "border-t-red-500/30",
  },
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-400",
    iconBorder: "border-amber-500/20",
    confirmBg: "bg-amber-500 hover:bg-amber-400 text-gray-900",
    confirmRing: "focus:ring-amber-400",
    titleColor: "text-white",
    accent: "border-t-amber-500/30",
  },
  info: {
    icon: Info,
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-400",
    iconBorder: "border-blue-500/20",
    confirmBg: "bg-blue-600 hover:bg-blue-500 text-white",
    confirmRing: "focus:ring-blue-500",
    titleColor: "text-white",
    accent: "border-t-blue-500/30",
  },
  success: {
    icon: CheckCircle2,
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
    iconBorder: "border-emerald-500/20",
    confirmBg: "bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold",
    confirmRing: "focus:ring-emerald-500",
    titleColor: "text-white",
    accent: "border-t-emerald-500/30",
  },
};

export function AlertDialog({
  open,
  onOpenChange,
  title = "Konfirmasi",
  description = "",
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  variant = "destructive",
  onConfirm,
  loading = false,
  children,
}) {
  const cfg = variantConfig[variant] ?? variantConfig.destructive;
  const Icon = cfg.icon;

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape" && !loading) onOpenChange?.(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onOpenChange, loading]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => !loading && onOpenChange?.(false)}
      />

      {/* Panel */}
      <div
        className="relative z-10 bg-[#0d1a14] border border-white/10 rounded-2xl shadow-2xl w-full flex flex-col overflow-hidden"
        style={{ maxWidth: "min(400px, calc(100vw - 2rem))", animation: "dialog-in 0.2s ease-out" }}
      >
        {/* Top accent bar */}
        <div className={`h-0.5 w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-40 ${cfg.iconColor}`} />

        <div className="p-6 flex flex-col gap-5">
          {/* Icon + Title */}
          <div className="flex flex-col items-center text-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${cfg.iconBg} border ${cfg.iconBorder} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-7 h-7 ${cfg.iconColor}`} />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${cfg.titleColor}`}>{title}</h2>
              {description && (
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">{description}</p>
              )}
            </div>
          </div>

          {children && <div>{children}</div>}

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-2 pt-1">
            <button
              onClick={() => onOpenChange?.(false)}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold ${cfg.confirmBg} transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0d1a14] ${cfg.confirmRing} disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.97]`}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                  <span>Memproses…</span>
                </>
              ) : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
