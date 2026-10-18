import type { Metadata } from "next";
import Link from "next/link";
import FallingPetals from "./components/FallingPetals";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Seite nicht gefunden | Kenji Tanaka",
};

const helpfulLinks = [
  { label: "Über Kenji", href: "/#ueber-kenji" },
  { label: "Leistungen", href: "/#leistungen" },
  { label: "Ablauf", href: "/#ablauf" },
  { label: "Häufige Fragen", href: "/#faq" },
];

const textLinkClassName =
  "relative inline-block font-semibold text-[#b00045] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:content-[''] hover:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b00045] focus-visible:after:scale-x-100 motion-reduce:after:transition-none";

export default function NotFound() {
  return (
    <>
      <main
        className="relative isolate flex min-h-svh items-center overflow-hidden bg-[#faeee6] px-6 py-16 text-[#06101f] sm:px-10 lg:px-14"
        id="main-content"
      >
        <FallingPetals />
        <div className="relative z-10 mx-auto grid w-full max-w-[1440px] items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-8">
          <div className="hero-art-enter order-first lg:order-last">
            <div className="relative mx-auto aspect-square w-full max-w-80 sm:max-w-104">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[#b00045]"
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
              <p
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center font-serif text-[clamp(5rem,24vw,10rem)] font-black leading-none tracking-tight text-[#06101f] [text-shadow:0_0_28px_#faeee6,0_0_8px_#faeee6]"
              >
                404
              </p>
            </div>
          </div>

          <div className="min-w-0 text-center lg:text-left">
            <div className="hero-heading-enter">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#b00045]">
                Fehler 404
              </p>
              <h1 className="mt-4 font-serif text-[clamp(1.75rem,7vw,3.5rem)] font-black uppercase leading-[1.05] tracking-tight">
                Seite nicht
                <span className="mt-2 block text-[#b00045]">gefunden</span>
              </h1>
            </div>

            <p className="hero-description-enter mx-auto mt-8 max-w-120 text-base leading-snug sm:text-lg lg:mx-0">
              Entschuldige, die aufgerufene Seite existiert nicht oder wurde
              verschoben. Vielleicht hat sich ein Tippfehler in die Adresse
              eingeschlichen oder der Link ist nicht mehr aktuell.
            </p>

            <div className="hero-cta-enter mt-10">
              <Link
                className="cta-interactive inline-flex min-h-13 items-center justify-center rounded-full bg-[#b00045] px-7 py-3 text-center text-sm font-bold uppercase text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b00045] sm:text-base"
                href="/"
                tabIndex={0}
              >
                <span className="link-label-underline">Zur Startseite</span>
              </Link>
            </div>

            <nav
              aria-labelledby="not-found-links-title"
              className="hero-cta-enter mt-12 border-t border-[#b00045]/30 pt-8"
            >
              <h2
                className="text-sm font-bold uppercase tracking-[0.15em]"
                id="not-found-links-title"
              >
                Vielleicht suchst du
              </h2>
              <ul className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm sm:text-base lg:justify-start">
                {helpfulLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      className={textLinkClassName}
                      href={link.href}
                      tabIndex={0}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm leading-relaxed text-[#06101f]/80 sm:text-base">
                Du hast eine Frage oder möchtest direkt starten?{" "}
                <Link
                  className={textLinkClassName}
                  href="/#bewerbung-section"
                  tabIndex={0}
                >
                  Zum Bewerbungsformular
                </Link>
                .
              </p>
            </nav>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
