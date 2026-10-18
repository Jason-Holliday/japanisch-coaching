import { createTransport, type Transporter } from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Spam-Schutz ohne externen Dienst:
// 1. Honeypot-Feld, das nur Bots ausfüllen
// 2. Mindest-Ausfüllzeit zwischen Formular-Mount und Absenden
// 3. Einfaches In-Memory-Rate-Limit pro IP
const MIN_FILL_MS = 3_000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

type FieldSpec = {
  key: string;
  label: string;
  maxLength: number;
};

// Spiegelt die Felder aus app/components/MultiStepFormular.tsx
const fields: FieldSpec[] = [
  { key: "level", label: "Aktuelles Level", maxLength: 300 },
  { key: "problem", label: "Größtes Problem", maxLength: 5000 },
  { key: "name", label: "Name", maxLength: 120 },
  { key: "age", label: "Alter", maxLength: 10 },
  { key: "instagram", label: "Instagram", maxLength: 30 },
  { key: "occupation", label: "Beruf", maxLength: 200 },
  { key: "goal", label: "Ziel mit Japanisch", maxLength: 5000 },
  { key: "countryCode", label: "Ländervorwahl", maxLength: 8 },
  { key: "phone", label: "Telefonnummer", maxLength: 40 },
  { key: "email", label: "E-Mail-Adresse", maxLength: 254 },
  { key: "notes", label: "Weitere Hinweise", maxLength: 5000 },
  { key: "investment", label: "Investitionsbereitschaft", maxLength: 10 },
  { key: "startSoon", label: "Start in 30 Tagen", maxLength: 10 },
];

// Herkunft aus den Anzeigen-Links (siehe app/tracking.ts). Optional –
// fehlende oder ungültige Werte werden ignoriert und blockieren nie die Bewerbung.
const UTM_MAX_LENGTH = 200;
const utmFields = [
  { key: "utm_source", label: "Quelle" },
  { key: "utm_medium", label: "Medium" },
  { key: "utm_campaign", label: "Kampagne" },
  { key: "utm_content", label: "Anzeige" },
  { key: "utm_term", label: "Begriff" },
] as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9 +()/.-]{6,}$/;
const instagramPattern = /^[A-Za-z0-9._]{1,30}$/;
const MIN_AGE = 14;
const MAX_AGE = 99;

const rateLimitBuckets = new Map<string, number[]>();

function recentSubmissions(ip: string) {
  const now = Date.now();
  const recent = (rateLimitBuckets.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );
  if (recent.length > 0) rateLimitBuckets.set(ip, recent);
  else rateLimitBuckets.delete(ip);
  return recent;
}

/** Nur lesen – verbraucht kein Kontingent. */
function isRateLimited(ip: string) {
  return recentSubmissions(ip).length >= RATE_LIMIT_MAX;
}

/** Wird erst unmittelbar vor dem Versand gezählt. */
function recordSubmission(ip: string) {
  // Verhindert unbegrenztes Wachstum der Map bei langer Laufzeit.
  if (rateLimitBuckets.size > 5000) rateLimitBuckets.clear();
  const recent = recentSubmissions(ip);
  recent.push(Date.now());
  rateLimitBuckets.set(ip, recent);
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/** Entfernt Zeilenumbrüche, damit nichts in Mail-Header injiziert werden kann. */
function sanitizeHeaderValue(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Absendername und Antwortzeit der Bestätigungsmail – bei Bedarf hier anpassen.
const CONFIRMATION_SENDER_NAME = "Kenji Tanaka | Japanisch-Coaching";
const CONFIRMATION_RESPONSE_TIME = "innerhalb von 24 Stunden";

/**
 * Bestätigungsmail an den Bewerber.
 * Enthält bewusst nur den Vornamen und keine weiteren Freitexte aus dem
 * Formular, damit das Formular nicht missbraucht werden kann, um beliebige
 * Inhalte an fremde Adressen zu verschicken.
 */
function buildConfirmationMail(fullName: string) {
  const firstName = sanitizeHeaderValue(fullName).split(/\s+/)[0].slice(0, 40);
  const subject = "Deine Bewerbung ist eingegangen";

  const text = `Hallo ${firstName},

vielen Dank für deine Bewerbung für das Japanisch-Coaching!

Deine Angaben sind bei uns angekommen und werden persönlich geprüft. Wir melden uns ${CONFIRMATION_RESPONSE_TIME} per E-Mail bei dir.

Falls du in der Zwischenzeit Fragen hast, antworte einfach auf diese E-Mail.

Viele Grüße
Kenji Tanaka
Japanisch-Coaching

–
Du erhältst diese E-Mail, weil mit dieser Adresse eine Bewerbung über unser Formular abgeschickt wurde. Warst du das nicht, kannst du diese Nachricht ignorieren.
`;

  const html = `<!doctype html>
<html lang="de">
<body style="margin:0;padding:0;background:#faeee6;font-family:Arial,Helvetica,sans-serif;color:#06101f">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faeee6;padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;padding:32px">
        <tr><td>
          <p style="margin:0 0 4px;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#b00045">Japanisch-Coaching</p>
          <h1 style="margin:0 0 24px;font-size:24px;line-height:1.3;color:#06101f">Deine Bewerbung ist eingegangen</h1>
          <p style="margin:0 0 16px;font-size:16px;line-height:1.6">Hallo ${escapeHtml(firstName)},</p>
          <p style="margin:0 0 16px;font-size:16px;line-height:1.6">vielen Dank für deine Bewerbung für das Japanisch-Coaching!</p>
          <p style="margin:0 0 16px;font-size:16px;line-height:1.6">Deine Angaben sind bei uns angekommen und werden persönlich geprüft. Wir melden uns <strong>${CONFIRMATION_RESPONSE_TIME}</strong> per E-Mail bei dir.</p>
          <p style="margin:0 0 24px;font-size:16px;line-height:1.6">Falls du in der Zwischenzeit Fragen hast, antworte einfach auf diese E-Mail.</p>
          <p style="margin:0;font-size:16px;line-height:1.6">Viele Grüße<br><strong>Kenji Tanaka</strong><br>Japanisch-Coaching</p>
        </td></tr>
      </table>
      <p style="max-width:560px;margin:16px auto 0;font-size:12px;line-height:1.5;color:#06101f;opacity:0.7">Du erhältst diese E-Mail, weil mit dieser Adresse eine Bewerbung über unser Formular abgeschickt wurde. Warst du das nicht, kannst du diese Nachricht ignorieren.</p>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}

function jsonResponse(body: unknown, status: number) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

let cachedTransporter: Transporter | null = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const port = Number(process.env.SMTP_PORT ?? 465);

  if (!host || !user || !password || !Number.isFinite(port)) {
    // Bewusst ohne Werte: es darf nie ein Secret im Log landen.
    throw new Error("SMTP configuration is incomplete");
  }

  // Anbieterunabhängig: Port 465 nutzt implizites TLS,
  // alle anderen Ports (z. B. 587) verwenden STARTTLS.
  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === "true"
    : port === 465;

  cachedTransporter = createTransport({
    host,
    port,
    secure,
    requireTLS: !secure,
    auth: { user, pass: password },
    pool: true,
    maxConnections: 1,
  });

  return cachedTransporter;
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return jsonResponse(
      { error: "Ungültiger Content-Type. Erwartet wird application/json." },
      415,
    );
  }

  const clientIp = getClientIp(request);

  if (isRateLimited(clientIp)) {
    return jsonResponse(
      {
        error:
          "Zu viele Bewerbungen in kurzer Zeit. Bitte versuche es später erneut.",
      },
      429,
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "Ungültiger Request-Body." }, 400);
  }

  if (typeof payload !== "object" || payload === null) {
    return jsonResponse({ error: "Ungültiger Request-Body." }, 400);
  }

  const body = payload as Record<string, unknown>;

  // Honeypot: echte Besucher sehen dieses Feld nicht.
  // Wir antworten mit 200, damit Bots keinen Fehler zum Nachjustieren bekommen.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return jsonResponse({ ok: true }, 200);
  }

  const renderedAt = Number(body.renderedAt);
  if (!Number.isFinite(renderedAt) || renderedAt <= 0) {
    return jsonResponse({ error: "Ungültiger Request-Body." }, 400);
  }
  if (Date.now() - renderedAt < MIN_FILL_MS) {
    return jsonResponse(
      { error: "Das Formular wurde zu schnell abgeschickt." },
      400,
    );
  }

  // Serverseitige Validierung – unabhängig von der Prüfung im Browser.
  const values: Record<string, string> = {};
  const fieldErrors: Record<string, string> = {};

  for (const { key, label, maxLength } of fields) {
    const raw = body[key];

    if (typeof raw !== "string") {
      fieldErrors[key] = `${label} – bitte fülle dieses Feld aus.`;
      continue;
    }

    const value = raw.trim();

    if (!value) {
      fieldErrors[key] = `${label} – bitte fülle dieses Feld aus.`;
      continue;
    }
    if (value.length > maxLength) {
      fieldErrors[key] = `${label} – bitte kürze die Eingabe (max. ${maxLength} Zeichen).`;
      continue;
    }
    if (key === "email" && !emailPattern.test(value)) {
      fieldErrors[key] = `${label} – bitte prüfe das Format.`;
      continue;
    }
    if (key === "phone" && !phonePattern.test(value)) {
      fieldErrors[key] = `${label} – bitte prüfe das Format.`;
      continue;
    }
    if (
      key === "age" &&
      !(/^\d{1,2}$/.test(value) && +value >= MIN_AGE && +value <= MAX_AGE)
    ) {
      fieldErrors[key] = `${label} – bitte gib ein Alter zwischen ${MIN_AGE} und ${MAX_AGE} an.`;
      continue;
    }
    if (key === "instagram" && !instagramPattern.test(value)) {
      fieldErrors[key] = `${label} – erlaubt sind Buchstaben, Ziffern, Punkt und Unterstrich (max. 30 Zeichen).`;
      continue;
    }

    values[key] = value;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return jsonResponse(
      { error: "Bitte überprüfe deine Angaben.", fields: fieldErrors },
      400,
    );
  }

  const utmRows: [string, string][] = [];
  for (const { key, label } of utmFields) {
    const raw = body[key];
    if (typeof raw !== "string") continue;
    const value = raw.replace(/\s+/g, " ").trim();
    if (value && value.length <= UTM_MAX_LENGTH) utmRows.push([label, value]);
  }

  const recipient = process.env.CONTACT_EMAIL;
  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER;

  if (!recipient || !fromAddress) {
    console.error(
      "[contact] Missing CONTACT_EMAIL or SMTP_FROM/SMTP_USER environment variable",
    );
    return jsonResponse(
      {
        error:
          "Der E-Mail-Versand ist derzeit nicht verfügbar. Bitte versuche es später erneut.",
      },
      500,
    );
  }

  const senderName = sanitizeHeaderValue(values.name);
  const senderEmail = sanitizeHeaderValue(values.email);

  // Ländervorwahl und Nummer werden fürs Mail-Layout zusammengeführt.
  const mailRows: [string, string][] = [
    ["Name", values.name],
    ["Alter", values.age],
    ["E-Mail-Adresse", values.email],
    ["Telefonnummer", `${values.countryCode} ${values.phone}`],
    ["Instagram", `@${values.instagram}`],
    ["Beruf", values.occupation],
    ["Aktuelles Level", values.level],
    ["Größtes Problem", values.problem],
    ["Ziel mit Japanisch", values.goal],
    ["Weitere Hinweise", values.notes],
    ["Mindestens 1.500 € Investition möglich", values.investment],
    ["Start in den nächsten 30 Tagen möglich", values.startSoon],
    ...utmRows.map(([label, value]): [string, string] => [
      `Herkunft – ${label}`,
      value,
    ]),
  ];
  if (utmRows.length === 0) {
    mailRows.push(["Herkunft", "Keine Anzeigen-Parameter (z. B. direkter Aufruf)"]);
  }

  const text = `Neue Bewerbung über die Website\n\n${mailRows
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n")}\n`;
  const html = `<h2>Neue Bewerbung über die Website</h2><dl>${mailRows
    .map(
      ([label, value]) =>
        `<dt style="font-weight:bold;margin-top:12px">${escapeHtml(label)}</dt>` +
        `<dd style="margin:0">${escapeHtml(value).replace(/\n/g, "<br>")}</dd>`,
    )
    .join("")}</dl>`;

  recordSubmission(clientIp);

  try {
    await getTransporter().sendMail({
      // `from` muss die SMTP-Adresse sein, sonst lehnen die meisten Anbieter ab.
      from: { name: "Bewerbungsformular", address: fromAddress },
      to: recipient,
      // Antworten gehen direkt an den Besucher.
      replyTo: { name: senderName, address: senderEmail },
      subject: `Neue Bewerbung – ${senderName}`,
      text,
      html,
    });
  } catch (error) {
    // Nur die Fehlermeldung loggen, niemals Transport-Optionen oder Zugangsdaten.
    console.error(
      "[contact] Failed to send mail:",
      error instanceof Error ? error.message : "unknown error",
    );
    return jsonResponse(
      {
        error:
          "Deine Bewerbung konnte nicht versendet werden. Bitte versuche es später erneut.",
      },
      502,
    );
  }

  // Bestätigung an den Bewerber. Die Bewerbung selbst ist zu diesem Zeitpunkt
  // bereits zugestellt – ein Fehler hier darf sie daher nicht scheitern lassen.
  try {
    const confirmation = buildConfirmationMail(values.name);
    await getTransporter().sendMail({
      from: { name: CONFIRMATION_SENDER_NAME, address: fromAddress },
      to: { name: senderName, address: senderEmail },
      // Rückfragen des Bewerbers landen beim Betreiber.
      replyTo: recipient,
      subject: confirmation.subject,
      text: confirmation.text,
      html: confirmation.html,
      // Kennzeichnet die Mail als automatisch (RFC 3834), damit Abwesenheits-
      // notizen nicht automatisch darauf antworten.
      headers: { "Auto-Submitted": "auto-generated" },
    });
  } catch (error) {
    console.error(
      "[contact] Failed to send confirmation mail:",
      error instanceof Error ? error.message : "unknown error",
    );
  }

  return jsonResponse({ ok: true }, 200);
}
