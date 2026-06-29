import { useState, useEffect } from "react";
import { getAdminStats, getUploadUrl } from "../../hooks/data";
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
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
            System Live Monitor
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none">Dashboard Admin</h1>
          <p className="text-gray-500 text-sm mt-2 max-w-lg">
            Pantau ringkasan performa AI, ulasan pengguna, dan keaktifan database tanaman pisang.
          </p>
        </div>
        
        <button
          onClick={() => loadStats(true)}
          disabled={refreshing}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-[0.97] shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
          <span>{refreshing ? 'Memperbarui...' : 'Perbarui Data'}</span>
        </button>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {cardItems.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className={`relative overflow-hidden bg-gradient-to-br ${c.color} border ${c.border} rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 group cursor-default`}
            >
              {/* Subtle glow */}
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-emerald-500/5 blur-2xl group-hover:bg-emerald-500/10 transition-all" />
              
              <div className="flex justify-between items-start mb-5">
                <div className={`w-11 h-11 rounded-xl ${c.iconBg} border ${c.border} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-5 h-5 ${c.iconColor}`} />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-semibold">
                  {c.trendUp ? (
                    <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-red-400" />
                  )}
                  <span className={c.trendUp ? "text-emerald-400/80" : "text-red-400/80"}>{c.trend}</span>
                </div>
              </div>
              <div>
                <p className={`text-3xl font-black tracking-tight ${c.iconColor} mb-1`}>{c.value}</p>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{c.title}</p>
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
          <div className="bg-gradient-to-br from-white/[0.025] to-white/[0.01] border border-white/[0.07] rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-xl shadow-black/20">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500/15 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Distribusi Penyakit Terdeteksi</h2>
                  <p className="text-[10px] text-gray-600">Berdasarkan total deteksi</p>
                </div>
              </div>
            </div>
            
            {Object.keys(diseaseDistribution).length === 0 ? (
              <div className="flex flex-col items-center py-12 gap-2">
                <TrendingUp className="w-8 h-8 text-gray-700" />
                <p className="text-gray-600 text-sm">Belum ada data analisis yang tercatat.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3.5">
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
                    <div key={disease}>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${theme.dot}`} />
                          <span className="font-semibold text-white text-xs">{disease}</span>
                          <span className="text-[9px] text-gray-600 hidden sm:inline">• {theme.desc}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[10px] text-gray-500">{count}×</span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${theme.badge}`}>
                            {percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                        <div
                          style={{ width: `${percentage}%` }}
                          className={`h-full bg-gradient-to-r ${theme.bar} rounded-full transition-all duration-1000`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* User Feedbacks */}
          <div className="bg-gradient-to-br from-white/[0.025] to-white/[0.01] border border-white/[0.07] rounded-2xl p-5 sm:p-6 flex-1 flex flex-col backdrop-blur-sm shadow-xl shadow-black/20">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/15 border border-blue-500/20 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Masukan &amp; Ulasan Pengguna</h2>
                  <p className="text-[10px] text-gray-600">Terbaru</p>
                </div>
              </div>
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
          <div className="bg-gradient-to-br from-white/[0.025] to-white/[0.01] border border-white/[0.07] rounded-2xl p-5 sm:p-6 h-full flex flex-col backdrop-blur-sm shadow-xl shadow-black/20">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500/15 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Layers className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Log Aktivitas Deteksi</h2>
                  <p className="text-[10px] text-gray-600">Real-time</p>
                </div>
              </div>
              <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-1 rounded-lg font-black flex items-center gap-1">
                <span className="w-1 h-1 bg-emerald-400 rounded-full animate-ping" />
                LIVE
              </span>
            </div>

            {recentAnalyses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3 flex-1">
                <FileSearch className="w-8 h-8 text-gray-700 animate-pulse" />
                <p className="text-gray-600 text-sm">Belum ada aktivitas analisis sistem.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 flex-1">
                {recentAnalyses.map((a, i) => {
                  const confidence = Math.round(a.confidence);
                  const confColor = confidence >= 85
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                    : confidence >= 70
                    ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                    : "text-red-400 bg-red-500/10 border-red-500/20";

                  return (
                    <div
                      key={i}
                      className="bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] hover:border-white/[0.10] rounded-xl p-3.5 flex items-center justify-between gap-3 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        {a.imageUrl ? (
                          <div className="relative flex-shrink-0">
                            <img
                              src={getUploadUrl(a.imageUrl)}
                              alt="Deteksi"
                              className="w-11 h-11 rounded-xl object-cover border border-white/10"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                            <div
                              className="w-11 h-11 rounded-xl bg-white/5 border border-white/5 flex-shrink-0 items-center justify-center hidden"
                            >
                              <FileSearch className="w-4 h-4 text-gray-600" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/5 flex-shrink-0 flex items-center justify-center">
                            <FileSearch className="w-4.5 h-4.5 text-gray-600" />
                          </div>
                        )}
                        
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-bold text-white truncate group-hover:text-emerald-400 transition-colors">{a.detectedDisease}</h4>
                          <p className="text-[10px] text-gray-500 truncate mt-0.5">{a.user?.name || "Unknown User"}</p>
                          <div className="flex items-center gap-1 text-[9px] text-gray-700 mt-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            <span>
                              {new Date(a.createdAt).toLocaleString("id-ID", {
                                day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${confColor}`}>
                          {confidence}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
