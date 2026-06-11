export function register() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      // Vite: use import.meta.env.BASE_URL to respect base path, fallback to '/'
      const base =
        typeof import.meta !== "undefined" &&
        import.meta.env &&
        import.meta.env.BASE_URL
          ? import.meta.env.BASE_URL
          : "/";
      const swUrl = `${base.replace(/\/$/, "")}/service-worker.js`;

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log("Service Worker registered:", registration);

          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (!newWorker) return;
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                console.log("New content available, please refresh.");
                // Optional: Show update notification
                if (window.confirm("Update tersedia! Reload untuk update?")) {
                  window.location.reload();
                }
              }
            });
          });
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    });
  } else {
    console.log("Service Worker not supported in this browser.");
  }
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
