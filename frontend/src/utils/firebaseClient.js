// firebaseClient.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

let authInstance = null;

function initFirebase() {
  if (authInstance) return authInstance;

  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  if (
    !config.apiKey ||
    !config.authDomain ||
    !config.projectId ||
    !config.appId
  ) {
    throw new Error(
      "Firebase configuration is required. Set VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, and VITE_FIREBASE_APP_ID.",
    );
  }

  const app = initializeApp(config);
  authInstance = getAuth(app);
  return authInstance;
}

export async function loginWithGooglePopup() {
  const auth = initFirebase();
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);

    if (!result || !result.user) {
      throw new Error("Failed to get user from Google");
    }

    const idToken = await result.user.getIdToken();
    return idToken;
  } catch (err) {
    if (err.code === "auth/popup-blocked") {
      throw new Error(
        "Popup login diblokir. Mohon izinkan popup di browser Anda.",
      );
    } else if (err.code === "auth/cancelled-popup-request") {
      throw new Error("Login dibatalkan");
    } else if (
      err.code === "auth/operation-not-supported-in-this-environment"
    ) {
      throw new Error("Popup login tidak didukung di environment ini");
    }
    throw new Error(err.message || "Google login gagal");
  }
}
