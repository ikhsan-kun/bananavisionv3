import { useState } from "react";
import { adminLogin } from "../../hooks/data";
import LoadingSpinner from "../../components/LoadingSpinner";
import { ShieldCheck, Mail, Lock, LogIn, ArrowLeft, Eye, EyeOff, Leaf, Brain, BarChart3, Activity } from "lucide-react";

const features = [
  { icon: Brain, title: "Model AI Cerdas", desc: "Kelola dan pantau model deep learning aktif" },
  { icon: Leaf, title: "Katalog Penyakit", desc: "Atur database penyakit pisang secara real-time" },
  { icon: BarChart3, title: "Analitik Sistem", desc: "Pantau statistik deteksi dan aktivitas pengguna" },
  { icon: Activity, title: "Server Health", desc: "Monitor status microservice AI kapan saja" },
];

export default function AdminLoginPage({ handleAdminLogin, onBackToUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email dan password wajib diisi");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await adminLogin(email, password);
      if (handleAdminLogin) handleAdminLogin(data);
    } catch (err) {
      setError(err.message || "Gagal login admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0a0f0d]">

      {/* Left Panel — Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-12 relative">

        {/* Subtle grid bg */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(#10b981 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
        <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-md mx-auto">

          {/* Back */}
          <button
            onClick={onBackToUser}
            className="flex items-center gap-2 text-gray-500 hover:text-emerald-400 text-sm mb-10 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Kembali ke Portal Pengguna
          </button>

          {/* Logo + Title */}
          <div className="flex flex-col mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-none">BananaVision</p>
                <p className="text-emerald-400/70 text-[10px] font-semibold tracking-widest uppercase mt-0.5">Admin Panel</p>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Selamat Datang,<br />
              <span className="text-emerald-400">Admin.</span>
            </h1>
            <p className="text-gray-500 text-sm mt-3 leading-relaxed">
              Masuk ke panel kontrol untuk mengelola sistem BananaVision secara penuh.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Admin</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bananavision.com"
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/8 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/8 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-gray-900 font-bold rounded-xl py-3.5 mt-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" color="dark" />
                  <span>Memverifikasi…</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Masuk Panel Admin</span>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-700 text-xs mt-8">
            BananaVision © 2025 · Panel Administrasi Internal
          </p>
        </div>
      </div>

      {/* Right Panel — Dark Hero */}
      <div className="hidden lg:flex flex-1 relative bg-[#0d1a14] items-center justify-center p-12 overflow-hidden border-l border-white/5">

        {/* Animated bg blobs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-600/8 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1.5s" }} />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(#10b981 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />

        <div className="relative z-10 max-w-sm">
          {/* Big headline */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Panel Kontrol Aktif
            </div>
            <h2 className="text-4xl font-extrabold text-white leading-tight tracking-tight">
              Kendalikan.<br />
              Pantau.<br />
              <span className="text-emerald-400">Optimalkan.</span>
            </h2>
            <p className="text-gray-500 text-sm mt-4 leading-relaxed">
              Akses penuh ke sistem BananaVision — kelola model AI, katalog penyakit, dan analytics platform secara real-time.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-2 gap-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white/4 border border-white/8 rounded-2xl p-4 hover:bg-white/6 hover:border-emerald-500/20 transition-all duration-300"
              >
                <div className="w-8 h-8 bg-emerald-500/15 rounded-lg flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-white font-semibold text-sm leading-tight">{title}</p>
                <p className="text-gray-600 text-xs mt-1 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-8 pt-6 border-t border-white/5">
            {[
              { val: "98%", label: "Akurasi Model" },
              { val: "< 3s", label: "Waktu Analisis" },
              { val: "6+", label: "Jenis Penyakit" },
            ].map(({ val, label }) => (
              <div key={label}>
                <p className="text-emerald-400 font-extrabold text-xl">{val}</p>
                <p className="text-gray-600 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
