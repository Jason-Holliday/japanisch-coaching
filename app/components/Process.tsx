import { ClipboardPen, MessagesSquare, PhoneCall } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";

const steps = [
  {
    number: "01",
    title: "Bewerbung",
    icon: ClipboardPen,
    description:
      "Du füllst das kurze Formular aus. Das dauert keine 2 Minuten.",
  },
  {
    number: "02",
    title: "Telefonat",
    icon: PhoneCall,
    description:
      "Ich melde mich innerhalb von 24 Stunden. Im kostenlosen Gespräch schauen wir, wo du stehst und ob das Programm zu dir passt.",
  },
  {
    number: "03",
    title: "Endlich Japanisch sprechen",
    icon: MessagesSquare,
    description:
      "Wir legen in deiner 1:1-Start-Session los. Du lernst, frei Japanisch zu sprechen, und siehst schon in der ersten Woche Ergebnisse.",
  },
];

export default function Process() {
  return (
    <section
      aria-labelledby="process-title"
      className="bg-[#030d1d] px-6 py-16 text-white sm:px-10 sm:py-20 lg:px-14 lg:py-24"
      id="ablauf"
    >
      <div className="mx-auto max-w-360">
        <RevealOnScroll className="mx-auto max-w-3xl text-center">
          <h2
            className="font-serif text-[clamp(1.25rem,6vw,2.25rem)] font-black uppercase leading-tight sm:text-4xl lg:text-[2.5rem]"
            id="process-title"
          >
            Ich freue mich darauf, dich kennenzulernen!
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            Du bist nur 3 kleine Schritte davon entfernt, endlich Japanisch
            sprechen zu lernen:
          </p>
        </RevealOnScroll>

        <div className="mt-10 grid gap-4 lg:mt-14 lg:gap-6 xl:grid-cols-3">
          {steps.map((step, index) => (
            <RevealOnScroll
              className="h-full"
              delay={index * 100}
              key={step.number}
            >
              <article className="h-full rounded-4xl bg-[#e8eeff] p-6 text-[#030d1d] sm:p-8">
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-black leading-none sm:text-6xl">
                    {step.number}
                  </span>
                  <h3 className="min-w-0 flex-1 font-serif text-lg font-black uppercase leading-tight sm:text-xl">
                    {step.title}
                  </h3>
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#b00045] text-white sm:size-14">
                    <step.icon
                      aria-hidden="true"
                      className="size-6 sm:size-7"
                      strokeWidth={1.8}
                    />
                  </span>
                </div>
                <p className="mt-5 text-base leading-relaxed sm:text-lg">
                  {step.description}
                </p>
              </article>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll className="mt-9 text-center">
          <button
            aria-controls="bewerbung-dialog"
            aria-haspopup="dialog"
            className="cta-pulse cursor-pointer cta-interactive inline-flex min-h-13 items-center justify-center rounded-full cta-on-dark px-6 py-3 text-center text-sm font-bold uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f04498] sm:px-7"
            data-open-application
            tabIndex={0}
            type="button"
          >
            <span className="link-label-underline">Jetzt bewerben</span>
          </button>
        </RevealOnScroll>
      </div>
    </section>
  );
}
