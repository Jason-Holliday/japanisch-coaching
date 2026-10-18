import { Star } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";

export default function References() {
  const clients = [
    {
      name: "Anthony F.",
      rating: "5",
      review:
        "Von 1,5 Jahren Duolingo-Frust nach 10 Wochen zu seinem ersten freien 20-Minuten-Gespräch trotz eigenem Unternehmen.",
    },
    {
      name: "Corina L.",
      rating: "5",
      review: "Von komplett 0 in 8 Wochen zu ihrem ersten Gespräch.",
    },
    {
      name: "Sonja H.",
      rating: "5",
      review:
        "Aus „einfach nur hören“ wurde Verstehen – Lieblingssongs ergeben plötzlich Sinn.",
    },
    {
      name: "Conny M.",
      rating: "5",
      review:
        "Von 1 Jahr Selbststudium mit Büchern aber 0 Gesprächsskills zu 15 Minuten Gesprächen komplett auf Japanisch trotz eigenem Unternehmen und 4-jährigem Kind.",
    },
    {
      name: "Janine F.",
      rating: "5",
      review:
        "Davor 2 Jahre VHS: Nach 8 Wochen mehr gelernt als 2 Jahre VHS und nach 4 Monaten 20 Minuten Gespräche komplett auf Japanisch.",
    },
    {
      name: "Janine F.",
      rating: "5",
      review:
        "Von 2 Jahren Duolingo zum ersten freien Gespräch mit der japanischen Kochlehrerin.",
    },
    {
      name: "Nicole K.",
      rating: "5",
      review:
        "Nach 3 Büchern und 10 Apps kein Wort – in 10 Wochen gesprächsfähig.",
    },
    {
      name: "Khodr C.",
      rating: "5",
      review:
        "Davor VHS und andere Lehrer, aber konnte keine Konversation führen. Nach 4 Monaten Programm sind 20 Minuten freie Gespräche möglich, trotz Vollzeitjob als Arzt mit 2 Praxen.",
    },
    {
      name: "Pascal D.",
      rating: "5",
      review:
        "Von Hiragana lesen zur besten Japan-Reise seines Lebens – Gespräche im Izakaya.",
    },
  ];
  return (
    <section
      aria-labelledby="references-title"
      className="bg-[#faeee6] px-6 py-16 text-[#06101f] sm:px-10 sm:py-20 lg:px-14 lg:py-24"
      id="referenzen"
    >
      <div className="mx-auto max-w-360">
        <RevealOnScroll>
          <h2
            className="text-center font-serif text-3xl font-black uppercase leading-tight sm:text-4xl lg:text-[2.5rem]"
            id="references-title"
          >
            Das sagen meine Klienten
          </h2>
        </RevealOnScroll>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {clients.map((client, clientIndex) => (
            <RevealOnScroll
              className="h-full"
              delay={clientIndex * 100}
              key={`${client.name}-${clientIndex}`}
            >
              <article className="flex h-full min-h-72 flex-col rounded-4xl bg-[#030d1d] px-7 py-8 text-white sm:px-8">
                <h3 className="text-center font-serif text-2xl font-bold uppercase">
                  {client.name}
                </h3>
                <div
                  aria-label={`${client.rating} von 5 Sternen`}
                  className="mt-3 flex justify-center gap-1 text-[#f04498]"
                  role="img"
                >
                  {Array.from(
                    { length: Number(client.rating) },
                    (_, starIndex) => (
                      <Star
                        aria-hidden="true"
                        className="size-8"
                        key={starIndex}
                        strokeWidth={1.8}
                      />
                    ),
                  )}
                </div>
                <div className="my-5 border-t border-white/80" />
                <p className="text-base leading-relaxed text-white/95 sm:text-lg">
                  {client.review}
                </p>
              </article>
            </RevealOnScroll>
          ))}
        </div>
        <RevealOnScroll className="mt-10 text-center">
          <button
            aria-controls="bewerbung-dialog"
            aria-haspopup="dialog"
            className="cta-pulse cursor-pointer cta-interactive inline-flex min-h-11 items-center justify-center rounded-full bg-[#b00045] px-6 py-3 text-center text-xs font-bold uppercase text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b00045]"
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
