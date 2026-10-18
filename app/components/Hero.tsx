import Image from "next/image";
import { CircleCheckBig } from "lucide-react";
import FallingPetals from "./FallingPetals";

const benefits = [
  "Klare Lernpläne für Anfänger und Fortgeschrittene",
  "Effektive Methoden für Vokabeln und Grammatik",
  "Praktische Tipps, um Japanisch wirklich anzuwenden",
];

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="hero-sticky relative z-0 overflow-hidden bg-[#faeee6] text-[#06101f]"
      id="start"
    >
      <FallingPetals />
      <div className="relative z-10 mx-auto grid max-w-[1440px] items-center gap-10 px-6 py-12 sm:px-10 sm:py-16 lg:min-h-[calc(100svh-4.75rem)] lg:grid-cols-[1.2fr_0.8fr] lg:gap-8 lg:px-14 lg:py-12">
        <div className="relative z-10 min-w-0">
          <div className="hero-heading-enter">
            <h1
              className="break-normal font-serif text-[clamp(1.5rem,8vw,4rem)] font-black uppercase leading-[1.05] tracking-tight lg:text-[3.5rem] xl:text-[4rem]"
              id="hero-title"
            >
              Japanisch lernen für
              <span className="mt-2 block text-[#b00045]">Berufstätige</span>
            </h1>
          </div>

          <div>
            <p className="hero-description-enter mt-8 max-w-108 text-base leading-snug sm:mt-12 sm:text-lg">
              Für Berufstätige mit vollem Terminkalender, die endlich 10+ Minuten frei
              Japanisch SPRECHEN wollen, um tiefere Verbindungen mit Japan
              aufzubauen.
            </p>
          </div>

          <div>
            <ul className="mt-8 space-y-3 sm:mt-12">
              {benefits.map((benefit, index) => (
                <li
                  className="hero-benefit-enter flex items-start gap-3 text-sm sm:text-base"
                  key={benefit}
                  style={{ animationDelay: `${200 + index * 100}ms` }}
                >
                  <CircleCheckBig
                    aria-hidden="true"
                    className="mt-0.5 size-6 shrink-0 text-[#c50045]"
                    strokeWidth={1.7}
                  />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="hero-cta-enter">
            <button
              aria-controls="bewerbung-dialog"
              aria-haspopup="dialog"
              className="cta-pulse cursor-pointer cta-interactive mt-9 inline-flex min-h-13 items-center justify-center rounded-full bg-[#b00045] px-6 py-3 text-center text-sm font-bold uppercase text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b00045] sm:mt-14 sm:px-7 sm:text-base"
              data-open-application
              tabIndex={0}
              type="button"
            >
              <span className="link-label-underline">Jetzt bewerben</span>
            </button>
            <p className="mt-3 max-w-72 text-sm font-medium leading-snug text-[#06101f]/75">
              Bereits 97+ Berufstätigen geholfen,
              <br />
              Japanisch in ihren Alltag zu integrieren.
            </p>
          </div>
        </div>

        <div className="hero-art-enter">
          <div className="relative mx-auto flex w-full max-w-104 translate-x-8 items-center justify-center pr-8 sm:translate-x-0 sm:pr-10 lg:max-w-none">
            <div className="relative aspect-square w-full max-w-104 lg:max-w-none">
              <div
                aria-hidden="true"
                className="hero-blossom-spin absolute inset-0 scale-[1.05] -translate-x-8 bg-[#b00045] sm:scale-[1.2] sm:-translate-x-12 lg:-translate-x-20"
                style={{
                  maskImage: "url('/cherry-blossom.svg')",
                  maskPosition: "center",
                  maskRepeat: "no-repeat",
                  maskSize: "contain",
                  WebkitMaskImage: "url('/cherry-blossom.svg')",
                  WebkitMaskPosition: "center",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskSize: "contain",
                }}
              />
              <Image
                alt="Japanischlehrer Kenji Tanaka als freigestelltes Porträt"
                className="absolute left-1/2 top-[45%] z-10 h-auto w-[50%] -translate-x-[calc(50%+2rem)] -translate-y-1/2 object-contain sm:w-[56%] sm:-translate-x-[calc(50%+3rem)] lg:-translate-x-[calc(50%+5rem)]"
                priority
                sizes="(min-width: 1024px) 40vw, (min-width: 640px) 70vw, 90vw"
                src="/hero-kenji-rot.png"
                height={1230}
                width={1279}
              />
            </div>

            <p
              className="absolute right-7 top-1/2 block -translate-y-1/2 whitespace-nowrap text-xs font-bold tracking-[0.25em] text-[#06101f] [writing-mode:vertical-rl] sm:right-0 sm:text-lg sm:tracking-[0.5em]"
              lang="ja"
            >
              {/* Für Screenreader als ganzes Wort; die animierten Einzelzeichen sind ausgeblendet. */}
              <span className="sr-only">田中健二</span>
              {Array.from("田中健二").map((character, index) => (
                <span
                  aria-hidden="true"
                  className="hero-japanese-character"
                  key={`${character}-${index}`}
                  style={{ animationDelay: `${100 + index * 100}ms` }}
                >
                  {character}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
