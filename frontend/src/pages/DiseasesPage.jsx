import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle,
  Droplet,
  Sun,
  Wind,
  Trash2,
  Bug,
  Shield,
} from "lucide-react";
import { getDiseases } from "../hooks/data";
import LoadingSpinner from "../components/LoadingSpinner";

export default function DiseasesPage() {
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("diseases");
  const [diseasesData, setDiseasesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const careGuidelines = [
    {
      icon: Droplet,
      title: "Penyiraman",
      description: "Air adalah kunci untuk pisang yang sehat",
      details: [
        "Berikan air 40-60mm per minggu",
        "Penyiraman lebih sering saat musim kering",
        "Pastikan drainase yang baik untuk mencegah akar busuk",
        "Hindari genangan air di sekitar tanaman",
      ],
    },
    {
      icon: Sun,
      title: "Pencahayaan",
      description: "Pisang membutuhkan sinar matahari langsung",
      details: [
        "Butuh minimal 6-8 jam sinar matahari setiap hari",
        "Temperatur ideal: 25-30°C",
        "Hindari suhu di bawah 15°C untuk pisang tropis",
        "Kelembaban 50-70% optimal",
      ],
    },
    {
      icon: Wind,
      title: "Perlindungan Angin",
      description: "Angin kuat dapat merusak tanaman",
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
      details: [
        "Pupuk NPK (14:7:28) setiap 1-2 bulan",
        "Tambahkan pupuk organik (kompos) 2 ton/hektar/tahun",
        "Vitamin B dan mikro-mineral penting",
        "Mulsa gelang (0.5-1 meter) untuk retensi nutrisi",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Katalog Pisang
          </h1>
          <p className="text-gray-600">
            Pelajari tentang penyakit pisang dan cara merawat pisang yang baik
            dan benar
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("diseases")}
            className={`px-4 py-3 font-semibold transition-all ${
              activeTab === "diseases"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Penyakit Pisang
          </button>
          <button
            onClick={() => setActiveTab("care")}
            className={`px-4 py-3 font-semibold transition-all ${
              activeTab === "care"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Cara Merawat
          </button>
        </div>

        {/* Diseases Tab */}
        {activeTab === "diseases" && (
          <div>
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">
                    Deteksi Dini Penting
                  </h3>
                  <p className="text-sm text-blue-800">
                    Deteksi dini penyakit pisang sangat penting untuk mencegah
                    penyebaran. Gunakan aplikasi analisis kami untuk
                    mengidentifikasi penyakit sejak dini.
                  </p>
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
            ) : diseasesData.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-12 text-center text-gray-500">
                Belum ada data penyakit yang tersedia.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {diseasesData.map((disease) => (
                  <div
                    key={disease.id}
                    onClick={() => setSelected(disease)}
                    className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${
                        disease.category === "Jamur"
                          ? "bg-orange-100 text-orange-700"
                          : disease.category === "Bakteri"
                            ? "bg-red-100 text-red-700"
                            : disease.category === "Virus"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-green-100 text-green-700"
                      }`}
                    >
                      {disease.category}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {disease.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {disease.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          disease.severity === "Berat"
                            ? "bg-red-100 text-red-700"
                            : disease.severity === "Sedang"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {disease.severity}
                      </span>
                      <button className="text-green-600 font-semibold text-sm hover:underline">
                        Pelajari →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Care Tab */}
        {activeTab === "care" && (
          <div>
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">
                    Panduan Lengkap Merawat Pisang
                  </h3>
                  <p className="text-sm text-green-800">
                    Ikuti panduan berikut untuk memastikan pisang Anda tumbuh
                    sehat dan produktif sepanjang tahun.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {careGuidelines.map((guideline, idx) => {
                const Icon = guideline.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Icon className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {guideline.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {guideline.description}
                    </p>
                    <ul className="space-y-2">
                      {guideline.details.map((detail, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-gray-700"
                        >
                          <span className="text-green-600 font-bold">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Additional Tips */}
            <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                💡 Tips Tambahan untuk Hasil Maksimal
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <span className="text-xl">📌</span>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      Tanam Musiman
                    </h4>
                    <p className="text-sm text-gray-700">
                      Musim hujan (Mei-Oktober) adalah waktu terbaik untuk
                      penanaman pisang.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-xl">⏰</span>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      Panen Tepat Waktu
                    </h4>
                    <p className="text-sm text-gray-700">
                      Panen 85-90 hari setelah bunga mekar untuk hasil terbaik.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-xl">👥</span>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      Konsultasi Ahli
                    </h4>
                    <p className="text-sm text-gray-700">
                      Hubungi dinas pertanian setempat untuk bantuan spesifik
                      wilayah Anda.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-xl">📊</span>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      Monitor Rutin
                    </h4>
                    <p className="text-sm text-gray-700">
                      Periksa tanaman setiap hari untuk mendeteksi masalah sejak
                      dini.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Disease Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelected(null)}
              className="float-right text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>

            <div
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${
                selected.category === "Jamur"
                  ? "bg-orange-100 text-orange-700"
                  : selected.category === "Bakteri"
                    ? "bg-red-100 text-red-700"
                    : selected.category === "Virus"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-green-100 text-green-700"
              }`}
            >
              {selected.category}
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {selected.name}
            </h2>
            <p className="text-gray-600 mb-6">{selected.description}</p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  Gejala
                </h3>
                <ul className="space-y-2">
                  {selected.symptoms.map((symptom, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-gray-700"
                    >
                      <span className="text-orange-600 font-bold mt-1">✓</span>
                      {symptom}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Pencegahan
                </h3>
                <ul className="space-y-2">
                  {selected.prevention.map((prevent, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-gray-700"
                    >
                      <span className="text-blue-600 font-bold mt-1">•</span>
                      {prevent}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Pengobatan
              </h3>
              <ul className="space-y-2">
                {selected.treatment.map((treat, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <span className="text-green-600 font-bold mt-1">→</span>
                    {treat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
