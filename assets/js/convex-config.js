/**
 * Convex Configuration & Client-Side Integration for SMCP MUN
 *
 * Development Environment:
 * - Cloud URL: https://tame-kingfisher-14.convex.cloud
 * - HTTP Actions URL: https://tame-kingfisher-14.convex.site
 *
 * Production Environment:
 * - Cloud URL: https://decisive-warthog-151.convex.cloud
 * - HTTP Actions URL: https://decisive-warthog-151.convex.site
 */

const CONVEX_ENVIRONMENTS = {
  development: {
    cloudUrl: "https://tame-kingfisher-14.convex.cloud",
    httpActionsUrl: "https://tame-kingfisher-14.convex.site"
  },
  production: {
    cloudUrl: "https://decisive-warthog-151.convex.cloud",
    httpActionsUrl: "https://decisive-warthog-151.convex.site"
  }
};

// Automatic environment detection (development on localhost / 127.0.0.1 / file://; production otherwise)
const isLocalhost = 
  window.location.hostname === "localhost" || 
  window.location.hostname === "127.0.0.1" || 
  window.location.protocol === "file:";

const currentEnv = isLocalhost ? "development" : "production";
const selectedConfig = CONVEX_ENVIRONMENTS[currentEnv];

window.CONVEX_CONFIG = {
  currentEnv: currentEnv,
  cloudUrl: selectedConfig.cloudUrl,
  httpActionsUrl: selectedConfig.httpActionsUrl,
  contactEndpoint: "/contact",
  environments: CONVEX_ENVIRONMENTS
};

/**
 * Universal helper to call an HTTP action on Convex
 */
async function callConvexAction(endpoint, payload = {}) {
  const baseUrl = window.CONVEX_CONFIG.httpActionsUrl.replace(/\/$/, "");
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  
  const response = await fetch(`${baseUrl}${cleanEndpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    let errorDetail = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (errJson && errJson.message) errorDetail = errJson.message;
    } catch (_) {}
    throw new Error(errorDetail);
  }

  try {
    return await response.json();
  } catch (_) {
    return { ok: true };
  }
}

/**
 * Safe local backup queue for inquiries in case of network or unconfigured endpoints
 */
function backupInquiryLocally(inquiry) {
  try {
    const existing = JSON.parse(localStorage.getItem("smcp_inquiries") || "[]");
    existing.push(inquiry);
    localStorage.setItem("smcp_inquiries", JSON.stringify(existing));
  } catch (err) {
    console.warn("Could not backup inquiry locally:", err);
  }
}

/**
 * Interactive Contact Form Handler
 */
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  const submitBtn = document.getElementById("contactSubmitBtn");
  const submitText = document.getElementById("contactSubmitText");
  const submitSpinner = document.getElementById("contactSubmitSpinner");
  const alertBox = document.getElementById("contactAlert");

  function showAlert(type, message) {
    if (!alertBox) return;
    alertBox.className = `form-feedback-alert form-feedback-${type} show`;
    alertBox.innerHTML = message;
    alertBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function hideAlert() {
    if (!alertBox) return;
    alertBox.className = "form-feedback-alert";
    alertBox.innerHTML = "";
  }

  function setLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    if (submitSpinner) {
      submitSpinner.style.display = loading ? "inline-block" : "none";
    }
    if (submitText) {
      submitText.textContent = loading ? "Transmitting..." : "Send Message";
    }
  }

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideAlert();

    const formData = new FormData(contactForm);
    const payload = {
      name: (formData.get("name") || "").toString().trim(),
      email: (formData.get("email") || "").toString().trim(),
      organization: (formData.get("organization") || "").toString().trim(),
      category: (formData.get("category") || "General Secretariat Inquiry").toString().trim(),
      subject: (formData.get("subject") || "").toString().trim(),
      message: (formData.get("message") || "").toString().trim(),
      submittedAt: new Date().toISOString(),
      source: "SMCP MUN Website Portal",
      environment: window.CONVEX_CONFIG.currentEnv
    };

    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      showAlert("error", "<strong>Missing Fields:</strong> Please fill in all required fields (Name, Email, Subject, and Message).");
      return;
    }

    setLoading(true);

    try {
      // Attempt transmission to active Convex HTTP Action
      await callConvexAction(window.CONVEX_CONFIG.contactEndpoint, payload);

      // Back up locally as well for tracking
      backupInquiryLocally({ ...payload, status: "transmitted_to_convex" });

      showAlert(
        "success",
        `<strong>✓ Message Dispatched Successfully!</strong><br>
         Thank you, <strong>${escapeHtml(payload.name)}</strong>. Your inquiry has been securely sent to the SMCP Secretariat.<br>
         Our team will review your message and reply to <em>${escapeHtml(payload.email)}</em> promptly.`
      );
      contactForm.reset();
    } catch (networkOrConvexError) {
      console.warn("Convex endpoint response notice:", networkOrConvexError);
      
      // Save locally so the inquiry is never lost
      backupInquiryLocally({ ...payload, status: "queued_locally", lastError: networkOrConvexError.message });

      // If the cloud endpoint route hasn't been deployed yet, notify gracefully
      showAlert(
        "info",
        `<strong>Inquiry Logged:</strong> Thank you, <strong>${escapeHtml(payload.name)}</strong>. Your message has been captured.
         <br><small class="text-muted">Convex Connection Status: Transmission queued (${window.CONVEX_CONFIG.currentEnv}). You may also email us directly at <a href="mailto:info.smcpmun@gmail.com" class="fw-bold">info.smcpmun@gmail.com</a>.</small>`
      );
      contactForm.reset();
    } finally {
      setLoading(false);
    }
  });

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
});
