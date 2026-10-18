"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import {
  loadMetaPixel,
  parseConsent,
  readConsentSnapshot,
  setConsent,
  subscribeToConsent,
  subscribeToOpenSettings,
  type ConsentStatus,
} from "../tracking";

// Beim Server-Render ist die Entscheidung unbekannt – dann nichts anzeigen,
// damit kein Hinweis aufblitzt, der nach dem Hydrieren wieder verschwindet.
const SERVER_SNAPSHOT = "server";

// Gleich groß und auf derselben Ebene: Ablehnen muss genauso leicht
// erreichbar und gut lesbar bleiben. Akzeptieren ist farbig gefüllt,
// Ablehnen weiß umrandet.
const buttonBaseClassName =
  "cta-interactive min-h-12 flex-1 cursor-pointer rounded-full border-2 px-6 py-3 text-sm font-bold uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f04498] sm:flex-none";
const acceptButtonClassName = `${buttonBaseClassName} cta-on-dark border-[#f04498]`;
const rejectButtonClassName = `${buttonBaseClassName} border-white bg-transparent text-white`;

export default function CookieBanner() {
  const titleId = useId();
  const descriptionId = useId();
  const snapshot = useSyncExternalStore(
    subscribeToConsent,
    readConsentSnapshot,
    () => SERVER_SNAPSHOT,
  );
  const consent = snapshot === SERVER_SNAPSHOT ? undefined : parseConsent(snapshot);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  // Bei bereits erteilter Zustimmung den Pixel bei jedem Seitenaufruf laden.
  useEffect(() => {
    if (consent === "granted") loadMetaPixel();
  }, [consent]);

  useEffect(
    () =>
      subscribeToOpenSettings(() => {
        openerRef.current =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        setIsSettingsOpen(true);
      }),
    [],
  );

  useEffect(() => {
    if (isSettingsOpen) titleRef.current?.focus();
  }, [isSettingsOpen]);

  if (consent === undefined) return null;
  if (consent !== null && !isSettingsOpen) return null;

  function decide(status: ConsentStatus) {
    setConsent(status);
    if (isSettingsOpen) {
      setIsSettingsOpen(false);
      openerRef.current?.focus();
      openerRef.current = null;
    }
  }

  return (
    <section
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      className="fixed inset-x-4 bottom-4 z-60 mx-auto max-w-3xl rounded-3xl border-2 border-[#f04498] bg-[#030d1d] p-5 text-white shadow-2xl sm:p-6"
    >
      <h2
        className="font-serif text-lg font-black outline-none"
        id={titleId}
        ref={titleRef}
        tabIndex={-1}
      >
        Cookies & Werbemessung
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-white/90" id={descriptionId}>
        Mit deiner Zustimmung nutzen wir den Meta-Pixel, um zu messen, welche
        unserer Anzeigen auf Instagram und Facebook zu Bewerbungen führen.
        Dabei setzt Meta Cookies und erhält Angaben wie IP-Adresse und
        Browser. Deine Antworten aus dem Formular gehen nicht an Meta. Lehnst
        du ab, funktioniert die Seite ganz normal. Du kannst deine Wahl
        jederzeit unter „Cookie-Einstellungen“ im Footer ändern. Mehr in der{" "}
        <Link
          className="font-semibold text-[#f04498] underline decoration-[#f04498]/50 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white focus-visible:text-white focus-visible:decoration-white motion-reduce:transition-none"
          href="/datenschutz"
        >
          Datenschutzerklärung
        </Link>
        .
      </p>
      {consent !== null && (
        <p className="mt-3 text-sm font-semibold">
          Aktuell: {consent === "granted" ? "zugestimmt" : "abgelehnt"}
        </p>
      )}
      <div className="mt-4 flex gap-3">
        <button
          className={rejectButtonClassName}
          onClick={() => decide("denied")}
          type="button"
        >
          Ablehnen
        </button>
        <button
          className={acceptButtonClassName}
          onClick={() => decide("granted")}
          type="button"
        >
          Akzeptieren
        </button>
      </div>
    </section>
  );
}
