import Image from "next/image";
import {
  BriefcaseBusiness,
  GraduationCap,
  Languages,
  MessagesSquare,
} from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";

// Kurzfakten unter dem Vorstellungstext - passend zur Geschichte im Text.
const facts = [
  {
    icon: GraduationCap,
    title: "Studium in Osaka",
    text: "Ich bin als Japaner in Deutschland aufgewachsen und später nach Japan gezogen. In Osaka habe ich dann Japanisch studiert.",
  },
  {
    icon: MessagesSquare,
    title: "Alltagsjapanisch",
    text: "Ich bringe dir modernes Japanisch bei, so wie es heute im Alltag wirklich gesprochen wird.",
  },
  {
    icon: Languages,
    title: "Erklärt auf Deutsch",
    text: "Bei mir lernst du alles auf Deutsch, ohne den Umweg über Englisch. So verstehst du jede Erklärung sofort.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Für Berufstätige",
    text: "Mein System passt sich deinem Job an, damit du auch mit wenig Zeit gut vorankommst.",
  },
];

const socialAccounts = [
  { name: "Instagram", followers: "22.8K" },
  { name: "TikTok", followers: "28K" },
  { name: "YouTube", followers: "15.4K" },
];

export default function About() {
  return (
    <section
      aria-labelledby="about-title"
      className="bg-[#030d1d] px-6 py-14 text-white sm:px-10 sm:py-20 lg:px-14 lg:py-24"
      id="ueber-kenji"
    >
      <div className="mx-auto grid max-w-360 gap-8 lg:grid-cols-[1fr_1fr] lg:items-stretch lg:gap-6">
        <RevealOnScroll className="h-full">
          <div className="relative aspect-[648/757] w-full overflow-hidden rounded-[1.75rem]">
            <Image
              alt="Kenji Tanaka in Osaka"
              className="object-cover object-center"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              src="/about.jpg"
            />
          </div>
        </RevealOnScroll>

        <RevealOnScroll
          className="flex flex-col justify-center lg:h-full lg:justify-between lg:py-2"
          delay={100}
        >
          <div>
            <h2
              className="font-serif text-3xl font-black uppercase leading-tight sm:text-4xl lg:text-[2.5rem]"
              id="about-title"
            >
              Hallo, ich bin <span className="text-[#f04498]">Kenji Tanaka</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/90 sm:text-base">
              Ich weiß, wie es ist, Japanisch neben dem Alltag zu lernen. Ich
              habe selbst mit Lehrbüchern angefangen, Vokabeln gepaukt und
              Grammatik Kapitel für Kapitel durchgearbeitet. Irgendwann habe ich
              gemerkt, dass Wissen allein nicht reicht. Ich kannte viele Regeln,
              aber in einem echten Gespräch fehlten mir trotzdem die Worte. Erst
              mein Studium in Osaka hat mir gezeigt, wie Menschen dort wirklich
              sprechen. Im Alltag, beim Einkaufen, unter Freunden und im Beruf
              klingt Japanisch oft ganz anders als im Lehrbuch. Genau dort habe
              ich gelernt, worauf es beim Sprechen wirklich ankommt. Dieses
              moderne, alltagstaugliche Japanisch gebe ich heute an Berufstätige
              weiter. Mit einem klaren System, das in deinen Alltag passt, damit
              du nicht nur Japanisch lernst, sondern es endlich auch sprichst.
            </p>
          </div>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:my-8">
            {facts.map((fact) => (
              <li
                className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5"
                key={fact.title}
              >
                <div className="flex items-center gap-3">
                  <fact.icon
                    aria-hidden="true"
                    className="size-6 shrink-0 text-[#f04498]"
                    strokeWidth={1.7}
                  />
                  <h3 className="font-serif text-sm font-bold uppercase leading-snug">
                    {fact.title}
                  </h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  {fact.text}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:mt-0">
            {socialAccounts.map((account) => (
              <div
                className="flex min-h-20 items-center justify-center gap-3 rounded-2xl bg-[#e8eeff] px-3 py-3 text-[#030d1d]"
                key={account.name}
              >
                {account.name === "Instagram" ? (
                  <svg
                    aria-hidden="true"
                    className="size-9 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    viewBox="0 0 24 24"
                  >
                    <rect height="17" rx="5" width="17" x="3.5" y="3.5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.8" cy="6.5" fill="currentColor" r="1" />
                  </svg>
                ) : account.name === "YouTube" ? (
                  <svg
                    aria-hidden="true"
                    className="size-9 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
                  </svg>
                ) : (
                  <svg
                    aria-hidden="true"
                    className="size-9 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.6 7.2a5.2 5.2 0 0 1-3.7-3.7V3h-3.5v12.1a2.5 2.5 0 1 1-2.5-2.5c.3 0 .6 0 .8.1V9.1a6 6 0 1 0 5.2 6V9a8.7 8.7 0 0 0 5.1 1.6V7.1c-.5.1-.9.1-1.4.1Z" />
                  </svg>
                )}
                <span className="text-center">
                  <span className="block text-xl font-bold leading-tight">
                    {account.followers}
                  </span>
                  <span className="mt-1 block text-xs uppercase">Follower</span>
                </span>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
