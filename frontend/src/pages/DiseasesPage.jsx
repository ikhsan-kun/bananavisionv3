import React, { useState, useEffect, useRef } from "react";
import {
  AlertCircle,
  CheckCircle,
  Droplet,
  Sun,
  Wind,
  Trash2,
  Bug,
  Shield,
  Search,
  X,
  ChevronRight,
  BookOpen,
  Leaf,
  Filter,
  Calendar,
  Clock,
  Users,
  Activity,
  Lightbulb,
} from "lucide-react";
import { getDiseases } from "../hooks/data";
import LoadingSpinner from "../components/LoadingSpinner";

const CATEGORY_CONFIG = {
  Jamur: { color: "bg-orange-100 text-orange-700 border-orange-200", dot: "bg-orange-500", gradient: "from-orange-500 to-amber-500" },
  Bakteri: { color: "bg-red-100 text-red-700 border-red-200", dot: "bg-red-500", gradient: "from-red-500 to-rose-500" },
  Virus: { color: "bg-purple-100 text-purple-700 border-purple-200", dot: "bg-purple-500", gradient: "from-purple-500 to-violet-500" },
  Hama: { color: "bg-blue-100 text-blue-700 border-blue-200", dot: "bg-blue-500", gradient: "from-blue-500 to-cyan-500" },
  Sehat: { color: "bg-green-100 text-green-700 border-green-200", dot: "bg-green-500", gradient: "from-green-500 to-emerald-500" },
};

const SEVERITY_CONFIG = {
  Berat: { color: "bg-red-100 text-red-700", bar: "bg-red-500", width: "w-full" },
  Sedang: { color: "bg-yellow-100 text-yellow-700", bar: "bg-yellow-500", width: "w-2/3" },
  Ringan: { color: "bg-green-100 text-green-700", bar: "bg-green-500", width: "w-1/3" },
};

export default function DiseasesPage() {
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("diseases");
  const [diseasesData, setDiseasesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [expandedCare, setExpandedCare] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchDiseasesData = async () => {
      try {
        setLoading(true);
        const data = await getDiseases();
        setDiseasesData(data || []);
      } catch (err) {
        console.error("Failed to fetch diseases:", err);
        setError("Gagal memuat data penyakit dari server");
      } finally {
        setLoading(false);
      }
    };
    fetchDiseasesData();
  }, []);

  // Close modal on ESC
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") setSelected(null); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const categories = ["Semua", ...Array.from(new Set(diseasesData.map((d) => d.category).filter(Boolean)))];

  const filteredDiseases = diseasesData.filter((d) => {
    const matchSearch =
      search === "" ||
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.description?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === "Semua" || d.category === activeFilter;
    return matchSearch && matchFilter;
  });

  const careGuidelines = [
    {
      icon: Droplet,
      title: "Penyiraman",
      description: "Air adalah kunci untuk pisang yang sehat",
      color: "from-blue-400 to-cyan-500",
      bgLight: "bg-blue-50",
      details: [
        "Berikan air 40–60 mm per minggu",
        "Penyiraman lebih sering saat musim kering",
        "Pastikan drainase yang baik untuk mencegah akar busuk",
        "Hindari genangan air di sekitar tanaman",
      ],
    },
    {
      icon: Sun,
      title: "Pencahayaan",
      description: "Pisang membutuhkan sinar matahari langsung",
      color: "from-yellow-400 to-orange-500",
      bgLight: "bg-yellow-50",
      details: [
        "Butuh minimal 6–8 jam sinar matahari setiap hari",
        "Temperatur ideal: 25–30°C",
        "Hindari suhu di bawah 15°C untuk pisang tropis",
        "Kelembaban 50–70% optimal",
      ],
    },
    {
      icon: Wind,
      title: "Perlindungan Angin",
      description: "Angin kuat dapat merusak tanaman",
      color: "from-teal-400 to-emerald-500",
      bgLight: "bg-teal-50",
      details: [
        "Tanam di area terlindungi dari angin kencang",
        "Gunakan windbreak atau tanaman penyangga",
        "Pisang rentan terhadap badai dan hujan es",
        "Pelapisan mulsa melindungi akar dari angin kering",
      ],
    },
    {
      icon: Bug,
      title: "Pengendalian Hama",
      description: "Lindungi dari hama dan penyakit",
      color: "from-red-400 to-rose-500",
      bgLight: "bg-red-50",
      details: [
        "Monitor rutin untuk tanda-tanda hama",
        "Gunakan perangkap kuning untuk kutu daun",
        "Aplikasi insektisida organik jika diperlukan",
        "Contoh hama: kutu daun, kumbang, ulat",
      ],
    },
    {
      icon: Trash2,
      title: "Sanitasi & Kebersihan",
      description: "Jaga kebun tetap bersih dan sehat",
      color: "from-gray-400 to-slate-500",
      bgLight: "bg-gray-50",
      details: [
        "Buang daun dan buah yang mati",
        "Sterilisasi alat sebelum digunakan",
        "Bersihkan gulma di sekitar tanaman",
        "Kurangi tumpukan sampah organik yang busuk",
      ],
    },
    {
      icon: Shield,
      title: "Pemupukan & Nutrisi",
      description: "Nutrisi seimbang untuk pertumbuhan optimal",
      color: "from-green-400 to-emerald-500",
      bgLight: "bg-green-50",
      details: [
        "Pupuk NPK (14:7:28) setiap 1–2 bulan",
        "Tambahkan pupuk organik (kompos) 2 ton/hektar/tahun",
        "Vitamin B dan mikro-mineral penting",
        "Mulsa gelang (0.5–1 meter) untuk retensi nutrisi",
      ],
    },
  ];

  const getCategoryConfig = (cat) =>
    CATEGORY_CONFIG[cat] || { color: "bg-gray-100 text-gray-700 border-gray-200", dot: "bg-gray-400", gradient: "from-gray-400 to-gray-500" };

  const getSeverityConfig = (sev) =>
    SEVERITY_CONFIG[sev] || { color: "bg-gray-100 text-gray-600", bar: "bg-gray-400", width: "w-1/4" };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-emerald-50/30 pb-24">
      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 pt-8 pb-14 px-4">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Katalog Pisang</h1>
          </div>
          <p className="text-green-100 text-sm">
            Pelajari penyakit pisang, gejala, dan cara perawatan yang tepat
          </p>
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-[64px] z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-0">
            {[
              { id: "diseases", label: "Penyakit Pisang", icon: AlertCircle },
              { id: "care", label: "Cara Merawat", icon: Leaf },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold transition-all border-b-2 ${
                    activeTab === tab.id
                      ? "text-green-700 border-green-600"
                      : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* ─── DISEASES TAB ─── */}
        {activeTab === "diseases" && (
          <div className="animate-fade-in">
            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari penyakit pisang…"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 flex-shrink-0">
                <Filter className="w-4 h-4 text-gray-400 self-center flex-shrink-0" />
                {categories.map((cat) => {
                  const catCfg = getCategoryConfig(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveFilter(cat)}
                      className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        activeFilter === cat
                          ? "bg-green-600 text-white border-green-600 shadow"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Info Banner */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl mb-5">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-sm font-semibold text-blue-900">Deteksi Dini Penting!</span>
                <p className="text-xs text-blue-700 mt-0.5">
                  Gunakan fitur Analisis AI kami untuk mengidentifikasi penyakit sejak dini dan cegah penyebaran lebih lanjut.
                </p>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <LoadingSpinner size="lg" />
                <p className="text-sm text-gray-400">Memuat data penyakit…</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Gagal Memuat Data</p>
                  <p className="text-xs mt-0.5">{error}</p>
                </div>
              </div>
            ) : filteredDiseases.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">
                  {search ? `Tidak ada hasil untuk "${search}"` : "Belum ada data penyakit"}
                </p>
                {search && (
                  <button onClick={() => { setSearch(""); setActiveFilter("Semua"); }} className="mt-3 text-sm text-green-600 font-semibold hover:underline">
                    Reset pencarian
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="text-xs text-gray-400 mb-3">
                  Menampilkan {filteredDiseases.length} penyakit
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDiseases.map((disease) => {
                    const catCfg = getCategoryConfig(disease.category);
                    const sevCfg = getSeverityConfig(disease.severity);
                    return (
                      <button
                        key={disease.id}
                        onClick={() => setSelected(disease)}
                        className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 overflow-hidden relative"
                      >
                        {/* Top color strip */}
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${catCfg.gradient} opacity-60`} />

                        <div className="flex items-start justify-between gap-2 mb-3">
                          <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold border ${catCfg.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${catCfg.dot}`} />
                            {disease.category}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-lg font-semibold ${sevCfg.color}`}>
                            {disease.severity}
                          </span>
                        </div>

                        <h3 className="font-bold text-gray-800 mb-2 leading-tight">
                          {disease.name}
                        </h3>
                        <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">
                          {disease.description}
                        </p>

                        {/* Severity Bar */}
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Tingkat Keparahan</span>
                          </div>
                          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${sevCfg.bar} ${sevCfg.width}`} />
                          </div>
                        </div>

                        <div className="flex items-center text-green-600 text-xs font-semibold group-hover:gap-1.5 gap-1 transition-all">
                          Lihat detail <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* ─── CARE TAB ─── */}
        {activeTab === "care" && (
          <div className="animate-fade-in">
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-2xl mb-6">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-sm font-semibold text-green-900">Panduan Lengkap Merawat Pisang</span>
                <p className="text-xs text-green-700 mt-0.5">
                  Ikuti panduan berikut untuk memastikan pisang Anda tumbuh sehat dan produktif.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {careGuidelines.map((guide, idx) => {
                const Icon = guide.icon;
                const isExpanded = expandedCare === idx;
                return (
                  <div
                    key={idx}
                    className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${isExpanded ? "shadow-lg" : "hover:shadow-md hover:-translate-y-0.5"}`}
                  >
                    {/* Card Header */}
                    <button
                      onClick={() => setExpandedCare(isExpanded ? null : idx)}
                      className="w-full text-left p-5 focus:outline-none"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${guide.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-gray-800 text-sm">{guide.title}</h3>
                            <ChevronRight
                              className={`w-4 h-4 text-gray-400 transition-transform duration-300 flex-shrink-0 ${isExpanded ? "rotate-90" : ""}`}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{guide.description}</p>
                        </div>
                      </div>
                    </button>

                    {/* Expandable Details */}
                    <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-96" : "max-h-0"}`}>
                      <div className={`px-5 pb-5 ${guide.bgLight} border-t border-gray-50`}>
                        <ul className="space-y-2 pt-4">
                          {guide.details.map((detail, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                              <span className={`w-4 h-4 rounded-full bg-gradient-to-br ${guide.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                <span className="text-white font-bold text-[9px]">{i + 1}</span>
                              </span>
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Seasonal Tips */}
            <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-300" /> Tips Tambahan
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Calendar, title: "Tanam Musiman", desc: "Musim hujan (Mei–Oktober) adalah waktu terbaik untuk penanaman pisang." },
                  { icon: Clock, title: "Panen Tepat Waktu", desc: "Panen 85–90 hari setelah bunga mekar untuk hasil terbaik." },
                  { icon: Users, title: "Konsultasi Ahli", desc: "Hubungi dinas pertanian setempat untuk bantuan spesifik wilayah Anda." },
                  { icon: Activity, title: "Monitor Rutin", desc: "Periksa tanaman setiap hari untuk mendeteksi masalah sejak dini." },
                ].map((tip, i) => {
                  const IconComponent = tip.icon;
                  return (
                    <div key={i} className="flex gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">{tip.title}</h4>
                        <p className="text-green-100 text-xs leading-relaxed">{tip.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Disease Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
        >
          <div
            ref={modalRef}
            className="bg-white w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            {(() => {
              const catCfg = getCategoryConfig(selected.category);
              const sevCfg = getSeverityConfig(selected.severity);
              return (
                <>
                  <div className={`flex-shrink-0 bg-gradient-to-r ${catCfg.gradient} p-6 relative`}>
                    <button
                      onClick={() => setSelected(null)}
                      className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="flex items-start gap-3 pr-10">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="text-xs bg-white/20 text-white px-2.5 py-1 rounded-full font-semibold">
                            {selected.category}
                          </span>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold bg-white/90 ${sevCfg.color}`}>
                            Keparahan: {selected.severity}
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold text-white">{selected.name}</h2>
                        <p className="text-white/80 text-sm mt-1 leading-relaxed">{selected.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Modal Body */}
                  <div className="overflow-y-auto flex-1 hide-scrollbar">
                    <div className="p-6 space-y-5">
                      {/* Symptoms & Prevention side by side */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        {/* Gejala */}
                        <div className="bg-orange-50 rounded-2xl p-4">
                          <h3 className="font-bold text-orange-900 mb-3 flex items-center gap-2 text-sm">
                            <AlertCircle className="w-4 h-4 text-orange-600" />
                            Gejala
                          </h3>
                          <ul className="space-y-2">
                            {selected.symptoms?.map((s, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-orange-800">
                                <span className="text-orange-600 font-bold mt-0.5 flex-shrink-0">✓</span>
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Pencegahan */}
                        <div className="bg-blue-50 rounded-2xl p-4">
                          <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2 text-sm">
                            <Shield className="w-4 h-4 text-blue-600" />
                            Pencegahan
                          </h3>
                          <ul className="space-y-2">
                            {selected.prevention?.map((p, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-blue-800">
                                <span className="text-blue-600 font-bold mt-0.5 flex-shrink-0">•</span>
                                {p}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Pengobatan */}
                      {selected.treatment && selected.treatment.length > 0 && (
                        <div className="bg-green-50 rounded-2xl p-4">
                          <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Pengobatan & Penanganan
                          </h3>
                          <div className="space-y-2">
                            {selected.treatment.map((t, i) => (
                              <div key={i} className="flex items-start gap-2.5">
                                <span className="w-5 h-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                                  {i + 1}
                                </span>
                                <span className="text-xs text-green-800 leading-relaxed">{t}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-4 border-t border-gray-100 flex gap-3">
                    <button
                      onClick={() => setSelected(null)}
                      className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
                    >
                      Tutup
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
