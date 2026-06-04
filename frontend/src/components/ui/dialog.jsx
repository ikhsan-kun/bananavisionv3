import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

/* ──────────────────────────────────────────────
   Dialog — dark-themed, shadcn-compatible API
────────────────────────────────────────────── */

export function Dialog({ open, onOpenChange, children }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => onOpenChange?.(false)}
      />
      {React.Children.map(children, (child) =>
        React.isValidElement(child) && child.type === DialogContent
          ? React.cloneElement(child, { onOpenChange })
          : child
      )}
    </div>
  );
}

export function DialogContent({ children, onOpenChange, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onOpenChange?.(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onOpenChange]);

  return (
    <div
      ref={ref}
      className={`relative z-50 bg-[#0d1a14] border border-white/10 rounded-2xl shadow-2xl w-full mx-4
        max-h-[90vh] flex flex-col overflow-hidden
        ${className}`}
      style={{ maxWidth: "min(600px, calc(100vw - 2rem))", animation: "dialog-in 0.2s ease-out" }}
    >
      <button
        onClick={() => onOpenChange?.(false)}
        className="absolute top-4 right-4 z-10 w-7 h-7 flex items-center justify-center rounded-lg text-gray-600 hover:text-white hover:bg-white/10 transition-all"
        aria-label="Tutup"
      >
        <X className="w-4 h-4" />
      </button>
      {children}
    </div>
  );
}

export function DialogHeader({ children, className = "" }) {
  return (
    <div className={`px-6 pt-6 pb-4 border-b border-white/8 ${className}`}>
      {children}
    </div>
  );
}

export function DialogTitle({ children, className = "" }) {
  return (
    <h2 className={`text-lg font-bold text-white pr-8 ${className}`}>{children}</h2>
  );
}

export function DialogDescription({ children, className = "" }) {
  return (
    <p className={`text-sm text-gray-500 mt-1.5 leading-relaxed ${className}`}>{children}</p>
  );
}

export function DialogBody({ children, className = "" }) {
  return (
    <div className={`flex-1 overflow-y-auto px-6 py-5 ${className}`}>
      {children}
    </div>
  );
}

export function DialogFooter({ children, className = "" }) {
  return (
    <div className={`px-6 py-4 border-t border-white/8 flex flex-col-reverse sm:flex-row justify-end gap-2 ${className}`}>
      {children}
    </div>
  );
}
