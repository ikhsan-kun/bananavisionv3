import { useState } from "react";
import { loginWithGoogle } from "../hooks/data";
import LoadingSpinner from "../components/LoadingSpinner";

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

        if (!user || !token) {
          throw new Error("Data pengguna atau token tidak valid");
        }

        if (handleLogin) {
          handleLogin({ user, token });
          console.log(
            "✅ Login berhasil! Selamat datang, " + (user.name || user.email),
          );
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

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-gray-50">
      {/* Main Content: Split Layout */}
      <main className="flex flex-1 flex-col lg:flex-row min-h-screen">
        {/* Left Side: Login Form */}
        <div className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-20 lg:px-20 z-10 relative">
          <div className="w-full max-w-[420px] flex flex-col gap-8">
            {/* Welcome Text */}
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 lg:text-5xl">
                Welcome back
              </h1>
              <p className="text-gray-500 text-lg">
                Login to access your dashboard and analysis tools.
              </p>
            </div>

            {/* Login Actions */}
            <div className="flex flex-col gap-4">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-4 text-base font-medium text-gray-700 transition-all hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!loading && (
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    ></path>
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    ></path>
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    ></path>
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    ></path>
                  </svg>
                )}
                {loading ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner size="sm" color="gray" />
                    Memproses...
                  </span>
                ) : (
                  "Sign in with Google"
                )}
              </button>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <p className="text-sm text-gray-500">
                Silakan masuk dengan akun Google Anda untuk mengakses
                BananaVision.
              </p>
            </div>
          </div>

          {/* Simple Footer */}
          <div className="absolute bottom-6 w-full text-center">
            <div className="flex justify-center gap-6 text-xs text-gray-400">
              <button className="hover:text-gray-600">Privacy Policy</button>
              <button className="hover:text-gray-600">Terms of Service</button>
            </div>
          </div>
        </div>

        {/* Right Side: Visual Hero (Desktop only) */}
        <div className="hidden lg:relative lg:flex lg:flex-1 lg:items-center lg:justify-center overflow-hidden bg-gray-900">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              alt="Close up of vibrant green banana leaves"
              className="h-full w-full object-cover opacity-40"
              src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1200&h=1200&fit=crop"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
          </div>

          {/* Abstract Pattern */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage:
                "radial-gradient(#10b981 0.5px, transparent 0.5px), radial-gradient(#10b981 0.5px, #111827 0.5px)",
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 10px 10px",
              opacity: 0.1,
            }}
          ></div>

          {/* Floating Card Content */}
          <div className="relative z-10 max-w-lg px-10 text-center">
            <div className="mb-8 inline-flex items-center justify-center rounded-full bg-green-500/10 px-4 py-1.5 backdrop-blur-sm border border-green-500/20">
              <span className="mr-2 text-sm text-green-400">✓</span>
              <span className="text-sm font-medium text-green-400">
                New Model v2.4 Available
              </span>
            </div>

            <h2 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white lg:text-5xl">
              Detect. Diagnose. <br />
              <span className="text-green-400">Deliver.</span>
            </h2>

            <p className="text-lg leading-relaxed text-gray-300">
              Harness the power of our advanced computer vision algorithms to
              identify early signs of Sigatoka and Panama disease in real-time.
            </p>

            {/* Feature Grid */}
            <div className="mt-12 grid grid-cols-2 gap-4 text-left">
              <div className="rounded-xl bg-white/5 p-4 backdrop-blur-md border border-white/10 hover:border-green-500/50 transition-colors duration-300">
                <div className="mb-3 flex w-10 h-10 items-center justify-center rounded-lg bg-green-500/20 text-green-400">
                  <svg
                    className="w-5 h-5"
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
                <h3 className="text-base font-bold text-white">
                  99.8% Accuracy
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Industry leading detection rates.
                </p>
              </div>

              <div className="rounded-xl bg-white/5 p-4 backdrop-blur-md border border-white/10 hover:border-green-500/50 transition-colors duration-300">
                <div className="mb-3 flex w-10 h-10 items-center justify-center rounded-lg bg-green-500/20 text-green-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-white">Cloud Sync</h3>
                <p className="text-sm text-gray-400 mt-1">
                  Real-time data across all devices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
