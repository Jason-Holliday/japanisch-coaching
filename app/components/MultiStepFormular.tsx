"use client";

import Image from "next/image";
import { CircleCheckBig } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { captureUtmParams, readUtmParams, trackLead } from "../tracking";
import RevealOnScroll from "./RevealOnScroll";

const levels = [
  "Ich bin kompletter Anfänger, kann noch kein Hiragana lesen.",
  "Ich kenne ein paar Wörter/Hiragana, aber kann kaum etwas richtig lesen.",
  "Ich kann Hiragana lesen und einfache Sätze bauen.",
  "Ich bin schon deutlich weiter (B1 oder höher).",
];

const inputBaseClassName =
  "mt-2 min-h-12 w-full rounded-xl border-2 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/70 focus:border-[#f04498] focus:ring-2 focus:ring-[#f04498]/40";

// Muss zu den maxLength-Werten in app/api/contact/route.ts passen.
const maxLengths = {
  problem: 5000,
  name: 120,
  instagram: 30,
  occupation: 200,
  goal: 5000,
  phone: 40,
  email: 254,
  notes: 5000,
} as const;

const MIN_AGE = 14;
const MAX_AGE = 99;
const instagramPattern = /^[A-Za-z0-9._]{1,30}$/;

const draftStorageKey = (idPrefix: string) => `bewerbung-entwurf-${idPrefix}`;

// Auswahlkarte: Der Radio-Button selbst ist unsichtbar (sr-only), bleibt aber
// für Tastatur, Screenreader und Validierung erhalten. Die Auswahl zeigt die
// Karte über has-[:checked].
const choiceClassName =
  "relative flex min-h-16 cursor-pointer select-none items-center rounded-2xl border-2 border-white p-4 text-sm leading-snug text-white transition-[border-color,background-color] duration-200 hover:border-[#f04498] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#f04498] has-[:checked]:border-[#f04498] has-[:checked]:bg-[#b00045]/25 has-[:checked]:font-semibold motion-reduce:transition-none";

// Kurze Antworten (Ja/Nein) zentriert.
const shortChoiceClassName = `${choiceClassName} justify-center text-center`;

type ApplicationValues = {
  level: string;
  problem: string;
  name: string;
  age: string;
  instagram: string;
  occupation: string;
  goal: string;
  countryCode: string;
  phone: string;
  email: string;
  notes: string;
  investment: string;
  startSoon: string;
};

const initialValues: ApplicationValues = {
  level: "",
  problem: "",
  name: "",
  age: "",
  instagram: "",
  occupation: "",
  goal: "",
  countryCode: "+49",
  phone: "",
  email: "",
  notes: "",
  investment: "",
  startSoon: "",
};

const steps = ["Level & Herausforderung", "Über dich", "Kontaktdaten", "Dein Start"];

function handleRadioGroupKeyDown(
  event: ReactKeyboardEvent<HTMLInputElement>,
) {
  const direction = {
    ArrowDown: 1,
    ArrowRight: 1,
    ArrowUp: -1,
    ArrowLeft: -1,
  }[event.key];
  if (direction === undefined) return;

  const form = event.currentTarget.form;
  if (!form) return;

  const options = Array.from(
    form.querySelectorAll<HTMLInputElement>(
      `input[type="radio"][name="${event.currentTarget.name}"]`,
    ),
  );
  if (options.length < 2) return;

  event.preventDefault();
  const currentIndex = options.indexOf(event.currentTarget);
  const nextIndex = (currentIndex + direction + options.length) % options.length;
  options[nextIndex].focus();
  options[nextIndex].click();
}

const fieldLabels: Record<string, string> = {
  level: "Wie sieht dein aktuelles Level aus?",
  problem: "Was ist derzeit dein größtes Problem beim Japanisch lernen?",
  name: "Wie heißt du?",
  age: "Wie alt bist du?",
  instagram: "Dein Instagram Tag",
  occupation: "Was ist derzeit dein Beruf?",
  goal: "Was ist dein Ziel mit Japanisch?",
  phone: "Telefonnummer",
  email: "E-Mail-Adresse",
  notes: "Was sollten wir vor dem Gespräch noch über dich wissen?",
  investment:
    "Hast du mindestens 1.500 €, um in deinen Fließend-Japanisch-Traum zu investieren?",
  startSoon: "Kannst du in den nächsten 30 Tagen starten?",
};

const requiredFieldTargets: Record<
  string,
  { targetId: string; targetStep: number }
> = {
  level: { targetId: "field-level-0", targetStep: 0 },
  problem: { targetId: "field-problem", targetStep: 0 },
  name: { targetId: "field-name", targetStep: 1 },
  age: { targetId: "field-age", targetStep: 1 },
  instagram: { targetId: "field-instagram", targetStep: 1 },
  occupation: { targetId: "field-occupation", targetStep: 1 },
  goal: { targetId: "field-goal", targetStep: 1 },
  countryCode: { targetId: "field-country-code", targetStep: 2 },
  phone: { targetId: "field-phone", targetStep: 2 },
  email: { targetId: "field-email", targetStep: 2 },
  notes: { targetId: "field-notes", targetStep: 2 },
  investment: { targetId: "field-investment-ja", targetStep: 3 },
  startSoon: { targetId: "field-start-soon-ja", targetStep: 3 },
};

type ValidationError = {
  message: string;
  targetId: string;
  targetStep: number;
};

/** "Label – bitte …" → "Bitte …" für die Meldung direkt am Feld. */
function shortErrorMessage(message: string) {
  const short = message.split(" – ").pop() ?? message;
  return short.charAt(0).toUpperCase() + short.slice(1);
}

function readDraft(idPrefix: string) {
  try {
    const raw = window.sessionStorage.getItem(draftStorageKey(idPrefix));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      values?: Partial<ApplicationValues>;
      step?: number;
    };
    const values = { ...initialValues };
    for (const key of Object.keys(initialValues) as (keyof ApplicationValues)[]) {
      const value = parsed.values?.[key];
      if (typeof value === "string") values[key] = value;
    }
    const step =
      Number.isInteger(parsed.step) && parsed.step! >= 0 && parsed.step! < steps.length
        ? parsed.step!
        : 0;
    return { values, step };
  } catch {
    return null;
  }
}

function writeDraft(idPrefix: string, values: ApplicationValues, step: number) {
  try {
    window.sessionStorage.setItem(
      draftStorageKey(idPrefix),
      JSON.stringify({ values, step }),
    );
  } catch {
    // Privater Modus o. Ä. – Entwurf wird dann einfach nicht gespeichert.
  }
}

function clearDraft(idPrefix: string) {
  try {
    window.sessionStorage.removeItem(draftStorageKey(idPrefix));
  } catch {
    // ignorieren
  }
}

export default function MultiStepFormular({
  idPrefix,
  sectionId,
}: {
  idPrefix: string;
  sectionId: string;
}) {
  const reactId = useId().replace(/:/g, "");
  const getId = (name: string) => `${idPrefix}-${reactId}-${name}`;
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(initialValues);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [showStepValidationErrors, setShowStepValidationErrors] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, ValidationError>
  >({});
  const formRef = useRef<HTMLFormElement>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const previousStepRef = useRef(step);
  const previousErrorCountRef = useRef(0);
  const pendingFieldRef = useRef<{ id: string; step: number } | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const mountedAtRef = useRef(0);
  const draftLoadedRef = useRef(false);

  // Zeitstempel erst nach dem Mount setzen (Date.now() ist im Render unrein).
  // Der Entwurf wird ebenfalls erst hier gelesen, damit Server- und
  // Client-Render beim Hydrieren übereinstimmen.
  useEffect(() => {
    mountedAtRef.current = Date.now();
    // Anzeigen-Quelle aus der Adresse merken, bevor der Besucher weiterklickt.
    captureUtmParams();
    const draft = readDraft(idPrefix);
    if (draft) {
      previousStepRef.current = draft.step;
      // Einmaliges Übernehmen aus sessionStorage nach der Hydrierung –
      // im Render-Initializer würde es einen Hydration-Mismatch geben.
      /* eslint-disable react-hooks/set-state-in-effect */
      setValues(draft.values);
      setStep(draft.step);
      /* eslint-enable react-hooks/set-state-in-effect */
    }
    draftLoadedRef.current = true;
  }, [idPrefix]);

  useEffect(() => {
    if (!draftLoadedRef.current || isSubmitted) return;
    writeDraft(idPrefix, values, step);
  }, [idPrefix, isSubmitted, step, values]);

  const showErrors = hasAttemptedSubmit || showStepValidationErrors;

  function hasFieldError(key: keyof ApplicationValues) {
    return showErrors && Boolean(validationErrors[key]);
  }

  function errorAriaProps(key: keyof ApplicationValues) {
    const hasError = hasFieldError(key);
    return {
      "aria-invalid": hasError,
      "aria-describedby": hasError ? getId(`field-error-${key}`) : undefined,
    };
  }

  function inputClassName(key: keyof ApplicationValues) {
    return `${inputBaseClassName} ${
      hasFieldError(key) ? "border-[#ff9a9a]" : "border-white"
    }`;
  }

  function renderFieldError(key: keyof ApplicationValues) {
    if (!hasFieldError(key)) return null;
    return (
      <span
        className="mt-1.5 block text-xs font-normal text-[#ffb3b3]"
        id={getId(`field-error-${key}`)}
      >
        {shortErrorMessage(validationErrors[key].message)}
      </span>
    );
  }

  useEffect(() => {
    if (isSubmitted) {
      successHeadingRef.current?.focus();
      return;
    }

    const pendingField = pendingFieldRef.current;
    if (pendingField && pendingField.step === step) {
      const field = formRef.current?.querySelector<HTMLElement>(
        `[id="${pendingField.id}"]`,
      );
      if (field) {
        pendingFieldRef.current = null;
        field.focus({ preventScroll: true });
        field.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
          block: "center",
        });
        previousStepRef.current = step;
        return;
      }
    }

    const errorCount = Object.keys(validationErrors).length;
    if (errorCount > 0 && previousErrorCountRef.current === 0) {
      errorSummaryRef.current?.focus();
    }
    previousErrorCountRef.current = errorCount;
    if (errorCount > 0) return;

    if (previousStepRef.current !== step) {
      stepHeadingRef.current?.focus();
      previousStepRef.current = step;
    }
  }, [isSubmitted, step, validationErrors]);

  function updateValue(name: keyof ApplicationValues, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    setValidationErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  function focusInvalidField(
    event: React.MouseEvent<HTMLAnchorElement>,
    error: ValidationError,
  ) {
    event.preventDefault();
    pendingFieldRef.current = {
      id: error.targetId,
      step: error.targetStep,
    };
    if (error.targetStep === step) {
      const field = formRef.current?.querySelector<HTMLElement>(
        `[id="${error.targetId}"]`,
      );
      if (field) {
        pendingFieldRef.current = null;
        field.focus({ preventScroll: true });
        field.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
          block: "center",
        });
      }
      return;
    }

    setStep(error.targetStep);
  }

  function validateApplication(stepToValidate?: number) {
    const errors: Record<string, ValidationError> = {};
    const requiredFields = (
      Object.keys(fieldLabels) as (keyof ApplicationValues)[]
    ).map((key) => ({
      key,
      targetId: getId(requiredFieldTargets[key].targetId),
      targetStep: requiredFieldTargets[key].targetStep,
    }));

    requiredFields
      .filter(
        ({ targetStep }) =>
          stepToValidate === undefined || targetStep === stepToValidate,
      )
      .forEach(({ key, targetId, targetStep }) => {
        const value = values[key].trim();
        const label = fieldLabels[key];
        let message = "";

        if (!value) {
          message = `${label} – bitte fülle dieses Feld aus.`;
        } else if (
          key === "email" &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ) {
          message = `${label} – bitte prüfe das Format.`;
        } else if (key === "phone" && !/^[0-9 +()/.-]{6,}$/.test(value)) {
          message = `${label} – bitte prüfe das Format.`;
        } else if (
          key === "age" &&
          !(/^\d{1,2}$/.test(value) && +value >= MIN_AGE && +value <= MAX_AGE)
        ) {
          message = `${label} – bitte gib ein Alter zwischen ${MIN_AGE} und ${MAX_AGE} an.`;
        } else if (key === "instagram" && !instagramPattern.test(value)) {
          message = `${label} – erlaubt sind Buchstaben, Ziffern, Punkt und Unterstrich (max. 30 Zeichen).`;
        }

        if (message) {
          errors[key] = { message, targetId, targetStep };
        }
      });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function goToNextStep() {
    if (step < steps.length - 1) {
      const isStepValid = validateApplication(step);
      if (!isStepValid) {
        setShowStepValidationErrors(true);
        setHasAttemptedSubmit(false);
        return;
      }
    }

    setShowStepValidationErrors(false);
    setHasAttemptedSubmit(false);
    setValidationErrors({});
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function goToPreviousStep() {
    setShowStepValidationErrors(false);
    setHasAttemptedSubmit(false);
    setValidationErrors({});
    setStep((current) => Math.max(current - 1, 0));
  }

  // Enter in einem Eingabefeld führt (wie der Button) zum nächsten Schritt
  // bzw. schickt im letzten Schritt ab.
  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < steps.length - 1) goToNextStep();
    else void handleApplicationSubmit();
  }

  async function handleApplicationSubmit() {
    if (isSubmitting) return;

    setHasAttemptedSubmit(true);
    setSubmitError("");
    if (!validateApplication()) {
      setShowStepValidationErrors(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          // Herkunft der Bewerbung (Anzeige/Kampagne), falls vorhanden
          ...readUtmParams(),
          // Spam-Schutz: Honeypot-Feld und Mindest-Ausfuellzeit
          website: honeypotRef.current?.value ?? "",
          renderedAt: mountedAtRef.current,
        }),
      });

      const result = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string; fields?: Record<string, string> }
        | null;

      if (!response.ok) {
        if (result?.fields) {
          // Serverseitige Feldfehler in die bestehende Fehlerliste uebernehmen.
          const serverErrors: Record<string, ValidationError> = {};
          Object.entries(result.fields).forEach(([key, message]) => {
            const field = requiredFieldTargets[key];
            if (!field) return;
            serverErrors[key] = {
              message,
              targetId: getId(field.targetId),
              targetStep: field.targetStep,
            };
          });
          if (Object.keys(serverErrors).length > 0) {
            setValidationErrors(serverErrors);
          }
        }
        setSubmitError(
          result?.error ??
            "Deine Bewerbung konnte nicht versendet werden. Bitte versuche es später erneut.",
        );
        return;
      }

      clearDraft(idPrefix);
      // Nur mit Einwilligung; ohne passiert hier nichts.
      trackLead();
      setIsSubmitted(true);
    } catch {
      setSubmitError(
        "Verbindung fehlgeschlagen. Bitte prüfe deine Internetverbindung und versuche es erneut.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      aria-labelledby={getId(isSubmitted ? "success-title" : "title")}
      className="bg-[#030d1d] px-6 py-16 text-white sm:px-10 sm:py-20 lg:px-14 lg:py-24"
      id={sectionId}
    >
      <div className="mx-auto max-w-360">
        {!isSubmitted && (
          <RevealOnScroll>
            <h2
              className="text-center font-serif text-3xl font-black uppercase sm:text-4xl"
              id={getId("title")}
            >
              Bewirb dich jetzt
            </h2>
            <p className="mt-3 text-center text-sm text-white">
              Alle mit * markierten Felder sind Pflichtfelder.
            </p>
          </RevealOnScroll>
        )}

        {isSubmitted ? (
          <RevealOnScroll className="mx-auto mt-8 max-w-2xl">
            <div
              aria-labelledby={getId("success-title")}
              className="bewerbung-success-enter rounded-4xl border border-white/20 bg-white/5 px-6 py-12 text-center shadow-2xl sm:mt-12 sm:px-12 sm:py-16"
              role="status"
            >
            <CircleCheckBig
              aria-hidden="true"
              className="bewerbung-success-icon mx-auto size-16 text-[#f04498] sm:size-20"
              strokeWidth={1.6}
            />
            <h2
              className="mt-6 font-serif text-3xl font-black uppercase sm:text-4xl"
              id={getId("success-title")}
              ref={successHeadingRef}
              tabIndex={-1}
            >
              Vielen Dank für deine Bewerbung!
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white sm:text-lg">
              Deine Bewerbung wurde übermittelt und wird persönlich geprüft. Du
              erhältst gleich eine Bestätigung per E-Mail – schau zur Sicherheit
              auch in deinen Spam-Ordner. Wir melden uns innerhalb von 24 Stunden
              bei dir.
            </p>
            </div>
          </RevealOnScroll>
        ) : (
        <RevealOnScroll className="mt-10">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch lg:gap-12">
          <div className="relative hidden min-h-160 overflow-hidden rounded-4xl lg:block">
            <Image
              alt="Japanischlehrer Kenji Tanaka"
              className="object-cover object-center"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              src="/multi-step-form_image.jpg"
            />
          </div>

          <div className="min-w-0">
            <div
              aria-label={`Schritt ${step + 1} von ${steps.length}: ${steps[step]}`}
              className="relative mb-8"
              role="group"
            >
              <div
                aria-hidden="true"
                className="absolute left-[12.5%] right-[12.5%] top-6 h-1 -translate-y-1/2 rounded-full bg-white"
              />
              <div
                aria-hidden="true"
                className="absolute left-[12.5%] top-6 h-1 -translate-y-1/2 rounded-full bg-[#f04498] transition-[width] duration-500 ease-out motion-reduce:transition-none"
                style={{
                  width: `${(step / (steps.length - 1)) * 75}%`,
                }}
              />
              <ol className="relative grid grid-cols-4" role="list">
                {steps.map((stepName, index) => (
                  <li
                    aria-current={step === index ? "step" : undefined}
                    className="z-10 flex flex-col items-center gap-2 text-center"
                    key={stepName}
                  >
                    <span
                      aria-hidden="true"
                      className={`flex size-12 items-center justify-center bg-[#030d1d] text-lg font-bold transition-[border-color,color,box-shadow] duration-300 motion-reduce:transition-none ${
                        step > index
                          ? "text-[#f04498]"
                          : `rounded-full border-2 ${
                              step === index
                                ? "border-[#f04498] text-[#f04498] ring-4 ring-[#f04498]/30"
                                : "border-white text-white"
                            }`
                      }`}
                    >
                      {step > index ? (
                        <CircleCheckBig
                          aria-hidden="true"
                          className="size-12 bewerbung-step-check"
                          strokeWidth={1.7}
                        />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <span className="sr-only sm:not-sr-only sm:text-xs sm:text-white">
                      {stepName}
                    </span>
                    {step > index && (
                      <span className="sr-only">Abgeschlossen</span>
                    )}
                  </li>
                ))}
              </ol>
              <p aria-live="polite" className="sr-only" role="status">
                Schritt {step + 1} von {steps.length}: {steps[step]}
              </p>
            </div>

            <form noValidate onSubmit={handleFormSubmit} ref={formRef}>
              {/* Honeypot: bewusst kein Name wie "website"/"url", den Browser-
                  Autofill bei echten Besuchern befüllen könnte. */}
              <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
                <label htmlFor={getId("field-hp")}>
                  Bitte dieses Feld leer lassen
                  <input
                    autoComplete="off"
                    id={getId("field-hp")}
                    name="hp_check_ref"
                    ref={honeypotRef}
                    tabIndex={-1}
                    type="text"
                  />
                </label>
              </div>
              {(hasAttemptedSubmit || showStepValidationErrors) &&
                Object.keys(validationErrors).length > 0 && (
                <div
                  aria-labelledby={getId("errors-title")}
                  aria-live="assertive"
                  className="mb-6 rounded-xl border-2 border-[#ff9a9a] bg-[#401717] p-4 text-white"
                  id={getId("error-summary")}
                  ref={errorSummaryRef}
                  role="alert"
                  tabIndex={-1}
                >
                  <h3
                    className="font-bold"
                    id={getId("errors-title")}
                  >
                    Bitte überprüfe folgende Angaben:
                  </h3>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                    {Object.entries(validationErrors).map(([key, error]) => (
                      <li id={getId(`error-${key}`)} key={key}>
                        <a
                          className="relative inline-block after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:content-[''] hover:text-[#ffd1d1] hover:after:scale-x-100 focus-visible:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:after:transition-none"
                          href={`#${error.targetId}`}
                          onClick={(event) =>
                            focusInvalidField(event, error)
                          }
                          tabIndex={0}
                        >
                          {error.message}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div
                aria-labelledby={getId("step-title")}
                className="bewerbung-step-enter"
                key={step}
                role="group"
              >
                <h3
                  className="sr-only"
                  id={getId("step-title")}
                  ref={stepHeadingRef}
                  tabIndex={-1}
                >
                  Schritt {step + 1}: {steps[step]}
                </h3>
                {step === 0 && (
                  <div className="space-y-7">
                  <fieldset>
                    <legend className="mb-3 text-sm font-semibold">
                      Wie sieht dein aktuelles Level aus? *
                    </legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {levels.map((level, index) => (
                        <label className={choiceClassName} key={level}>
                          <input
                            {...errorAriaProps("level")}
                            checked={values.level === level}
                            className="sr-only"
                            id={getId(`field-level-${index}`)}
                            name="level"
                            onChange={(event) =>
                              updateValue("level", event.target.value)
                            }
                            onKeyDown={handleRadioGroupKeyDown}
                            required
                            tabIndex={
                              values.level === level || (!values.level && index === 0)
                                ? 0
                                : -1
                            }
                            type="radio"
                            value={level}
                          />
                          {level}
                        </label>
                      ))}
                    </div>
                    {renderFieldError("level")}
                  </fieldset>

                  <label className="block text-sm font-semibold">
                    Was ist derzeit dein größtes Problem beim Japanisch lernen? *
                    <textarea
                      {...errorAriaProps("problem")}
                      className={`${inputClassName("problem")} min-h-28 resize-y`}
                      id={getId("field-problem")}
                      maxLength={maxLengths.problem}
                      name="problem"
                      onChange={(event) =>
                        updateValue("problem", event.target.value)
                      }
                      placeholder="Beschreibe kurz, was dir beim Japanischlernen am schwersten fällt."
                      required
                      value={values.problem}
                    />
                    {renderFieldError("problem")}
                  </label>
                  </div>
                )}

                {step === 1 && (
                  <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block text-sm font-semibold">
                    Wie heißt du? *
                    <input
                      {...errorAriaProps("name")}
                      autoComplete="name"
                      className={inputClassName("name")}
                      id={getId("field-name")}
                      maxLength={maxLengths.name}
                      name="name"
                      onChange={(event) =>
                        updateValue("name", event.target.value)
                      }
                      placeholder="Vor- und Nachname"
                      required
                      value={values.name}
                    />
                    {renderFieldError("name")}
                  </label>
                  <label className="block text-sm font-semibold">
                    Wie alt bist du? *
                    <input
                      {...errorAriaProps("age")}
                      className={inputClassName("age")}
                      id={getId("field-age")}
                      inputMode="numeric"
                      maxLength={2}
                      name="age"
                      onChange={(event) =>
                        updateValue("age", event.target.value.replace(/\D/g, ""))
                      }
                      pattern="[0-9]*"
                      placeholder="z. B. 30"
                      required
                      type="text"
                      value={values.age}
                    />
                    {renderFieldError("age")}
                  </label>
                  <label className="block text-sm font-semibold">
                    Dein Instagram Tag *
                    <span
                      className={`mt-2 flex min-h-12 w-full items-center rounded-xl border-2 bg-transparent text-sm text-white focus-within:border-[#f04498] focus-within:ring-2 focus-within:ring-[#f04498]/40 ${
                        hasFieldError("instagram")
                          ? "border-[#ff9a9a]"
                          : "border-white"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="pl-4 text-white"
                      >
                        @
                      </span>
                      <input
                        {...errorAriaProps("instagram")}
                        autoCapitalize="none"
                        autoComplete="off"
                        className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-white outline-none placeholder:text-white/70"
                        id={getId("field-instagram")}
                        maxLength={maxLengths.instagram}
                        name="instagram"
                        onChange={(event) =>
                          updateValue(
                            "instagram",
                            event.target.value.trim().replace(/^@+/, ""),
                          )
                        }
                        placeholder="deinname"
                        required
                        spellCheck={false}
                        value={values.instagram}
                      />
                    </span>
                    {renderFieldError("instagram")}
                  </label>
                  <label className="block text-sm font-semibold">
                    Was ist derzeit dein Beruf? *
                    <input
                      {...errorAriaProps("occupation")}
                      autoComplete="organization-title"
                      className={inputClassName("occupation")}
                      id={getId("field-occupation")}
                      maxLength={maxLengths.occupation}
                      name="occupation"
                      onChange={(event) =>
                        updateValue("occupation", event.target.value)
                      }
                      placeholder="Dein Beruf"
                      required
                      value={values.occupation}
                    />
                    {renderFieldError("occupation")}
                  </label>
                  <label className="block text-sm font-semibold sm:col-span-2">
                    Was ist dein Ziel mit Japanisch? *
                    <textarea
                      {...errorAriaProps("goal")}
                      className={`${inputClassName("goal")} min-h-28 resize-y`}
                      id={getId("field-goal")}
                      maxLength={maxLengths.goal}
                      name="goal"
                      onChange={(event) =>
                        updateValue("goal", event.target.value)
                      }
                      placeholder="Was möchtest du auf Japanisch erreichen?"
                      required
                      value={values.goal}
                    />
                    {renderFieldError("goal")}
                  </label>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-5">
                  <label className="block text-sm font-semibold">
                    Telefonnummer *
                    <span
                      className={`mt-2 flex min-h-12 overflow-hidden rounded-xl border-2 focus-within:border-[#f04498] focus-within:ring-2 focus-within:ring-[#f04498]/40 ${
                        hasFieldError("phone") ? "border-[#ff9a9a]" : "border-white"
                      }`}
                    >
                      <select
                        aria-label="Ländervorwahl"
                        className="max-w-36 border-r border-white/30 bg-[#030d1d] px-3 text-sm text-white outline-none"
                        id={getId("field-country-code")}
                        name="countryCode"
                        onChange={(event) =>
                          updateValue("countryCode", event.target.value)
                        }
                        required
                        value={values.countryCode}
                      >
                        <option value="+49">🇩🇪 +49</option>
                        <option value="+43">🇦🇹 +43</option>
                        <option value="+41">🇨🇭 +41</option>
                      </select>
                      <input
                        {...errorAriaProps("phone")}
                        autoComplete="tel-national"
                        className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/70"
                        id={getId("field-phone")}
                        maxLength={maxLengths.phone}
                        name="phone"
                        onChange={(event) =>
                          updateValue("phone", event.target.value)
                        }
                        pattern="[0-9 +()/.-]{6,}"
                        placeholder="151 12345678"
                        required
                        type="tel"
                        value={values.phone}
                      />
                    </span>
                    {renderFieldError("phone")}
                  </label>
                  <label className="block text-sm font-semibold">
                    E-Mail-Adresse *
                    <input
                      {...errorAriaProps("email")}
                      autoComplete="email"
                      className={inputClassName("email")}
                      id={getId("field-email")}
                      maxLength={maxLengths.email}
                      name="email"
                      onChange={(event) =>
                        updateValue("email", event.target.value)
                      }
                      placeholder="name@beispiel.de"
                      required
                      type="email"
                      value={values.email}
                    />
                    {renderFieldError("email")}
                  </label>
                  <label className="block text-sm font-semibold">
                    Was sollten wir vor dem Gespräch noch über dich wissen? *
                    <textarea
                      {...errorAriaProps("notes")}
                      className={`${inputClassName("notes")} min-h-36 resize-y`}
                      id={getId("field-notes")}
                      maxLength={maxLengths.notes}
                      name="notes"
                      onChange={(event) =>
                        updateValue("notes", event.target.value)
                      }
                      placeholder="Gibt es etwas, das für unser Gespräch wichtig ist?"
                      required
                      value={values.notes}
                    />
                    {renderFieldError("notes")}
                  </label>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-7">
                  <fieldset>
                    <legend className="mb-3 text-sm font-semibold">
                      Hast du mindestens 1.500 €, um in deinen
                      Fließend-Japanisch-Traum zu investieren? *
                    </legend>
                    <div className="grid grid-cols-2 gap-3">
                      {["Ja", "Nein"].map((answer, index) => (
                        <label className={shortChoiceClassName} key={answer}>
                          <input
                            {...errorAriaProps("investment")}
                            checked={values.investment === answer}
                            className="sr-only"
                            id={getId(`field-investment-${answer.toLowerCase()}`)}
                            name="investment"
                            onChange={(event) =>
                              updateValue("investment", event.target.value)
                            }
                            onKeyDown={handleRadioGroupKeyDown}
                            required
                            tabIndex={
                              values.investment === answer ||
                              (!values.investment && index === 0)
                                ? 0
                                : -1
                            }
                            type="radio"
                            value={answer}
                          />
                          {answer}
                        </label>
                      ))}
                    </div>
                    {renderFieldError("investment")}
                  </fieldset>
                  <fieldset>
                    <legend className="mb-3 text-sm font-semibold">
                      Kannst du in den nächsten 30 Tagen starten? *
                    </legend>
                    <div className="grid grid-cols-2 gap-3">
                      {["Ja", "Nein"].map((answer, index) => (
                        <label className={shortChoiceClassName} key={answer}>
                          <input
                            {...errorAriaProps("startSoon")}
                            checked={values.startSoon === answer}
                            className="sr-only"
                            id={getId(`field-start-soon-${answer.toLowerCase()}`)}
                            name="startSoon"
                            onChange={(event) =>
                              updateValue("startSoon", event.target.value)
                            }
                            onKeyDown={handleRadioGroupKeyDown}
                            required
                            tabIndex={
                              values.startSoon === answer ||
                              (!values.startSoon && index === 0)
                                ? 0
                                : -1
                            }
                            type="radio"
                            value={answer}
                          />
                          {answer}
                        </label>
                      ))}
                    </div>
                    {renderFieldError("startSoon")}
                  </fieldset>
                  </div>
                )}
              </div>

              {submitError && (
                <div
                  className="mt-6 rounded-xl border-2 border-[#ff9a9a] bg-[#401717] p-4 text-sm text-white"
                  role="alert"
                >
                  {submitError}
                </div>
              )}

              <div className="mt-8 flex items-center justify-between gap-4">
                {step > 0 ? (
                  <button
                    className="form-back-button min-h-11 cursor-pointer rounded-full border-2 border-white px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f04498] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSubmitting}
                    onClick={goToPreviousStep}
                    tabIndex={0}
                    type="button"
                  >
                    Zurück
                  </button>
                ) : (
                  <span />
                )}

                {/* Ein einziger Submit-Button für alle Schritte: so löst Enter
                    in einem Feld dieselbe Aktion aus (siehe handleFormSubmit). */}
                <button
                  aria-busy={isSubmitting}
                  className="cta-interactive min-h-11 cursor-pointer rounded-full cta-on-dark px-7 py-3 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f04498] disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={isSubmitting}
                  tabIndex={0}
                  type="submit"
                >
                  {step < steps.length - 1
                    ? "Weiter"
                    : isSubmitting
                      ? "Wird gesendet …"
                      : "Bewerbung abschicken"}
                </button>
              </div>

            </form>
          </div>
        </div>
        </RevealOnScroll>
        )}
      </div>
    </section>
  );
}
