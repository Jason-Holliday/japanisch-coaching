"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import MultiStepFormular from "./MultiStepFormular";

export default function ModalDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const previousOverflowRef = useRef<string | null>(null);
  // Wurde der Dialog mit Maus/Touch geschlossen? Dann bekommt der auslösende
  // Button den Fokus zurück, aber ohne sichtbaren Fokusring.
  const closedByPointerRef = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function openModalDialog(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;

      // Alle "Jetzt bewerben"-Buttons tragen data-open-application.
      const trigger = event.target.closest<HTMLElement>(
        "[data-open-application]",
      );
      const activeDialog = dialogRef.current;
      if (!trigger || !activeDialog || activeDialog.open) return;

      event.preventDefault();
      openerRef.current = trigger;
      previousOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      activeDialog.showModal();
      activeDialog
        .querySelector<HTMLElement>("#bewerbung-dialog-title")
        ?.focus({ preventScroll: true });
    }

    document.addEventListener("click", openModalDialog);

    return () => {
      document.removeEventListener("click", openModalDialog);
      if (dialog.open) dialog.close();

      if (previousOverflowRef.current !== null) {
        document.body.style.overflow = previousOverflowRef.current;
        previousOverflowRef.current = null;
      }
    };
  }, []);

  function handleClose() {
    if (previousOverflowRef.current !== null) {
      document.body.style.overflow = previousOverflowRef.current;
      previousOverflowRef.current = null;
    }

    const opener = openerRef.current;
    openerRef.current = null;
    if (!opener) return;

    if (closedByPointerRef.current) {
      // data-pointer-focus blendet den Ring per CSS aus (globals.css), bis
      // der Fokus wandert oder eine Taste gedrückt wird.
      opener.setAttribute("data-pointer-focus", "");
      const clear = () => {
        opener.removeAttribute("data-pointer-focus");
        opener.removeEventListener("blur", clear);
        opener.removeEventListener("keydown", clear);
      };
      opener.addEventListener("blur", clear);
      opener.addEventListener("keydown", clear);
      opener.focus({ focusVisible: false } as FocusOptions);
    } else {
      opener.focus();
    }
    closedByPointerRef.current = false;
  }

  function closeDialog(byPointer: boolean) {
    const dialog = dialogRef.current;
    if (!dialog?.open) return;

    closedByPointerRef.current = byPointer;
    dialog.close();
    handleClose();
  }

  return (
    <dialog
      aria-labelledby="bewerbung-dialog-title"
      aria-modal="true"
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-6xl overflow-y-auto overscroll-contain rounded-3xl bg-[#030d1d] p-0 text-white shadow-2xl backdrop:bg-black/75"
      onCancel={(event) => {
        event.preventDefault();
        closeDialog(false);
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          closeDialog(true);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") closeDialog(false);
      }}
      id="bewerbung-dialog"
      onClose={handleClose}
      ref={dialogRef}
    >
      {/* h1, weil der modale Dialog den Rest der Seite überlagert und für
          Screenreader ein eigener Bereich mit eigener Hauptüberschrift ist. */}
      <h1
        className="sr-only"
        id="bewerbung-dialog-title"
        tabIndex={-1}
      >
        Bewerbungsformular
      </h1>
      <div className="sticky top-0 z-20 flex justify-end bg-[#030d1d]/95 px-4 py-3 backdrop-blur">
        <button
          aria-label="Dialog schließen"
          className="cta-interactive inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-[#030d1d] px-4 py-2 text-sm font-semibold text-white shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          // detail > 0: echter Maus-/Touch-Klick; 0: per Enter/Leertaste ausgelöst.
          onClick={(event) => closeDialog(event.detail > 0)}
          tabIndex={0}
          type="button"
        >
          <X aria-hidden="true" className="size-5" />
          Schließen
        </button>
      </div>
      <MultiStepFormular
        idPrefix="bewerbung-dialog"
        sectionId="bewerbung-dialog-form"
      />
    </dialog>
  );
}
