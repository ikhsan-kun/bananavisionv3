import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Leaf, Cpu, LogOut, Menu, X, ShieldAlert, ChevronRight } from "lucide-react";
import { AlertDialog } from "../ui/alert-dialog";

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Kelola Penyakit", path: "/admin/diseases", icon: Leaf },
  { name: "Sistem Model AI", path: "/admin/models", icon: Cpu },
];

export default function AdminLayout({ children, admin, handleAdminLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-[#0a0f0d] text-gray-100 flex flex-col md:flex-row font-sans">

      {/* ─── Mobile Top Bar ─── */}
      <div className="md:hidden flex items-center justify-between px-4 py-3.5 border-b border-white/5 bg-[#0d1410] z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center justify-center">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="font-bold text-white text-sm tracking-tight">BananaVision Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ─── Overlay (mobile) ─── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Sidebar ─── */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 flex flex-col h-full
        bg-[#0d1410] border-r border-white/5
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:flex md:h-full md:flex-shrink-0
      `}>

        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
          <div className="w-9 h-9 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="font-bold text-white text-base tracking-tight leading-none">BananaVision</p>
            <p className="text-emerald-400/70 text-[10px] font-semibold tracking-widest uppercase mt-0.5">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest px-3 mb-2">Menu</p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 relative
                  ${isActive
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }
                `}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-emerald-400 rounded-r-full" />
                )}
                <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? "text-emerald-400" : "text-gray-500 group-hover:text-gray-300"}`} />
                <span>{item.name}</span>
                {isActive && <ChevronRight className="ml-auto w-3.5 h-3.5 text-emerald-500/50" />}
              </Link>
            );
          })}
        </nav>

        {/* Profile + Logout */}
        <div className="p-3 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-white/3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white font-bold text-xs shadow-lg flex-shrink-0">
              {admin?.name ? admin.name.substring(0, 2).toUpperCase() : "SU"}
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{admin?.name || "Super Admin"}</p>
              <p className="text-xs text-gray-500 truncate">{admin?.email || "admin@bananavision.com"}</p>
            </div>
          </div>
          <button
            onClick={() => setLogoutDialog(true)}
            className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 text-sm font-medium py-2.5 rounded-xl transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Panel</span>
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="flex-1 flex flex-col min-h-screen md:min-h-0 md:h-full md:overflow-y-auto relative">
        {/* Subtle grid bg */}
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(#10b981 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
        {/* Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/4 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/3 rounded-full blur-3xl pointer-events-none" />

        <div className="flex-1 p-5 sm:p-8 relative z-10">
          {children}
        </div>
      </main>

      {/* ─── Logout Dialog ─── */}
      <AlertDialog
        open={logoutDialog}
        onOpenChange={setLogoutDialog}
        variant="warning"
        title="Keluar dari Panel Admin?"
        description="Sesi admin Anda akan diakhiri. Anda perlu login kembali untuk mengakses panel kontrol."
        confirmLabel="Ya, Keluar"
        cancelLabel="Batal"
        onConfirm={() => { setLogoutDialog(false); handleAdminLogout(); }}
      />
    </div>
  );
}
