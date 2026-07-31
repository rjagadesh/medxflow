// Lightweight, dependency-free traffic beacon. Fires once per page load and
// sends anonymous visit context to the `track` Netlify Function, which enriches
// it server-side with IP + geolocation (from Netlify) and stores it in Blobs.
const VID_KEY = "eirim_vid";

export function track() {
  try {
    let vid = localStorage.getItem(VID_KEY);
    const isNew = !vid;
    if (!vid) {
      vid =
        globalThis.crypto?.randomUUID?.() ||
        `v-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem(VID_KEY, vid);
    }

    const params = new URLSearchParams(window.location.search);
    const utm = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((k) => {
      const v = params.get(k);
      if (v) utm[k.replace("utm_", "")] = v;
    });
    const gclid = params.get("gclid") || params.get("fbclid") || null;

    // Generate the event id client-side so the confirmation beacon can flip
    // beacon_confirmed on THIS exact event.
    const eventId =
      globalThis.crypto?.randomUUID?.() ||
      `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const payload = {
      eventId,
      visitorId: vid,
      newVisitor: isNew,
      path: window.location.pathname,
      referrer: document.referrer || null,
      utm,
      adClickId: gclid,
      language: navigator.language || null,
      screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
      title: document.title || null,
    };

    const post = (url, obj) => {
      const body = JSON.stringify(obj);
      if (navigator.sendBeacon) {
        navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
      } else {
        fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
      }
    };

    post("/.netlify/functions/track", payload);

    // Confirmation beacon: fires ~2s after load and marks the event human-real.
    // If the visitor leaves first, we CANCEL it so beacon_confirmed stays NULL
    // (unknown) - we never record a false for someone who simply left early.
    let confirmed = false;
    const timer = setTimeout(() => {
      confirmed = true;
      post("/.netlify/functions/beacon", { id: eventId });
    }, 2000);
    const cancel = () => {
      if (!confirmed) clearTimeout(timer);
      window.removeEventListener("pagehide", cancel);
      document.removeEventListener("visibilitychange", onHide);
    };
    const onHide = () => { if (document.visibilityState === "hidden") cancel(); };
    window.addEventListener("pagehide", cancel);
    document.addEventListener("visibilitychange", onHide);
  } catch {
    /* never let analytics break the page */
  }
}
