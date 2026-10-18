import Image from "next/image";
import RevealOnScroll from "./RevealOnScroll";

const problems = [
  {
    title: "Du hast schon versucht, Japanisch mit Apps zu lernen?",
    text: "Du öffnest jeden Tag deine App, machst deine Lektionen und hast dir einen beachtlichen Streak aufgebaut. Doch sobald du die App schließt und selbst etwas sagen möchtest, wird es schwierig. Die passenden Wörter fehlen genau dann, wenn du sie brauchst.",
    image: "/problem_handy.jpg",
    imageAlt: "Kenji Tanaka lernt Japanisch mit seinem Smartphone",
    imageWidth: 2048,
    imageHeight: 1365,
    stickers: [
      { label: "280", icon: "flame" },
      { label: "10", icon: "bolt" },
    ],
    imageFirst: true,
  },
  {
    title: "Du weißt beim Japanischlernen nicht, wo du anfangen sollst?",
    text: "Hiragana, Katakana, Kanji, Vokabeln und Grammatik. Kaum hast du mit dem Lernen gestartet, wartet schon das nächste. Ohne klaren Weg verlierst du schnell den Überblick und die Motivation.",
    image: "/problem_grammatik.jpg",
    imageAlt: "Kenji Tanaka sucht am Computer nach Orientierung beim Japanischlernen",
    imageWidth: 2048,
    imageHeight: 1365,
    stickers: [
      { label: "Katakana?" },
      { label: "Hiragana?" },
      { label: "Kanji?" },
    ],
    imageFirst: false,
  },
  {
    title: "Du hast dich durch Lehrbücher gekämpft?",
    text: "Kapitel für Kapitel hast du Grammatik, Vokabeln und neue Kanji gelernt. Auf dem Papier funktioniert alles. Aber im echten Gespräch? Da fehlt dir der Mut, einfach loszureden.",
    image: "/Problem_buch.jpg",
    imageAlt: "Kenji Tanaka lernt Japanisch in einem Lehrbuch",
    imageWidth: 2048,
    imageHeight: 1366,
    stickers: [
      { label: "Rechts nach links?" },
      { label: "は...?が?" },
      { label: "N5, N4, N3..." },
    ],
    imageFirst: true,
  },
] as const;

type StickerIcon = "flame" | "bolt";

function Sticker({ label, icon }: { label: string; icon?: StickerIcon }) {
  return (
    <span className="flex items-center gap-1.5 rounded-lg bg-[#e7edff] px-3 py-1.5 text-sm font-bold text-[#06101f] shadow-sm sm:px-4 sm:py-2 sm:text-base">
      {icon === "flame" && (
        <svg
          aria-hidden="true"
          className="size-4 text-[#c50045]"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="M12.8 2.5c.5 3.1-1.2 4.4-2.5 6-1.2 1.5-1.8 2.8-1 4.2.5-1.5 1.5-2.3 2.6-3 0 2.2 2.6 3.5 2.6 6.2a4.5 4.5 0 0 1-9 0c0-2.6 1.1-4.5 3.2-6.8-.2 2.1.3 3.2 1.1 3.8C9.2 8.1 14.2 7.2 12.8 2.5Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
          />
        </svg>
      )}
      {icon === "bolt" && (
        <svg
          aria-hidden="true"
          className="size-4 text-[#c50045]"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="m13 2-9 12h7l-1 8 10-13h-7l0-7Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
          />
        </svg>
      )}
      {label}
    </span>
  );
}

function LearningImage({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  return (
    <Image
      alt={alt}
      className="h-auto w-full rounded-2xl"
      height={height}
      sizes="(min-width: 1024px) 320px, (min-width: 640px) 384px, 100vw"
      src={src}
      width={width}
    />
  );
}

function LearningVisual({
  problem,
}: {
  problem: (typeof problems)[number];
}) {
  const middleSticker = problem.stickers.length === 3 ? problem.stickers[1] : null;

  return (
    <div className="relative mx-auto w-full max-w-80 sm:max-w-96 lg:max-w-80">
      <LearningImage
        alt={problem.imageAlt}
        height={problem.imageHeight}
        src={problem.image}
        width={problem.imageWidth}
      />
      <div className="absolute -left-2 -top-3 rotate-[-12deg] sm:-left-3 sm:-top-4">
        <Sticker {...problem.stickers[0]} />
      </div>
      <div className="absolute -bottom-3 -right-2 rotate-[10deg] sm:-bottom-4 sm:-right-3">
        <Sticker {...problem.stickers[problem.stickers.length - 1]} />
      </div>
      {middleSticker && (
        <div className="absolute -right-2 -top-3 rotate-[12deg] sm:-right-4 sm:-top-4">
          <Sticker {...middleSticker} />
        </div>
      )}
    </div>
  );
}

export default function Problem() {
  return (
    <section aria-labelledby="problem-title" className="bg-transparent" id="problem">
      <div
        aria-hidden="true"
        className="relative -my-0.5 h-[clamp(2rem,6vw,5rem)]"
      >
        <Image
          alt=""
          className="object-fill scale-y-[1.05]"
          fill
          sizes="100vw"
          src="/Wave%20Divider/wavesOpacity.svg"
          style={{ transform: "scaleY(-1.05)" }}
        />
      </div>

      <div className="bg-[#030d1d] px-6 pb-14 pt-5 text-white sm:px-10 sm:pb-20 lg:px-14 lg:pb-24 lg:pt-7">
        <div className="mx-auto max-w-[1440px]">
          <RevealOnScroll className="mx-auto max-w-3xl text-center">
            <h2
              className="font-serif text-2xl font-black uppercase leading-tight sm:text-3xl lg:text-[2.5rem]"
              id="problem-title"
            >
              Möchtest du endlich Japanisch sprechen?
            </h2>
            <p className="mx-auto mt-3 max-w-5xl text-sm leading-relaxed text-white/80 sm:text-base lg:text-[1.125rem]">
              Vielleicht versuchst du schon eine ganze Weile, Japanisch zu
              lernen. Du hast YouTube-Videos geschaut, Apps genutzt und dir
              Lehrbücher gekauft. Doch dann spricht dich jemand auf Japanisch
              an und plötzlich ist dein Kopf leer. Kein einziges Wort fällt dir
              mehr ein.
            </p>
          </RevealOnScroll>

          <div className="mx-auto mt-9 max-w-[1200px] space-y-12 sm:mt-10 sm:space-y-16">
            {problems.map((problem, index) => (
              <RevealOnScroll delay={index * 100} key={problem.title}>
                <article
                  className={`grid items-center gap-x-8 gap-y-8 lg:gap-x-16 lg:justify-center ${
                    problem.imageFirst
                      ? "lg:grid-cols-[320px_400px]"
                      : "lg:grid-cols-[400px_320px]"
                  }`}
                >
                  <div
                    className={
                      problem.imageFirst
                        ? "lg:order-first"
                        : "lg:order-last"
                    }
                  >
                    <LearningVisual problem={problem} />
                  </div>
                  <div
                    className={`mx-auto w-full max-w-none lg:max-w-100 ${
                      problem.imageFirst
                        ? "lg:order-last"
                        : "lg:order-first"
                    }`}
                  >
                    <h3 className="font-serif text-base font-bold leading-snug sm:text-lg lg:text-[1.5rem]">
                      {problem.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/80 sm:text-base lg:text-[1.125rem]">
                      {problem.text}
                    </p>
                  </div>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="relative -my-0.5 h-[clamp(3rem,7vw,6rem)] bg-[#faeee6]"
      >
        <Image
          alt=""
          className="object-fill scale-y-[1.05]"
          fill
          sizes="100vw"
          src="/Wave%20Divider/waves2.svg"
        />
      </div>
    </section>
  );
}
