// firebaseClient.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

let authInstance = null;

function initFirebase() {
  if (authInstance) return authInstance;

  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  if (!config.apiKey || !config.authDomain || !config.projectId || !config.appId) {
    throw new Error(
      "Firebase configuration is required. Set VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, and VITE_FIREBASE_APP_ID."
    );
  }

  const app = initializeApp(config);
  authInstance = getAuth(app);
  return authInstance;
}

export function getFirebaseAuth() {
  return initFirebase();
}

/**
 * Login dengan Google menggunakan popup.
 * Bekerja untuk desktop dan mobile modern.
 * Tidak ada redirect, tidak ada reload halaman, tidak ada masalah splash screen.
 */
export async function loginWithGooglePopup() {
  const auth = initFirebase();
  const provider = new GoogleAuthProvider();

  // Tambahkan hint locale dan selalu tampilkan dialog pilih akun
  provider.setCustomParameters({ prompt: "select_account" });

  try {
    console.log("🪟 Opening Google Sign-In popup...");
    const result = await signInWithPopup(auth, provider);

    if (!result || !result.user) {
      throw new Error("Gagal mendapatkan data user dari Google");
    }

    const idToken = await result.user.getIdToken();
    console.log("✅ Google Sign-In berhasil:", result.user.email);
    return idToken;
  } catch (err) {
    console.error("Google Sign-In error:", err.code, err.message);

    switch (err.code) {
      case "auth/popup-blocked":
        throw new Error(
          "Popup diblokir browser. Pastikan popup diizinkan untuk situs ini, lalu coba lagi."
        );
      case "auth/popup-closed-by-user":
      case "auth/cancelled-popup-request":
        // User menutup popup sendiri — bukan error
        throw new Error("__CANCELLED__");
      case "auth/network-request-failed":
        throw new Error("Koneksi internet bermasalah. Periksa koneksi lalu coba lagi.");
      case "auth/internal-error":
      case "auth/operation-not-supported-in-this-environment":
        throw new Error(
          "Browser tidak mendukung popup login. Coba gunakan Chrome atau Safari versi terbaru."
        );
      default:
        throw new Error(err.message || "Login Google gagal. Coba lagi.");
    }
  }
}
