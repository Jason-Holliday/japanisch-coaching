import {
  BookOpenText,
  CalendarDays,
  Files,
  Headset,
  Layers3,
  MessageCircle,
  UsersRound,
  Video,
} from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";

export default function Service() {
  const services = [
    {
      icon: CalendarDays,
      title: "1:1 Coaching",
      text: "Wir setzen uns gemeinsam zusammen und ich bringe dir persönlich Japanisch bei, abgestimmt auf dein Level, deine Ziele und deinen Alltag.",
    },
    {
      icon: Video,
      title: "Live-Sessions",
      text: "Jede Woche setzen wir uns online zusammen, lernen gemeinsam und klären deine Fragen.",
    },
    {
      icon: MessageCircle,
      title: "Sprech-Sessions",
      text: "In kleiner Runde führst du echte Gespräche auf Japanisch, damit dir das Sprechen Schritt für Schritt immer leichter fällt.",
    },
    {
      title: "24/7 Support",
      icon: Headset,
      text: "Taucht beim Lernen eine Frage auf, kannst du sie jederzeit stellen und ich antworte dir so schnell wie möglich. Zusätzlich hilft dir auch die Community gern weiter.",
    },
    {
      icon: UsersRound,
      title: "Community",
      text: "Du wirst Teil einer Gruppe von Berufstätigen, die ebenfalls mit mir lernen. Dort tauscht ihr euch zum Beispiel per WhatsApp aus und motiviert euch gegenseitig.",
    },
    {
      icon: Layers3,
      title: "Vokabeldecks",
      text: "Du bekommst sorgfältig ausgewählte Vokabeldecks mit modernem Japanisch, so wie es im Alltag in Japan wirklich gesprochen wird.",
    },
    {
      icon: BookOpenText,
      title: "Grammatik-Guide",
      text: "Ich erkläre dir die Grammatik verständlich auf Deutsch, damit du sie direkt anwenden kannst und dich nicht durch trockene Lehrbücher kämpfen musst.",
    },
    {
      icon: Files,
      title: "Materialien",
      text: "Alle Materialien, die du zum Lernen brauchst, stelle ich dir zur Verfügung. Du musst also nichts selbst zusammensuchen und kannst direkt loslegen.",
    },
  ];

  return (
    <section
      aria-labelledby="services-title"
      className="-mt-px bg-[#faeee6] px-6 py-16 text-[#06101f] sm:px-10 sm:py-20 lg:px-14 lg:py-24"
      id="leistungen"
    >
      <div className="mx-auto max-w-360">
        <RevealOnScroll className="mx-auto max-w-2xl text-center">
          <h2
            className="mt-3 font-serif text-3xl font-black leading-tight sm:text-4xl lg:text-[2.5rem]"
            id="services-title"
          >
            Das bekommst du im Programm
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#06101f]/75 sm:text-lg">
            Lerne echtes japanisch zu Sprechen mit einem klaren Lernplan,
            persönlicher Begleitung und allen Materlialien, die du brauchst.
          </p>
        </RevealOnScroll>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 md:mt-14 lg:grid-cols-4 lg:gap-4">
          {services.map((service, index) => (
            <RevealOnScroll
              className="h-full"
              delay={index * 100}
              key={service.title}
            >
              <article className="h-full min-h-40 rounded-2xl bg-[#030d1d] p-5 text-white sm:min-h-44 sm:p-6">
                <div className="flex items-center gap-3">
                  <service.icon
                    aria-hidden="true"
                    className="size-6 shrink-0 text-[#f04498]"
                    strokeWidth={1.7}
                  />
                  <h3 className="min-w-0 font-serif text-sm font-bold uppercase leading-snug">
                    {service.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/80">
                  {service.text}
                </p>
              </article>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll className="mt-8 text-center" delay={100}>
          <button
            aria-controls="bewerbung-dialog"
            aria-haspopup="dialog"
            className="cta-pulse cursor-pointer cta-interactive inline-flex min-h-13 items-center justify-center rounded-full bg-[#b00045] px-6 py-3 text-center text-sm font-bold uppercase text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b00045] sm:px-7"
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
