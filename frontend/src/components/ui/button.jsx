import React from "react";

/* ──────────────────────────────────────────────
   Button — shadcn-compatible API
   variant: "default" | "destructive" | "outline" | "ghost" | "success"
   size: "sm" | "md" | "lg" | "icon"
────────────────────────────────────────────── */

const variantClasses = {
  default:
    "bg-gray-900 hover:bg-gray-800 text-white border-transparent",
  destructive:
    "bg-red-600 hover:bg-red-700 text-white border-transparent focus:ring-red-500",
  outline:
    "bg-white hover:bg-gray-50 text-gray-700 border-gray-200",
  ghost:
    "bg-transparent hover:bg-gray-100 text-gray-700 border-transparent",
  success:
    "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-transparent shadow-sm hover:shadow-green-200/50",
  warning:
    "bg-amber-500 hover:bg-amber-600 text-white border-transparent",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-4 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-5 py-3 text-sm rounded-xl gap-2",
  icon: "p-2 rounded-lg",
};

export const Button = React.forwardRef(function Button(
  {
    children,
    variant = "default",
    size = "md",
    className = "",
    disabled = false,
    loading = false,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-semibold border
        transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1
        active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant] ?? variantClasses.default}
        ${sizeClasses[size] ?? sizeClasses.md}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <span
          className={`border-2 border-current/30 border-t-current rounded-full animate-spin flex-shrink-0 ${
            size === "sm" ? "w-3 h-3" : "w-4 h-4"
          }`}
        />
      )}
      {children}
    </button>
  );
});

export default Button;
