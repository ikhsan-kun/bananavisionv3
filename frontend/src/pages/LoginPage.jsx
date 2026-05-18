import { useState } from "react";
import { loginWithGoogle } from "../hooks/data";
import LoadingSpinner from "../components/LoadingSpinner";
import { Leaf, ShieldCheck, Zap, Database } from "lucide-react";

export default function LoginPage({ handleLogin }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      if (loginWithGoogle) {
        const result = await loginWithGoogle();
        const { user, token } = result;
        if (!user || !token) throw new Error("Data pengguna atau token tidak valid");
        if (handleLogin) {
          handleLogin({ user, token });
          console.log("✅ Login berhasil! Selamat datang, " + (user.name || user.email));
        } else {
          setError("Fungsi login tidak tersedia");
          setLoading(false);
        }
      } else {
        setError("Fungsi login Google belum tersedia");
        setLoading(false);
      }
    } catch (err) {
      console.error("❌ Login error details:", err);
      setError(err.message || "Login gagal, silakan coba lagi");
      setLoading(false);
    }
  };

  const features = [
    { icon: Zap, title: "Deteksi Cepat", desc: "Hasil analisis dalam hitungan detik" },
    { icon: ShieldCheck, title: "Akurasi Tinggi", desc: "Model AI terlatih khusus pisang" },
    { icon: Database, title: "Riwayat Tersimpan", desc: "Semua analisis disimpan otomatis" },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">

      {/* ── Left: Form ── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-16 lg:px-16 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(#10b981 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

        <div className="relative w-full max-w-sm flex flex-col gap-8 animate-fade-in">
          {/* Logo */}

          {/* Welcome */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Selamat Datang, di BananaVision</h2>
            <p className="text-gray-500 mt-2 text-sm leading-relaxed">
              Masuk untuk mengakses dashboard analisis dan riwayat deteksi Anda.
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col gap-4">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" color="gray" />
                  <span>Memproses login…</span>
                </>
              ) : (
                <>
                  <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span>Masuk dengan Google</span>
                </>
              )}
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                <span className="mt-0.5 flex-shrink-0"></span>
                <span>{error}</span>
              </div>
            )}

            <p className="text-center text-xs text-gray-400">
              Dengan masuk, Anda menyetujui{" "}
              <button className="text-green-600 hover:underline font-medium">Kebijakan Privasi</button>
              {" "}dan{" "}
              <button className="text-green-600 hover:underline font-medium">Syarat Penggunaan</button>.
            </p>
          </div>

          {/* Features list */}
          <div className="flex flex-col gap-3">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{f.title}</p>
                    <p className="text-xs text-gray-400">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Right: Visual (Desktop only) ── */}
      <div className="hidden lg:relative lg:flex lg:w-[55%] overflow-hidden bg-gray-900">
        {/* Background image */}
        <div className="absolute inset-0">
          <img alt="Daun pisang hijau segar" className="h-full w-full object-cover opacity-40" src="./bananavision-hero.png" />
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-gray-900/70 to-gray-900" />
        </div>

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(#10b981 0.5px, transparent 0.5px), radial-gradient(#10b981 0.5px, #111827 0.5px)", backgroundSize: "20px 20px", backgroundPosition: "0 0, 10px 10px" }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-14 py-12 w-full">
          <div className="mb-5 inline-flex items-center gap-2 bg-green-500/15 px-4 py-1.5 rounded-full border border-green-500/30 w-fit">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-green-400 font-semibold">Sistem aktif & siap digunakan</span>
          </div>

          <h2 className="text-5xl font-extrabold text-white leading-tight tracking-tight mb-5">
            Deteksi.<br />
            Diagnosa.<br />
            <span className="text-green-400">Selamatkan.</span>
          </h2>

          <p className="text-gray-300 text-base leading-relaxed max-w-sm">
            Gunakan kecerdasan buatan untuk mendeteksi penyakit daun pisang lebih awal — sebelum menyebar ke seluruh kebun.
          </p>

          {/* Stats row */}
          <div className="mt-10 flex gap-8">
            {[
              { val: "98%", label: "Akurasi Model" },
              { val: "< 3s", label: "Waktu Analisis" },
              { val: "6+", label: "Jenis Penyakit" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-extrabold text-white">{s.val}</p>
                <p className="text-xs text-gray-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Feature cards */}
          <div className="mt-10 grid grid-cols-2 gap-3">
            {[
              { icon: "", title: "Model AI Terdedikasi", desc: "Dilatih khusus untuk tanaman pisang" },
              { icon: "", title: "Cloud Sync", desc: "Data tersinkron di semua perangkat" },
              { icon: "", title: "Dashboard Analitik", desc: "Pantau tren kesehatan tanaman" },
              { icon: "", title: "Kamera Langsung", desc: "Scan daun secara real-time" },
            ].map((c, i) => (
              <div key={i} className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-500/40 rounded-xl p-4 transition-all duration-300">
                <span className="text-xl">{c.icon}</span>
                <h3 className="text-sm font-bold text-white mt-2">{c.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
