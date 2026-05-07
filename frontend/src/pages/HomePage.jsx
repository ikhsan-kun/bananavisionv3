import React from "react";
import {
  Leaf,
  Camera,
  ChevronRight,
  AlertCircle,
  TrendingUp,
  History,
  Activity,
} from "lucide-react";
import { getToken } from "../utils/token";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  const setNavigate = (page) => {
    const token = getToken();
    if (token) {
      navigate(page);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-gray-50">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="flex flex-col gap-6 max-w-2xl">
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  AI-Powered Crop Analysis
                </div>

                <h1 className="text-5xl lg:text-6xl font-black leading-tight tracking-tight text-gray-900">
                  Protect Your Crop with{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
                    AI Precision
                  </span>
                </h1>

                <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                  deteksi penyakit tanaman pisang dengan akurasi tinggi menggunakan teknologi AI terbaru. Cukup dengan foto daun yang terinfeksi, dapatkan diagnosis instan dan rekomendasi perawatan yang tepat untuk menyelamatkan panen Anda.
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    onClick={() => setNavigate("/analyze")}
                    className="btn-primary"
                  >
                    Mulai Analisis
                  </button>
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-100 shadow-2xl">
                  <img
                    src="./bananavision-hero.png"
                    alt="petani pisang"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />

                  {/* Floating UI Element */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/95 backdrop-blur shadow-lg border border-green-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Analysis Complete
                        </p>
                        <p className="text-xs text-gray-600">
                          Healthy Specimen Detected
                        </p>
                      </div>
                    </div>
                    <div className="text-green-600 font-bold text-lg">
                      99.8%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Banner */}
        <section className="border-y border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              <div className="flex flex-col items-center md:items-start px-4">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Model Accuracy
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">93% - 97%</span>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-start px-4 pt-8 md:pt-0">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                  deseases detected
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">8+</span>
                  <span className="text-sm font-medium text-gray-600">
                    Different Type
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-start px-4 pt-8 md:pt-0">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Farmer Trust
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">
                    4.9/5
                  </span>
                  <div className="flex text-yellow-400 text-sm">★★★★★</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 mb-4">
                  Mengapa Memilih BananaVision?
                </h2>
                <p className="text-lg text-gray-600">
                  BananaVision menggunakan teknologi AI terdepan untuk memberikan wawasan kesehatan tanaman yang instan dan andal, yang menghemat waktu dan sumber daya petani.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="group relative rounded-2xl bg-white p-8 shadow-sm border border-gray-100 transition-all hover:-translate-y-1 hover:shadow-xl hover:border-green-500/20">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Deteksi instan
                </h3>
                <p className="text-gray-600">
                  Dapatkan hasil dalam hitungan detik, bukan hari. Model edge-computing yang dioptimalkan memproses gambar secara instan bahkan dengan konektivitas yang rendah.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group relative rounded-2xl bg-white p-8 shadow-sm border border-gray-100 transition-all hover:-translate-y-1 hover:shadow-xl hover:border-green-500/20">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Rekomendasi Perawatan
                </h3>
                <p className="text-gray-600">
                  Tidak hanya diagnosis, tetapi juga solusi. Dapatkan rekomendasi perawatan yang disesuaikan untuk setiap penyakit, membantu Anda menyelamatkan tanaman dan mencegah penyebaran.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group relative rounded-2xl bg-white p-8 shadow-sm border border-gray-100 transition-all hover:-translate-y-1 hover:shadow-xl hover:border-green-500/20">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <History className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Pelacakan Historis
                </h3>
                <p className="text-gray-600">
                  Monitor tren kesehatan tanaman over time. Identifikasi awal
                  dengan melacak tanaman yang terkena penyakit pertanian Anda.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-white border-t border-gray-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 mb-4">
                 Langkah Mudah untuk Deteksi Penyakit Tanaman Pisang dengan BananaVision
              </h2>
              <p className="text-lg text-gray-600">
                Tidak perlu perangkat khusus. Cukup dengan smartphone Anda dan aplikasi cerdas kami.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-gray-200 via-green-500 to-gray-200 z-0"></div>

              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-white border-4 border-green-500/20 flex items-center justify-center shadow-lg mb-6">
                  <Camera className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  1. Ambil Foto Daun Pisang
                </h3>
                <p className="text-gray-600 text-sm px-4">
                  Cukup ambil foto daun pisang yang terinfeksi menggunakan kamera smartphone Anda. Pastikan pencahayaan cukup untuk hasil terbaik.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-white border-4 border-green-500/20 flex items-center justify-center shadow-lg mb-6">
                  <Activity className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  2. AI Menganalisis Gambar
                </h3>
                <p className="text-gray-600 text-sm px-4">
                  Algoritma kami menganalisis pola visual untuk mengidentifikasi
                  patogen dengan akurasi 93% - 97%.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-white border-4 border-green-500/20 flex items-center justify-center shadow-lg mb-6">
                  <svg
                    className="w-10 h-10 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  3. Dapatkan Pengobatan
                </h3>
                <p className="text-gray-600 text-sm px-4">
                  Dapatkan instruksi perawatan yang segera dan dapat diimplementasikan untuk menyelamatkan tanaman Anda dan mencegah penyebaran penyakit.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Diseases Section */}
        {/* <section className="py-20 bg-gray-50" id="diseases">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">Common Diseases Detected</h2>
              <div className="flex gap-2">
                <button className="p-2 rounded-full border border-gray-200 hover:bg-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="p-2 rounded-full border border-gray-200 hover:bg-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayDiseases.map((disease) => (
                <div
                  key={disease.id}
                  className="group overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-[4/3] w-full bg-gray-200 overflow-hidden">
                    <img
                      src={disease.image}
                      alt={disease.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="font-bold text-lg leading-tight text-gray-900">{disease.name}</h3>
                      <span className={`rounded px-2 py-0.5 text-xs font-semibold ${getSeverityStyles(disease.severityColor)}`}>
                        {disease.severity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 italic mb-3">{disease.scientificName}</p>
                    <button 
                      onClick={() => setCurrentPage ? setCurrentPage("diseases") : null}
                      className="w-full rounded bg-gray-100 py-2 text-sm font-medium hover:bg-green-500 hover:text-black transition-colors"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}
        {/* Pre-Footer CTA */}
        <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div
              style={{
                backgroundImage:
                  "radial-gradient(#10b981 0.5px, transparent 0.5px), radial-gradient(#10b981 0.5px, #111827 0.5px)",
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 10px 10px",
                height: "100%",
                width: "100%",
              }}
            ></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

          <div className="mx-auto max-w-4xl px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Siap Melindungi Tanaman Anda dengan BananaVision?
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Bergabunglah dengan BananaVision untuk mendapatkan akses instan ke teknologi deteksi penyakit tanaman pisang berbasis AI yang revolusioner.
            </p>
            <button
              onClick={() =>
                setCurrentPage ? setCurrentPage("analyze") : null
              }
              className="h-14 px-8 rounded-lg bg-green-500 text-gray-900 text-lg font-bold tracking-wide transition-transform hover:scale-105 shadow-xl shadow-green-500/20"
            >
              Analisis Sekarang
            </button>
            <p className="mt-4 text-sm text-gray-400">
              gratis untuk digunakan, tanpa biaya.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2 pr-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg font-bold text-gray-900">
                  BananaVision
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Empowering agriculture through artificial intelligence. We
                believe in sustainable farming supported by accessible
                technology.
              </p>
              <div className="flex gap-4">
                <button className="text-gray-400 hover:text-green-500 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-green-500 transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <button className="hover:text-green-500 transition-colors">
                    Features
                  </button>
                </li>
                <li>
                  <button className="hover:text-green-500 transition-colors">
                    Pricing
                  </button>
                </li>
                <li>
                  <button className="hover:text-green-500 transition-colors">
                    API
                  </button>
                </li>
                <li>
                  <button className="hover:text-green-500 transition-colors">
                    Success Stories
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <button className="hover:text-green-500 transition-colors">
                    Documentation
                  </button>
                </li>
                <li>
                  <button className="hover:text-green-500 transition-colors">
                    Blog
                  </button>
                </li>
                <li>
                  <button className="hover:text-green-500 transition-colors">
                    Community
                  </button>
                </li>
                <li>
                  <button className="hover:text-green-500 transition-colors">
                    Help Center
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <button className="hover:text-green-500 transition-colors">
                    About Us
                  </button>
                </li>
                <li>
                  <button className="hover:text-green-500 transition-colors">
                    Careers
                  </button>
                </li>
                <li>
                  <button className="hover:text-green-500 transition-colors">
                    Legal
                  </button>
                </li>
                <li>
                  <button className="hover:text-green-500 transition-colors">
                    Contact
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2023 BananaVision Inc. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <button className="hover:text-gray-900 transition-colors">
                Privacy Policy
              </button>
              <button className="hover:text-gray-900 transition-colors">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
