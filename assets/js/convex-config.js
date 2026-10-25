// Convex Configuration & Client Helpers
window.CONVEX_CONFIG = {
  cloudUrl: "https://decisive-parrot-0.convex.cloud",
  httpActionsUrl: "https://decisive-parrot-0.convex.site"
};

// Example helper to call an HTTP action on Convex
async function callConvexAction(endpoint, payload = {}) {
  try {
    const baseUrl = window.CONVEX_CONFIG.httpActionsUrl.replace(/\/$/, "");
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const response = await fetch(`${baseUrl}${cleanEndpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    return await response.json();
  } catch (error) {
    console.error("Convex action error:", error);
    throw error;
  }
}
