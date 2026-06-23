import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Home,
  Activity,
  Camera,
  History,
  Book,
  User,
  LogOut,
  ChevronRight,
} from "lucide-react";

export default function Navigation({
  user,
  currentPage,
  setCurrentPage,
  sidebarOpen,
  setSidebarOpen,
  handleLogout,
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const items = [
    { icon: Home, label: "Beranda", page: "home" },
    { icon: Activity, label: "Dashboard", page: "dashboard" },
    { icon: Camera, label: "Analisis", page: "analyze" },
    { icon: History, label: "Riwayat", page: "history" },
    { icon: Book, label: "Katalog", page: "diseases" },
    { icon: User, label: "Profil", page: "profile" },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleNav = (page) => {
    setProfileOpen(false);
    setSidebarOpen && setSidebarOpen(false);
    if (setCurrentPage) setCurrentPage(page);
  };

  return (
    <>
      {/* ── Mobile Header ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between z-50 shadow-sm">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => handleNav("home")}
          role="button"
          aria-label="Go to home"
        >
          <div className="w-8 h-8">
            <img
              src="./bananavision.png"
              alt="BananaVision Logo"
              className="w-full h-full object-fill"
            />
          </div>
          <span className="font-bold text-lg text-gray-800 flex">
            <p className="text-green-500">Banana</p>Vision
          </span>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors active:scale-95"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          ) : (
            currentPage !== "login" && (
              <button
                onClick={() => handleNav("login")}
                className="px-4 py-1.5 bg-green-500 text-white text-sm font-semibold rounded-full hover:bg-green-600 active:scale-95 transition-all"
              >
                Login
              </button>
            )
          )}
        </div>
      </div>

      {/* ── Desktop Top Navigation ── */}
      <header className="hidden md:block fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => handleNav("home")}
            >
              <div className="w-9 h-9 group-hover:scale-110 transition-transform">
                <img
                  src="./bananavision.png"
                  alt="BananaVision Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-bold text-xl text-gray-800 flex">
                <p className="text-green-500">Banana</p>Vision
              </span>
            </div>

            <nav className="flex items-center gap-1">
              {(user
                ? items
                : items.filter(
                    (item) => item.page === "home" || item.page === "diseases",
                  )
              ).map((item) => (
                <button
                  key={item.page}
                  onClick={() => handleNav(item.page)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm font-medium relative
                    ${
                      currentPage === item.page
                        ? "bg-green-50 text-green-700 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                  <item.icon className={`w-4 h-4 ${currentPage === item.page ? "text-green-600" : ""}`} />
                  <span className="hidden lg:inline">{item.label}</span>
                  {currentPage === item.page && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full" />
                  )}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {!user ? (
                currentPage !== "login" && (
                  <button
                    onClick={() => handleNav("login")}
                    className="px-5 py-2 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 hover:shadow-md hover:-translate-y-0.5 transition-all text-sm"
                  >
                    Login
                  </button>
                )
              ) : (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen((s) => !s)}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-all ${profileOpen ? "bg-gray-50" : ""}`}
                  >
                    <img
                      src={
                        user.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=10b981&color=fff`
                      }
                      alt={user.name}
                      className="w-8 h-8 rounded-full ring-2 ring-green-200"
                    />
                    <span className="hidden sm:inline text-sm font-semibold text-gray-800">
                      {user.name?.split(" ")[0] || user.name}
                    </span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 text-gray-400 transition-transform hidden sm:block ${profileOpen ? "rotate-90" : ""}`}
                    />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 animate-scale-in">
                      <div className="px-4 py-2 border-b border-gray-50 mb-1">
                        <p className="text-xs font-bold text-gray-800 truncate">{user.name}</p>
                        <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => handleNav("profile")}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-700 flex items-center gap-2 transition-colors"
                      >
                        <User className="w-4 h-4 text-gray-400" />
                        Profil Saya
                      </button>
                      <button
                        onClick={() => handleNav("dashboard")}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-700 flex items-center gap-2 transition-colors"
                      >
                        <Activity className="w-4 h-4 text-gray-400" />
                        Dashboard
                      </button>
                      <div className="border-t border-gray-50 my-1" />
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          handleLogout && handleLogout();
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Keluar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Sidebar ── */}
      {user && sidebarOpen && (
        <>
          {/* Overlay */}
          <div
            className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer */}
          <div className="md:hidden fixed left-0 top-0 bottom-0 w-72 bg-white shadow-2xl z-50 flex flex-col animate-slide-left">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <img src="./bananavision.png" alt="Logo" className="w-8 h-8" />
                <span className="font-bold text-lg text-gray-800 flex">
                  <p className="text-green-500">Banana</p>Vision
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            {/* User info */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
              <img
                src={
                  user.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=10b981&color=fff`
                }
                alt={user.name}
                className="w-10 h-10 rounded-full ring-2 ring-green-200"
              />
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>

            <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
              {(user
                ? items
                : items.filter(
                    (item) =>
                      item.page === "home" || item.page === "diseases",
                  )
              ).map((item) => (
                <button
                  key={item.page}
                  onClick={() => handleNav(item.page)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                    currentPage === item.page
                      ? "bg-green-50 text-green-700 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${currentPage === item.page ? "text-green-600" : "text-gray-400"}`} />
                  {item.label}
                  {currentPage === item.page && (
                    <span className="ml-auto w-1.5 h-1.5 bg-green-500 rounded-full" />
                  )}
                </button>
              ))}
            </nav>

            <div className="px-3 pb-4 pt-2 border-t border-gray-50">
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  handleLogout && handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors text-sm font-medium"
              >
                <LogOut className="w-5 h-5" />
                Keluar dari Akun
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Bottom Navigation Mobile ── */}
      {currentPage !== "login" && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg z-40">
          <div className="flex justify-around items-center py-1.5 px-2">
            {(user
              ? [
                  { icon: Home, page: "home", label: "Beranda" },
                  { icon: Activity, page: "dashboard", label: "Dashboard" },
                  { icon: Camera, page: "analyze", label: "Analisis" },
                  { icon: Book, page: "diseases", label: "Katalog" },
                  { icon: User, page: "profile", label: "Profil" },
                ]
              : [
                  { icon: Home, page: "home", label: "Beranda" },
                  { icon: Book, page: "diseases", label: "Katalog" },
                ]
            ).map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => handleNav(item.page)}
                  className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-[52px] relative
                    ${isActive
                      ? "text-green-600"
                      : "text-gray-400 hover:text-gray-700"
                    }`}
                >
                  {isActive && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0.5 w-8 h-0.5 bg-green-500 rounded-full" />
                  )}
                  <div className={`p-1.5 rounded-xl transition-all ${isActive ? "bg-green-50 scale-110" : ""}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[9px] font-semibold transition-all ${isActive ? "text-green-600" : "text-gray-400"}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
