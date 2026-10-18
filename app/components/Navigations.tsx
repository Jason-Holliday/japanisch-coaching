const links = [
  { label: "Leistungen", href: "#leistungen" },
  { label: "Referenzen", href: "#referenzen" },
  { label: "Über Kenji", href: "#ueber-kenji" },
  { label: "Ablauf", href: "#ablauf" },
  { label: "FAQ", href: "#faq" },
];

function NavigationLinks() {
  return links.map((link) => (
    <a
      className="relative inline-block w-fit self-start rounded-sm py-3 transition-colors hover:text-pink-300 hover:after:scale-x-100 active:text-pink-300 active:after:scale-x-100 focus-visible:text-pink-300 focus-visible:after:scale-x-100 after:absolute after:bottom-2 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:content-[''] motion-reduce:after:transition-none"
      href={link.href}
      key={link.href}
      tabIndex={0}
    >
      {link.label}
    </a>
  ));
}

export default function Navigations() {
  return (
    <header className="site-navigation relative z-50 w-full bg-[#06101f] text-white">
      <div className="mx-auto flex min-h-19 max-w-360 items-center justify-between gap-4 px-4 sm:gap-8 sm:px-6 lg:px-14">
        <a
          aria-label="Kenji Tanaka, Startseite"
          className="relative shrink-0 rounded-sm py-3 font-serif text-[21px] font-bold uppercase tracking-wide transition-colors hover:text-pink-300 hover:after:scale-x-100 focus-visible:text-pink-300 focus-visible:after:scale-x-100 after:absolute after:bottom-2 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:content-[''] motion-reduce:after:transition-none"
          href="#top"
          tabIndex={0}
        >
          Kenji Tanaka
        </a>

        <nav
          aria-label="Hauptnavigation"
          className="hidden items-center gap-6 lg:flex"
        >
          <NavigationLinks />
          <button
            aria-controls="bewerbung-dialog"
            aria-haspopup="dialog"
            className="cursor-pointer cta-interactive ml-6 rounded-full cta-on-dark px-6 py-3 text-sm font-bold uppercase focus-visible:bg-[#06101f] focus-visible:shadow-[0_0_0_2px_#f04498]"
            data-open-application
            tabIndex={0}
            type="button"
          >
            <span className="link-label-underline">Jetzt bewerben</span>
          </button>
        </nav>

        <details className="mobile-menu-details group lg:hidden">
          <summary
            aria-label="Menü"
            className="cursor-pointer list-none rounded-sm py-3 focus-visible:bg-[#c50045]"
            tabIndex={0}
          >
            <svg
              aria-hidden="true"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </summary>
          <nav
            aria-label="Mobile Navigation"
            className="mobile-menu absolute inset-x-0 top-full z-40 flex w-full flex-col gap-5 bg-[#06101f] p-6 shadow-xl"
          >
            <NavigationLinks />
            <button
              aria-controls="bewerbung-dialog"
              aria-haspopup="dialog"
              className="cursor-pointer cta-interactive w-full rounded-2xl cta-on-dark px-4 py-3 text-center text-sm font-bold leading-snug uppercase focus-visible:bg-[#06101f] focus-visible:shadow-[0_0_0_2px_#f04498]"
              data-open-application
              tabIndex={0}
              type="button"
            >
            <span className="link-label-underline">Jetzt bewerben</span>
            </button>
          </nav>
        </details>
      </div>
    </header>
  );
}
