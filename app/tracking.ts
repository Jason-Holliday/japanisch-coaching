// Einwilligung, Meta-Pixel und UTM-Parameter.
//
// Der Meta-Pixel wird erst nach Zustimmung im Cookie-Hinweis nachgeladen.
// Vorher gibt es keine Verbindung zu Meta. Die Pixel-ID kommt aus
// NEXT_PUBLIC_META_PIXEL_ID (siehe .env.example). Cookie-Hinweis und
// Footer-Button funktionieren auch ohne ID; geladen wird dann aber nichts –
// gewollt für lokale Tests und Vorschau-Deployments.

// Muss direkt so ausgeschrieben sein, damit Next.js den Wert beim Build einsetzt.
export const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || "";

/* -------------------------------------------------------------------------- */
/* Einwilligung                                                               */
/* -------------------------------------------------------------------------- */

// Wird der Text im Cookie-Hinweis inhaltlich geändert, Version erhöhen –
// dann werden alle Besucher erneut gefragt.
const CONSENT_VERSION = 1;
const CONSENT_STORAGE_KEY = "cookie-einwilligung";
const CONSENT_CHANGE_EVENT = "cookie-consent-change";
const OPEN_SETTINGS_EVENT = "open-cookie-settings";

export type ConsentStatus = "granted" | "denied";

type ConsentRecord = {
  status: ConsentStatus;
  version: number;
  date: string;
};

/** Rohwert aus localStorage – als String, damit useSyncExternalStore stabil vergleichen kann. */
export function readConsentSnapshot() {
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    // z. B. Safari mit gesperrtem Speicher: wie "noch nicht entschieden".
    return null;
  }
}

/** Gültige Entscheidung oder null (noch nicht gefragt bzw. veraltete Version). */
export function parseConsent(raw: string | null): ConsentStatus | null {
  if (!raw) return null;
  try {
    const record = JSON.parse(raw) as Partial<ConsentRecord>;
    if (record.version !== CONSENT_VERSION) return null;
    return record.status === "granted" || record.status === "denied"
      ? record.status
      : null;
  } catch {
    return null;
  }
}

export function setConsent(status: ConsentStatus) {
  const record: ConsentRecord = {
    status,
    version: CONSENT_VERSION,
    date: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Ohne Speicher gilt die Wahl nur bis zum Neuladen.
  }

  if (status === "granted") loadMetaPixel();
  else revokeMetaPixel();

  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
}

export function subscribeToConsent(onChange: () => void) {
  // "storage" hält mehrere offene Tabs synchron.
  window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}

export function subscribeToOpenSettings(onOpen: () => void) {
  window.addEventListener(OPEN_SETTINGS_EVENT, onOpen);
  return () => window.removeEventListener(OPEN_SETTINGS_EVENT, onOpen);
}

/* -------------------------------------------------------------------------- */
/* Meta-Pixel                                                                 */
/* -------------------------------------------------------------------------- */

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: Fbq;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

let pixelInitialized = false;

/** Entspricht dem offiziellen Meta-Snippet, nur ohne Inline-Script. */
function installFbq() {
  if (window.fbq) return window.fbq;

  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  } as Fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  return fbq;
}

export function loadMetaPixel() {
  if (!metaPixelId) return;

  if (pixelInitialized) {
    // Zustimmung nach vorherigem Widerruf ohne Neuladen der Seite.
    window.fbq?.("consent", "grant");
    return;
  }

  const fbq = installFbq();
  // Keine automatische Erfassung von Buttons und Formularfeldern:
  // Name, E-Mail und Antworten aus der Bewerbung gehen nicht an Meta.
  fbq("set", "autoConfig", false, metaPixelId);
  fbq("init", metaPixelId);
  fbq("track", "PageView");
  pixelInitialized = true;
}

function revokeMetaPixel() {
  // Ein bereits geladener Pixel sendet danach nichts mehr.
  window.fbq?.("consent", "revoke");
  deleteMetaCookies();
}

/** Meta setzt _fbp/_fbc auf der Hauptdomain – daher alle Domain-Ebenen probieren. */
function deleteMetaCookies() {
  const parts = window.location.hostname.split(".");
  const domains = [""];
  for (let i = 0; i < parts.length - 1; i++) {
    domains.push(`; domain=.${parts.slice(i).join(".")}`);
  }
  for (const name of ["_fbp", "_fbc"]) {
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain}`;
    }
  }
}

/** Abgeschickte Bewerbung – das Ziel, auf das die Anzeigen optimiert werden. */
export function trackLead() {
  if (parseConsent(readConsentSnapshot()) !== "granted") return;
  window.fbq?.("track", "Lead");
}

/* -------------------------------------------------------------------------- */
/* UTM-Parameter                                                              */
/* -------------------------------------------------------------------------- */

// Kommen über die Anzeigen-Links und werden mit der Bewerbung mitgeschickt.
// Ohne Cookies und unabhängig von der Einwilligung: Sie bleiben nur für die
// Sitzung im Tab gespeichert und gehen ausschließlich an uns, nicht an Meta.
export const utmKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export type UtmParams = Partial<Record<(typeof utmKeys)[number], string>>;

// Muss zu UTM_MAX_LENGTH in app/api/contact/route.ts passen.
const UTM_MAX_LENGTH = 200;
const UTM_STORAGE_KEY = "utm-parameter";

/** Beim Landen auf der Seite aufrufen. Neue Parameter ersetzen ältere. */
export function captureUtmParams() {
  const search = new URLSearchParams(window.location.search);
  const params: UtmParams = {};
  for (const key of utmKeys) {
    const value = search.get(key)?.trim();
    if (value) params[key] = value.slice(0, UTM_MAX_LENGTH);
  }
  if (Object.keys(params).length === 0) return;

  try {
    window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(params));
  } catch {
    // Ohne Speicher wird die Bewerbung einfach ohne Quelle verschickt.
  }
}

export function readUtmParams(): UtmParams {
  try {
    const raw = window.sessionStorage.getItem(UTM_STORAGE_KEY);
    if (!raw) return {};
    const stored = JSON.parse(raw) as Record<string, unknown>;
    const params: UtmParams = {};
    for (const key of utmKeys) {
      if (typeof stored[key] === "string") params[key] = stored[key];
    }
    return params;
  } catch {
    return {};
  }
}
