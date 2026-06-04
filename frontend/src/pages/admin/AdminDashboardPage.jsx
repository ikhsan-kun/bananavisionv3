import { useState, useEffect } from "react";
import { getAdminStats } from "../../hooks/data";
import LoadingSpinner from "../../components/LoadingSpinner";
import { 
  Users, FileSearch, MessageSquare, ShieldAlert, Clock, Star, 
  TrendingUp, ArrowUpRight, ArrowDownRight, RefreshCw, Layers 
} from "lucide-react";

export default function AdminDashboardPage({ token }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  async function loadStats(isSilent = false) {
    try {
      if (!isSilent) setLoading(true);
      else setRefreshing(true);
      const data = await getAdminStats(token);
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Gagal memuat statistik dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <LoadingSpinner size="lg" color="white" />
        <p className="text-gray-500 text-sm animate-pulse">Menyiapkan panel kendali...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl text-center max-w-lg mx-auto mt-12 backdrop-blur-md">
        <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-6 h-6 text-red-400" />
        </div>
        <h3 className="text-red-400 font-semibold mb-2 text-lg">Terjadi Kesalahan</h3>
        <p className="text-red-500/70 text-sm mb-6 leading-relaxed">{error}</p>
        <button
          onClick={() => loadStats()}
          className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 text-xs px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 active:scale-95"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const { stats: summary, diseaseDistribution = {}, recentAnalyses = [], recentFeedbacks = [] } = stats || {};

  const cardItems = [
    {
      title: "Total Pengguna",
      value: summary?.totalUsers || 0,
      icon: Users,
      color: "from-emerald-500/10 via-emerald-500/5 to-transparent",
      border: "border-emerald-500/20",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
      badge: "text-white",
      trend: "+4% minggu ini",
      trendUp: true
    },
    {
      title: "Total Analisis",
      value: summary?.totalAnalyses || 0,
      icon: FileSearch,
      color: "from-green-500/10 via-green-500/5 to-transparent",
      border: "border-green-500/20",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-400",
      badge: "text-white",
      trend: "+12% hari ini",
      trendUp: true
    },
    {
      title: "Masukan Pengguna",
      value: summary?.totalFeedbacks || 0,
      icon: MessageSquare,
      color: "from-teal-500/10 via-teal-500/5 to-transparent",
      border: "border-teal-500/20",
      iconBg: "bg-teal-500/10",
      iconColor: "text-teal-400",
      badge: "text-white",
      trend: "Sangat Puas",
      trendUp: true
    },
    {
      title: "Penyakit Terdaftar",
      value: summary?.totalDiseases || 0,
      icon: ShieldAlert,
      color: "from-amber-500/10 via-amber-500/5 to-transparent",
      border: "border-amber-500/20",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-400",
      badge: "text-white",
      trend: "Sesuai Standar",
      trendUp: true
    },
  ];

  return (
    <div className="flex flex-col gap-6 sm:gap-8 animate-fade-in pb-12">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
            System Live Monitor
          </p>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-none">Dashboard Admin</h1>
          <p className="text-gray-500 text-sm mt-2">
            Pantau ringkasan performa AI, ulasan pengguna, dan keaktifan database tanaman pisang.
          </p>
        </div>
        
        <button
          onClick={() => loadStats(true)}
          disabled={refreshing}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-[0.97]"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
          <span>{refreshing ? 'Memperbarui...' : 'Perbarui Data'}</span>
        </button>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cardItems.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className={`relative overflow-hidden bg-gradient-to-br ${c.color} border ${c.border} rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-500/30 transition-all duration-300 group`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{c.title}</p>
                  <p className="text-3xl font-extrabold text-white mt-1.5 tracking-tight">{c.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-5 h-5 ${c.iconColor}`} />
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-2 pt-3 border-t border-white/5 text-[11px] font-semibold text-gray-500">
                {c.trendUp ? (
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />
                )}
                <span className={c.trendUp ? "text-emerald-400/80" : "text-red-400/80"}>{c.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">

        {/* Left: Distribution + Feedbacks */}
        <div className="lg:col-span-7 flex flex-col gap-6 sm:gap-8">

          {/* Disease Distribution */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 sm:p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h2 className="text-base font-bold text-white">Distribusi Penyakit Terdeteksi</h2>
              </div>
              <span className="text-[10px] bg-white/5 border border-white/8 text-gray-400 px-2.5 py-1 rounded-lg font-semibold">
                Berdasarkan Total Deteksi
              </span>
            </div>
            
            {Object.keys(diseaseDistribution).length === 0 ? (
              <p className="text-gray-600 text-sm py-8 text-center">Belum ada data analisis yang tercatat.</p>
            ) : (
              <div className="flex flex-col gap-5">
                {Object.entries(diseaseDistribution).map(([disease, count]) => {
                  const percentage = summary?.totalAnalyses > 0 ? Math.round((count / summary.totalAnalyses) * 100) : 0;
                  
                  // Dynamic styles based on disease name
                  const normalized = disease.toLowerCase();
                  let theme = {
                    bar: "from-emerald-500 to-green-400",
                    text: "text-emerald-400",
                    bg: "bg-emerald-500/10 border-emerald-500/20",
                    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                    dot: "bg-emerald-400",
                    desc: "Kondisi Sehat"
                  };
                  
                  if (normalized.includes("panama")) {
                    theme = {
                      bar: "from-rose-500 to-red-400",
                      text: "text-rose-400",
                      bg: "bg-rose-500/10 border-rose-500/20",
                      badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
                      dot: "bg-rose-400",
                      desc: "Layu Fusarium (Jamur)"
                    };
                  } else if (normalized.includes("moko")) {
                    theme = {
                      bar: "from-orange-500 to-amber-400",
                      text: "text-orange-400",
                      bg: "bg-orange-500/10 border-orange-500/20",
                      badge: "bg-orange-500/10 text-orange-400 border-orange-500/20",
                      dot: "bg-orange-400",
                      desc: "Layu Bakteri (Bakteri)"
                    };
                  } else if (normalized.includes("sigatoka")) {
                    theme = {
                      bar: "from-amber-500 to-yellow-400",
                      text: "text-amber-400",
                      bg: "bg-amber-500/10 border-amber-500/20",
                      badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                      dot: "bg-amber-400",
                      desc: "Bercak Daun Sigatoka"
                    };
                  } else if (normalized.includes("virus") || normalized.includes("mosaic")) {
                    theme = {
                      bar: "from-purple-500 to-pink-400",
                      text: "text-purple-400",
                      bg: "bg-purple-500/10 border-purple-500/20",
                      badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
                      dot: "bg-purple-400",
                      desc: "Penyakit Virus Pisang"
                    };
                  } else if (normalized.includes("pest") || normalized.includes("hama") || normalized.includes("insect")) {
                    theme = {
                      bar: "from-blue-500 to-cyan-400",
                      text: "text-blue-400",
                      bg: "bg-blue-500/10 border-blue-500/20",
                      badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                      dot: "bg-blue-400",
                      desc: "Serangan Hama Serangga"
                    };
                  }

                  return (
                    <div key={disease} className="bg-white/[0.015] border border-white/5 rounded-xl p-4 hover:bg-white/[0.03] transition-all duration-300 group">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-2 h-2 rounded-full ${theme.dot} shadow-[0_0_8px_currentColor]`} />
                          <div>
                            <span className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">{disease}</span>
                            <span className="text-[10px] text-gray-500 block leading-tight mt-0.5">{theme.desc}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-500 font-semibold">{count} Deteksi</span>
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${theme.badge}`}>
                            {percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="h-2.5 bg-white/5 rounded-full overflow-hidden p-[1px] relative">
                        <div
                          style={{ width: `${percentage}%` }}
                          className={`h-full bg-gradient-to-r ${theme.bar} rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(16,185,129,0.3)]`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* User Feedbacks */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 sm:p-6 flex-1 flex flex-col backdrop-blur-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <h2 className="text-base font-bold text-white">Masukan & Ulasan Pengguna</h2>
              </div>
              <span className="text-[10px] bg-white/5 border border-white/8 text-gray-400 px-2.5 py-1 rounded-lg font-semibold">
                Terbaru
              </span>
            </div>

            {recentFeedbacks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 flex-1">
                <MessageSquare className="w-8 h-8 text-gray-700" />
                <p className="text-gray-600 text-sm">Belum ada ulasan yang diterima.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentFeedbacks.map((f, i) => (
                  <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-4 flex flex-col justify-between hover:border-white/10 transition-colors">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0 flex items-center justify-center font-bold text-emerald-400 text-xs">
                            {f.user?.name ? f.user.name.substring(0, 2).toUpperCase() : "US"}
                          </div>
                          <div className="overflow-hidden">
                            <h4 className="text-xs font-bold text-white truncate">{f.user?.name || "Pengguna Anonim"}</h4>
                            <p className="text-[9px] text-gray-600 truncate">{f.user?.email || "anonymous@mail.com"}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5 flex-shrink-0 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                          {[...Array(5)].map((_, starIndex) => (
                            <Star
                              key={starIndex}
                              className={`w-2.5 h-2.5 ${starIndex < (f.rating || 0) ? "text-amber-400 fill-amber-400" : "text-white/10"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-400 text-xs leading-relaxed italic">"{f.message}"</p>
                    </div>
                    <p className="text-[9px] text-gray-600 mt-4 pt-2.5 border-t border-white/5">
                      {new Date(f.createdAt).toLocaleDateString("id-ID", { 
                        day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" 
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Recent Analyses */}
        <div className="lg:col-span-5">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 sm:p-6 h-full flex flex-col backdrop-blur-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-emerald-400" />
                <h2 className="text-base font-bold text-white">Log Aktivitas Deteksi</h2>
              </div>
              <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-lg font-semibold">
                Live Log
              </span>
            </div>

            {recentAnalyses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3 flex-1">
                <FileSearch className="w-8 h-8 text-gray-700 animate-pulse" />
                <p className="text-gray-600 text-sm">Belum ada aktivitas analisis sistem.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3.5 flex-1">
                {recentAnalyses.map((a, i) => (
                  <div
                    key={i}
                    className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-xl p-3.5 flex items-center justify-between gap-3 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      {a.imageUrl ? (
                        <div className="relative flex-shrink-0">
                          <img
                            src={a.imageUrl}
                            alt="Deteksi"
                            className="w-12 h-12 rounded-lg object-cover border border-white/10"
                          />
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0a0f0d] rounded-full flex items-center justify-center border border-white/10">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                          </span>
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/5 flex-shrink-0 flex items-center justify-center">
                          <FileSearch className="w-5 h-5 text-gray-500" />
                        </div>
                      )}
                      
                      <div className="overflow-hidden">
                        <h4 className="text-sm font-bold text-white truncate leading-snug">{a.detectedDisease}</h4>
                        <p className="text-xs text-gray-500 truncate mt-0.5">Oleh: {a.user?.name || "Super Caps"}</p>
                        <div className="flex items-center gap-1 text-[9px] text-gray-600 mt-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {new Date(a.createdAt).toLocaleString("id-ID", {
                              day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-black px-2 py-1 rounded-lg border text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
                          {Math.round(a.confidence)}%
                        </span>
                        <span className="text-[9px] text-gray-600 font-semibold uppercase tracking-wider">Akurasi</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
