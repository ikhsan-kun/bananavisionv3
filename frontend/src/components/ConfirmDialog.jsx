import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, AlertTriangle } from "lucide-react";

export default function ConfirmDialog({
  open,
  title = "Konfirmasi",
  description = "",
  onCancel,
  onConfirm,
  confirmText = "Hapus",
  cancelText = "Batal",
  variant = "danger", // "danger" | "warning" | "info"
}) {
  // Toggle body class for navbar blur on desktop
  useEffect(() => {
    if (open) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => document.body.classList.remove("modal-open");
  }, [open]);

  // Close on ESC
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape" && open) onCancel?.(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  const variantConfig = {
    danger:  { icon: "bg-red-100", iconColor: "text-red-600", btn: "bg-red-600 hover:bg-red-500 text-white", border: "border-red-100" },
    warning: { icon: "bg-amber-100", iconColor: "text-amber-600", btn: "bg-amber-500 hover:bg-amber-400 text-white", border: "border-amber-100" },
    info:    { icon: "bg-blue-100", iconColor: "text-blue-600", btn: "bg-blue-600 hover:bg-blue-500 text-white", border: "border-blue-100" },
  }[variant] || { icon: "bg-red-100", iconColor: "text-red-600", btn: "bg-red-600 hover:bg-red-500 text-white", border: "border-red-100" };

  return createPortal(
    <div
      className="modal-wrapper"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel?.(); }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px] md:backdrop-blur-sm"
        style={{ animation: "fadeIn 0.2s ease-out" }}
        onClick={onCancel}
      />

      {/* Dialog */}
      <div
        className="modal-content-sm relative bg-white shadow-2xl overflow-hidden animate-scale-in"
        style={{ animation: "scaleIn 0.28s cubic-bezier(0.22, 1, 0.36, 1)" }}
      >
        {/* Drag handle (mobile only) */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b ${variantConfig.border}`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 ${variantConfig.icon} rounded-xl flex items-center justify-center`}>
              <AlertTriangle className={`w-5 h-5 ${variantConfig.iconColor}`} />
            </div>
            <h3 className="font-bold text-gray-800 text-base">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-all active:scale-95"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-sm ${variantConfig.btn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
