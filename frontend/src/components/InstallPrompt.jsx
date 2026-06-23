import React, { useState, useEffect, useRef } from "react";
import { Download, X, Smartphone, Zap, WifiOff } from "lucide-react";

const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);
  const promptTimerRef = useRef(null);

  useEffect(() => {
    // Bersihkan key lama dari localStorage (versi sebelumnya pakai localStorage)
    localStorage.removeItem("installPromptDismissed");

    const matchedMobile =
      /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(
        navigator.userAgent,
      );
    setIsMobile(matchedMobile);

    if (!matchedMobile) return;

    // Jika sudah berjalan sebagai PWA standalone, jangan tampilkan
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    if (isStandalone) return;

    // Jika sudah install permanen, jangan tampilkan
    if (localStorage.getItem("installPromptInstalled")) return;

    // Cek apakah sudah dismiss di sesi ini
    if (sessionStorage.getItem("installPromptDismissed")) return;

    // ── Ambil event yang sudah ditangkap lebih awal di index.html ──
    // Ini menghindari race condition jika event tembak sebelum React mount
    const checkAndShow = () => {
      const earlyEvent = window.__deferredInstallPrompt;
      if (earlyEvent) {
        console.log("[PWA] Using early-captured deferredPrompt");
        setDeferredPrompt(earlyEvent);
        promptTimerRef.current = window.setTimeout(() => {
          setShowPrompt(true);
        }, 1500);
        return true;
      }
      return false;
    };

    // Coba ambil event yang sudah tersimpan
    if (checkAndShow()) {
      // Tetap pasang listener untuk event yang mungkin belum tembak
    }

    // ── Listener untuk event yang belum tembak saat mount ──
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      window.__deferredInstallPrompt = e;
      console.log("[PWA] beforeinstallprompt fired after mount");
      setDeferredPrompt(e);
      // Batalkan timer sebelumnya jika ada
      if (promptTimerRef.current) clearTimeout(promptTimerRef.current);
      promptTimerRef.current = window.setTimeout(() => {
        setShowPrompt(true);
      }, 1500);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // ── Fallback untuk iOS dan browser yang tidak support event ──
    // Hanya tampilkan jika setelah 4 detik belum ada deferredPrompt
    const fallbackTimer = window.setTimeout(() => {
      if (!window.__deferredInstallPrompt) {
        console.log("[PWA] Fallback prompt (no deferredPrompt available)");
        setShowPrompt(true);
      }
    }, 4000);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      if (promptTimerRef.current) clearTimeout(promptTimerRef.current);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const handleInstall = async () => {
    // Selalu ambil dari window juga, karena state mungkin stale
    const prompt = deferredPrompt || window.__deferredInstallPrompt;

    if (prompt) {
      try {
        prompt.prompt();
        const { outcome } = await prompt.userChoice;
        console.log("[PWA] Install outcome:", outcome);
        if (outcome === "accepted") {
          // Tandai sudah install agar tidak muncul lagi
          localStorage.setItem("installPromptInstalled", "1");
          window.__deferredInstallPrompt = null;
          handleClose(true);
          return;
        }
      } catch (err) {
        console.error("[PWA] prompt() error:", err);
      }
    }
    handleClose();
  };

  const handleClose = (permanent = false) => {
    setAnimateOut(true);
    setTimeout(() => {
      setShowPrompt(false);
      setAnimateOut(false);
    }, 300);
    sessionStorage.setItem("installPromptDismissed", "1");
    if (permanent) {
      localStorage.setItem("installPromptInstalled", "1");
    }
  };

  // Sudah install permanen — tidak perlu render
  if (
    typeof window !== "undefined" &&
    localStorage.getItem("installPromptInstalled")
  ) {
    return null;
  }

  if (!showPrompt || !isMobile) return null;

  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  // Cek apakah ada prompt yang bisa digunakan
  const hasNativePrompt = !!(deferredPrompt || window.__deferredInstallPrompt);

  return (
    <div
      className={`fixed bottom-20 left-3 right-3 z-[9999] transition-all duration-300 ${
        animateOut ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
      }`}
      style={{ maxWidth: "420px", margin: "0 auto" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Green accent top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500" />

        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-md flex-shrink-0 overflow-hidden">
                <img
                  src="./bananavision.png"
                  alt="BananaVision"
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML =
                      '<span style="font-size:24px">🍌</span>';
                  }}
                />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm leading-tight">
                  Install BananaVision
                </h3>
                <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                  Aplikasi AI Deteksi Penyakit Pisang
                </p>
              </div>
            </div>
            <button
              onClick={() => handleClose()}
              className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0 mt-0.5"
              aria-label="Tutup"
            >
              <X className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>

          {/* Benefits */}
          <div className="flex gap-2 mb-4">
            {[
              { icon: Zap, text: "Akses Cepat" },
              { icon: WifiOff, text: "Mode Offline" },
              { icon: Smartphone, text: "Seperti Native" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex-1 flex flex-col items-center gap-1 bg-gray-50 rounded-xl py-2 px-1"
              >
                <Icon className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-semibold text-gray-600 text-center leading-tight">
                  {text}
                </span>
              </div>
            ))}
          </div>

          {/* iOS manual instruction */}
          {isIOS && !hasNativePrompt ? (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-3">
              <p className="text-xs text-blue-700 leading-relaxed">
                Ketuk{" "}
                <span className="font-bold inline-flex items-center gap-0.5">
                  <svg
                    className="w-3.5 h-3.5 inline"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2L8 6h3v8h2V6h3L12 2zm-7 14v2a2 2 0 002 2h10a2 2 0 002-2v-2h-2v2H7v-2H5z" />
                  </svg>
                  Bagikan
                </span>{" "}
                lalu pilih{" "}
                <span className="font-bold">"Add to Home Screen"</span> untuk
                menginstall BananaVision.
              </p>
            </div>
          ) : null}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {hasNativePrompt ? (
              <>
                <button
                  onClick={handleInstall}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 active:scale-[0.97] transition-all shadow-sm shadow-green-500/30"
                >
                  <Download className="w-4 h-4" />
                  Install Sekarang
                </button>
                <button
                  onClick={() => handleClose()}
                  className="px-4 py-2.5 text-gray-500 text-sm font-medium hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Nanti
                </button>
              </>
            ) : isIOS ? (
              <button
                onClick={() => handleClose()}
                className="w-full py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Mengerti
              </button>
            ) : (
              <button
                onClick={() => handleClose()}
                className="w-full py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Oke
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
