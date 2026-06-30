import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { ToastProvider } from "./hooks/useToast.jsx";

const originalFetch = window.fetch;
window.fetch = async (...args) => {
  try {
    const response = await originalFetch(...args);
    if (response.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath.startsWith("/admin")) {
        localStorage.removeItem("adminToken");
        if (currentPath !== "/admin/login") {
          window.location.href = "/admin/login?expired=true";
        }
      } else {
        localStorage.removeItem("authToken");
        if (currentPath !== "/login") {
          window.location.href = "/login?expired=true";
        }
      }
    }
    return response;
  } catch (error) {
    throw error;
  }
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>
);

serviceWorkerRegistration.register();
