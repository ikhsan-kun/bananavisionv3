import React, { useState, useEffect } from "react";
import { Search, Filter, Clock, ChevronRight, AlertCircle } from "lucide-react";
import { getAnalyses } from "../hooks/data";
import { getToken } from "../utils/token";
import LoadingSpinner from "../components/LoadingSpinner";

export default function HistoryPage({ setCurrentPage }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const token = getToken();
        if (!token) {
          setError("Silakan login terlebih dahulu");
          setLoading(false);
          return;
        }
        const data = await getAnalyses(token, { limit: 50 });
        setHistoryData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch history:", err);
        setError("Gagal memuat riwayat analisis");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatus = (disease) => {
    const isHealthy =
      disease?.toLowerCase() === "healthy" ||
      disease?.toLowerCase() === "sehat" ||
      disease?.toLowerCase() === "healthy leaf";
    return isHealthy ? "healthy" : "warning";
  };

  const filtered = historyData.filter((item) => {
    const matchesQuery = item.detectedDisease
      ?.toLowerCase()
      .includes(query.toLowerCase());
    
    const status = getStatus(item.detectedDisease);
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "recent"
        ? true
        : status === filter;
    return matchesQuery && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Riwayat Analisis
          </h1>
          <p className="text-gray-600">
            Semua hasil deteksi Anda disimpan di sini
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Cari riwayat, penyakit, atau tanggal..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                aria-label="Cari riwayat"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 bg-white"
                aria-label="Filter riwayat"
              >
                <option value="all">Semua</option>
                <option value="healthy">Sehat</option>
                <option value="warning">Perlu Perhatian</option>
              </select>

              <button className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-200 hover:bg-gray-50 transition">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
             <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-xl flex items-center gap-3">
             <AlertCircle className="w-6 h-6" />
             <p>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-gray-500 mb-4">
              Belum ada hasil yang cocok.
            </div>
            <div className="text-sm text-gray-600 mb-6">
              Coba ubah kata kunci atau lakukan analisis baru.
            </div>
            <div>
              <button
                onClick={() => setCurrentPage && setCurrentPage("analyze")}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 transition-transform"
              >
                Analisis Sekarang
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-2xl transition"
              >
                <div className="aspect-video overflow-hidden bg-gray-100 flex items-center justify-center">
                  {item.imageUrl ? (
                     <img
                       src={item.imageUrl}
                       alt={item.detectedDisease}
                       className="w-full h-full object-cover"
                     />
                  ) : (
                     <div className={`w-full h-full flex flex-col items-center justify-center gap-2 ${
                       getStatus(item.detectedDisease) === "healthy"
                         ? "bg-green-50"
                         : "bg-red-50"
                     }`}>
                       <span className="text-4xl">{getStatus(item.detectedDisease) === "healthy" ? "🍃" : "🍂"}</span>
                       <span className="text-xs text-gray-500 font-medium">{item.detectedDisease}</span>
                     </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {item.detectedDisease}
                      </h3>
                      <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {formatTime(item.createdAt)}
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        getStatus(item.detectedDisease) === "healthy"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.confidence.toFixed(0)}%
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                    {item.notes ? item.notes : "Ringkasan hasil analisis singkat. Klik untuk melihat detail dan rekomendasi."}
                  </p>

                  <div className="mt-4 flex items-center gap-2">
                    <div
                      className="px-3 py-2 rounded-lg border border-gray-100 text-sm text-gray-500 cursor-default"
                    >
                      {item.status === "failed" ? "Analisis Gagal" : `Confidence: ${item.confidence?.toFixed(0)}%`}
                    </div>
                    <button
                      onClick={() =>
                        setCurrentPage && setCurrentPage("analyze")
                      }
                      className="ml-auto inline-flex items-center gap-2 text-green-600 font-semibold"
                    >
                      Analisis Ulang <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="py-12" />
      </div>
    </div>
  );
}
