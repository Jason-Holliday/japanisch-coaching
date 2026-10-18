import Link from "next/link";
import CookieSettingsButton from "./CookieSettingsButton";
import RevealOnScroll from "./RevealOnScroll";

const footerLinkClassName =
  "relative inline-block w-fit after:absolute after:bottom-[-3px] after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-[#b00045] after:transition-transform after:duration-300 after:content-[''] hover:text-[#b00045] hover:after:scale-x-100 focus-visible:text-[#b00045] focus-visible:after:scale-x-100 motion-reduce:after:transition-none";

// Sprung-Links auf die Startseite bewusst als <a> statt <Link>: Next.js scrollt
// bei <Link> nicht erneut, wenn die Adresse schon dasselbe #Ziel hat.
const navigationLinks = [
  { label: "Startseite", href: "/#top" },
  { label: "Über Kenji", href: "/#ueber-kenji" },
  { label: "Leistungen", href: "/#leistungen" },
  { label: "Referenzen", href: "/#referenzen" },
  { label: "Ablauf", href: "/#ablauf" },
  { label: "FAQ", href: "/#faq" },
];

const legalLinks = [
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "Impressum", href: "#impressum" },
  { label: "AGB", href: "#agb" },
  { label: "Widerrufsrecht", href: "#widerrufsrecht" },
];

export default function Footer() {
  return (
    <footer className="site-footer bg-[#faeee6] px-6 py-12 text-[#06101f] sm:px-10 lg:px-14">
      <div className="mx-auto grid max-w-360 gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr] lg:gap-16">
        <RevealOnScroll className="sm:col-span-2 lg:col-span-1 lg:border-r lg:border-[#b00045] lg:pr-12">
          {/* <a> statt <Link>, siehe Kommentar bei navigationLinks. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            className={`font-serif text-3xl font-black uppercase leading-tight ${footerLinkClassName}`}
            href="/#top"
            tabIndex={0}
          >
            Kenji
            <br />
            Tanaka
          </a>
          <p className="mt-5 max-w-sm text-sm leading-relaxed">
            Für Beschäftigte, die endlich 10+ Minuten frei Japanisch sprechen
            wollen, um tiefere Verbindungen mit Japan aufzubauen.
          </p>
        </RevealOnScroll>

        <RevealOnScroll>
          <nav aria-label="Footer Navigation">
            <h2 className="font-serif text-lg font-black uppercase">
              Navigation
            </h2>
            <ul className="mt-4 space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <a
                    className={`text-sm ${footerLinkClassName}`}
                    href={link.href}
                    tabIndex={0}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </RevealOnScroll>

        <RevealOnScroll delay={100}>
          <nav aria-label="Rechtliche Informationen">
            <h2 className="font-serif text-lg font-black uppercase">
              Rechtliches
            </h2>
            <ul className="mt-4 space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    className={`text-sm ${footerLinkClassName}`}
                    href={link.href}
                    tabIndex={0}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <CookieSettingsButton
                  className={`text-left text-sm ${footerLinkClassName}`}
                />
              </li>
            </ul>
          </nav>
        </RevealOnScroll>
      </div>

      <RevealOnScroll className="mx-auto mt-10 max-w-360 border-t border-[#b00045] pt-6 text-center text-sm">
        <p>© 2026 Kenji Tanaka. Unabhängige Seite.</p>
        <p> Keine Verbindung zu erwähnten Apps, Plattformen oder Marken.</p>
        <p>
          Erstellt von{" "}
          <a
            className={`font-semibold ${footerLinkClassName}`}
            href="https://www.jasonholliday.de"
            tabIndex={0}
            rel="noopener"
            target="_blank"
          >
            Jason Holliday
            <span className="sr-only"> (öffnet in neuem Tab)</span>
          </a>
        </p>
      </RevealOnScroll>
    </footer>
  );
}
