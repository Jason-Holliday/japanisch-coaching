import Image from "next/image";
import { CircleCheckBig, Star } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";

// Kundenstimme aus References.tsx - bei Aenderungen dort hier mitpflegen.
const highlightedReview = {
  name: "Nicole K.",
  rating: 5,
  review: "Nach 3 Büchern und 10 Apps kein Wort – in 10 Wochen gesprächsfähig.",
};

const benefits = [
  "Lernzeiten, die neben deinem Job funktionieren",
  "Klarer Lernweg statt planlosem Lernen",
  "Verständliche Erklärungen auf Deutsch – ohne Englisch als Umweg",
  "Japanisch lernen ohne App-Chaos",
];

const systemImages = [
  {
    src: "/japanisch-system-1.jpg",
    alt: "Eine fröhliche Gruppe junger Menschen in einem Park in Japan",
  },
  {
    src: "/japanisch-system-2.jpg",
    alt: "Eine Frau lernt lächelnd am Laptop",
  },
  {
    src: "/japanisch-system-3.jpg",
    alt: "Zwei Personen unterhalten sich in einem Café",
  },
];

export default function Solution() {
  return (
    <section
      aria-labelledby="solution-title"
      className="bg-[#faeee6] px-6 py-16 text-[#06101f] sm:px-10 sm:py-20 lg:px-14 lg:py-24"
      id="loesung"
    >
      <div className="mx-auto max-w-360">
        <RevealOnScroll className="mx-auto max-w-3xl text-center">
          <h2
            className="font-serif text-3xl font-black uppercase leading-tight sm:text-4xl lg:text-[2.5rem]"
            id="solution-title"
          >
            Lerne Japanisch mit System
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#06101f]/75 sm:text-lg">
            Kein Chaos mehr. Ein klarer Weg bis zum ersten Gespräch.
          </p>
        </RevealOnScroll>

        <div className="mt-8 grid items-center gap-8 sm:mt-12 lg:grid-cols-2 lg:gap-16">
          <RevealOnScroll>
            <div className="flex flex-col">
              <div className="space-y-4 text-sm leading-relaxed sm:text-base">
                <p>
                  Das Problem ist selten fehlende Motivation. Oft fehlt die
                  Struktur. Wer neben dem Job lernt, hat wenig Zeit und fragt
                  sich schnell, womit er anfangen soll.
                </p>
                <p>
                  Gemeinsam implementieren wir ein System, das zu deinem Alltag
                  passt: mit einem bewährten Plan, dem du folgen kannst und der
                  dir zeigt, was du lernst und warum. Kein App-Chaos, kein Raten,
                  sondern ein klarer Weg zum Sprechen.
                </p>
              </div>

              <ul className="mt-6 space-y-4">
                {benefits.map((benefit, index) => (
                  <RevealOnScroll
                    as="li"
                    className="flex items-start gap-3 text-sm leading-relaxed sm:text-base"
                    key={benefit}
                    delay={index * 100}
                  >
                    <CircleCheckBig
                      aria-hidden="true"
                      className="mt-0.5 size-6 shrink-0 text-[#b00045]"
                      strokeWidth={2}
                    />
                    <span>{benefit}</span>
                  </RevealOnScroll>
                ))}
              </ul>

              <RevealOnScroll className="mt-8" delay={400}>
                <figure className="rounded-3xl bg-[#030d1d] px-6 py-6 text-white sm:px-7">
                  <div
                    aria-label={`${highlightedReview.rating} von 5 Sternen`}
                    className="flex gap-1 text-[#f04498]"
                    role="img"
                  >
                    {Array.from(
                      { length: highlightedReview.rating },
                      (_, starIndex) => (
                        <Star
                          aria-hidden="true"
                          className="size-5"
                          key={starIndex}
                          strokeWidth={1.8}
                        />
                      ),
                    )}
                  </div>
                  <blockquote className="mt-3 text-sm leading-relaxed text-white/95 sm:text-base">
                    „{highlightedReview.review}“
                  </blockquote>
                  <figcaption className="mt-3 font-serif text-base font-bold uppercase">
                    {highlightedReview.name}
                  </figcaption>
                </figure>
              </RevealOnScroll>

              <button
                aria-controls="bewerbung-dialog"
                aria-haspopup="dialog"
                className="cta-pulse cursor-pointer cta-interactive mt-8 inline-flex min-h-13 w-fit items-center justify-center rounded-full bg-[#b00045] px-6 py-3 text-center text-sm font-bold uppercase text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b00045] sm:px-7"
                data-open-application
                tabIndex={0}
                type="button"
              >
                <span className="link-label-underline">Jetzt bewerben</span>
              </button>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={100}>
            <div className="mx-auto grid w-full max-w-xl grid-cols-2 gap-3 sm:gap-4">
              {systemImages.map((image, index) => (
                <div
                  className={`relative overflow-hidden rounded-3xl ${
                    index === 0 ? "col-span-2 aspect-3/2" : "aspect-square"
                  }`}
                  key={image.src}
                >
                  <Image
                    alt={image.alt}
                    className="object-cover object-center"
                    fill
                    sizes={
                      index === 0
                        ? "(min-width: 1024px) 36rem, 100vw"
                        : "(min-width: 1024px) 18rem, 50vw"
                    }
                    src={image.src}
                  />
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
