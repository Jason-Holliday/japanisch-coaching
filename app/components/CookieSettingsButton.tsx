"use client";

import { openCookieSettings } from "../tracking";

// Öffnet den Cookie-Hinweis erneut, damit die Einwilligung jederzeit
// widerrufen oder erteilt werden kann.
export default function CookieSettingsButton({
  className,
}: {
  className?: string;
}) {
  return (
    <button
      className={`cursor-pointer ${className ?? ""}`}
      onClick={openCookieSettings}
      type="button"
    >
      Cookie-Einstellungen
    </button>
  );
}
