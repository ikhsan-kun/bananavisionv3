import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Leaf, Cpu, LogOut, Menu, X,
  ShieldAlert, ChevronRight, ChevronLeft, Zap
} from "lucide-react";
import { AlertDialog } from "../ui/alert-dialog";

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard, desc: "Ringkasan sistem" },
  { name: "Kelola Penyakit", path: "/admin/diseases", icon: Leaf, desc: "Database penyakit" },
  { name: "Sistem Model AI", path: "/admin/models", icon: Cpu, desc: "AI & model weights" },
];

export default function AdminLayout({ children, admin, handleAdminLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-[#070d0a] text-gray-100 flex flex-col md:flex-row font-sans">

      {/* ─── Mobile Top Bar ─── */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#0a0f0d] z-40 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <ShieldAlert className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-white text-sm tracking-tight">BananaVision</span>
            <span className="text-emerald-400/70 text-[9px] font-semibold tracking-widest uppercase ml-1.5">Admin</span>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all border border-white/5"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ─── Overlay (mobile) ─── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Sidebar ─── */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 flex flex-col h-full
        bg-[#0a0f0d] border-r border-white/5
        transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:flex md:h-full md:flex-shrink-0
        ${collapsed ? "md:w-[68px]" : "md:w-60"}
      `}>

        {/* Brand */}
        <div className={`flex items-center border-b border-white/5 transition-all duration-300 ${collapsed ? "px-3 py-5 justify-center" : "px-5 py-5 gap-3"}`}>
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/25">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="font-bold text-white text-sm tracking-tight leading-none">BananaVision</p>
              <p className="text-emerald-400/60 text-[9px] font-bold tracking-widest uppercase mt-0.5">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2.5 py-4 flex flex-col gap-1 overflow-y-auto hide-scrollbar">
          {!collapsed && (
            <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest px-3 mb-2">
              Navigasi
            </p>
          )}
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                title={collapsed ? item.name : undefined}
                className={`
                  group flex items-center gap-3 rounded-xl text-sm font-medium
                  transition-all duration-200 relative overflow-hidden
                  ${collapsed ? "px-0 py-3 justify-center" : "px-3 py-2.5"}
                  ${isActive
                    ? "bg-gradient-to-r from-emerald-500/15 to-transparent text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }
                `}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gradient-to-b from-emerald-400 to-green-500 rounded-r-full" />
                )}
                <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? "text-emerald-400" : "text-gray-500 group-hover:text-gray-300"}`} />
                {!collapsed && (
                  <>
                    <div className="flex-1 min-w-0">
                      <span className="block truncate">{item.name}</span>
                      {!isActive && <span className="block text-[10px] text-gray-600 truncate">{item.desc}</span>}
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-500/50 flex-shrink-0" />}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle (desktop only) */}
        <div className="hidden md:block px-2.5 pb-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-gray-600 hover:text-gray-400 hover:bg-white/5 transition-all text-xs border border-transparent hover:border-white/5"
            title={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-[10px] font-semibold">Ciutkan</span>
              </>
            )}
          </button>
        </div>

        {/* Profile + Logout */}
        <div className={`border-t border-white/5 transition-all ${collapsed ? "p-2" : "p-2.5"}`}>
          {!collapsed && (
            <div className="flex items-center gap-2.5 px-3 py-2.5 mb-1.5 rounded-xl bg-gradient-to-r from-white/[0.03] to-transparent border border-white/5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white font-black text-xs shadow-md flex-shrink-0">
                {admin?.name ? admin.name.substring(0, 2).toUpperCase() : "SU"}
              </div>
              <div className="overflow-hidden flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{admin?.name || "Super Admin"}</p>
                <p className="text-[10px] text-gray-600 truncate">{admin?.email || "admin@bananavision.com"}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setLogoutDialog(true)}
            className={`w-full flex items-center gap-2.5 text-gray-500 hover:text-red-400 hover:bg-red-500/8 border border-transparent hover:border-red-500/15 text-xs font-semibold rounded-xl transition-all duration-200
              ${collapsed ? "justify-center py-3" : "px-3 py-2.5"}
            `}
            title={collapsed ? "Keluar" : undefined}
          >
            <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
            {!collapsed && <span>Keluar Panel</span>}
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="flex-1 flex flex-col min-h-screen md:min-h-0 md:h-full md:overflow-y-auto relative bg-[#070d0a]">
        {/* Background decoration */}
        <div
          className="absolute inset-0 opacity-[0.012] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(#10b981 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-green-600/[0.03] rounded-full blur-3xl pointer-events-none" />

        {/* Page header strip with live indicator */}
        <div className="relative z-10 flex items-center justify-between px-5 sm:px-8 py-3 border-b border-white/[0.04] bg-white/[0.01] backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-widest">
              {menuItems.find(m => m.path === location.pathname)?.name || "Admin Panel"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-700 font-mono">
            <Zap className="w-2.5 h-2.5 text-emerald-600" />
            BananaVision v3
          </div>
        </div>

        <div key={location.pathname} className="flex-1 p-5 sm:p-8 relative z-10 animate-fade-in">
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
