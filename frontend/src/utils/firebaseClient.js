// firebaseClient.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";

let authInstance = null;

function initFirebase() {
  if (authInstance) return authInstance;

  // Di mobile/Safari, third-party cookies diblokir.
  // Gunakan domain hosting sendiri (Vercel) sebagai authDomain jika di production.
  const isProduction = import.meta.env.PROD;
  const currentHost = window.location.hostname;
  const isIPAddress = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(currentHost);
  const isLocal =
    currentHost.includes("localhost") ||
    currentHost.includes("127.0.0.1") ||
    isIPAddress;

  const authDomain =
    isProduction && currentHost && !isLocal
      ? currentHost
      : import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;

  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: authDomain,
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

/**
 * Deteksi apakah environment ini cocok untuk popup login.
 * Popup hanya aman di localhost — di production Vercel/Railway, header
 * Cross-Origin-Opener-Policy: same-origin memutus komunikasi popup ↔ window,
 * sehingga popup tertutup sebelum auth selesai (auth/popup-closed-by-user).
 * Gunakan redirect untuk semua environment production.
 */
function shouldUseRedirect() {
  const isProduction = import.meta.env.PROD;
  if (isProduction) return true; // selalu redirect di production

  // Di localhost, cek apakah mobile (redirect lebih stabil di mobile)
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  return isMobile;
}

export async function loginWithGooglePopup() {
  const auth = initFirebase();
  const provider = new GoogleAuthProvider();

  const useRedirect = shouldUseRedirect();

  if (useRedirect) {
    console.log("🔄 Using signInWithRedirect (production or mobile)...");
    try {
      await signInWithRedirect(auth, provider);
      // Browser akan redirect — promise ini tidak pernah resolve
      return new Promise(() => {});
    } catch (err) {
      console.error("Redirect initialization failed:", err);
      throw new Error(err.message || "Google redirect login gagal");
    }
  }

  // Hanya untuk localhost desktop
  console.log("🪟 Using signInWithPopup (localhost)...");
  try {
    const result = await signInWithPopup(auth, provider);

    if (!result || !result.user) {
      throw new Error("Failed to get user from Google");
    }

    const idToken = await result.user.getIdToken();
    return idToken;
  } catch (err) {
    if (err.code === "auth/popup-blocked") {
      throw new Error("Popup login diblokir. Mohon izinkan popup di browser Anda.");
    } else if (err.code === "auth/cancelled-popup-request") {
      throw new Error("Login dibatalkan");
    } else if (err.code === "auth/popup-closed-by-user") {
      throw new Error("Login dibatalkan — popup ditutup sebelum selesai");
    } else if (err.code === "auth/operation-not-supported-in-this-environment") {
      throw new Error("Popup login tidak didukung di environment ini");
    }
    throw new Error(err.message || "Google login gagal");
  }
}

export async function getRedirectAuthResult() {
  const auth = initFirebase();
  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      const idToken = await result.user.getIdToken();
      return idToken;
    }
    return null;
  } catch (err) {
    console.error("Error in getRedirectResult:", err);
    throw err;
  }
}
