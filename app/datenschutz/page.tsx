import type { Metadata } from "next";
import Link from "next/link";
import CookieSettingsButton from "../components/CookieSettingsButton";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Datenschutz | Kenji Tanaka",
  alternates: { canonical: "/datenschutz" },
};

export default function DatenschutzPage() {
  return (
    <>
      <main className="min-h-screen bg-[#faeee6] px-6 py-16 text-[#06101f] sm:px-10 lg:px-14 lg:py-24">
        <article className="mx-auto max-w-3xl">
          <Link
            className="relative inline-block text-sm font-semibold text-[#b00045] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:content-[''] hover:after:scale-x-100 focus-visible:after:scale-x-100 motion-reduce:after:transition-none"
            href="/"
            tabIndex={0}
          >
            Zurück zur Startseite
          </Link>
          <h1 className="mt-8 font-serif text-4xl font-black sm:text-5xl">
            Datenschutz
          </h1>

          <p className="mt-6 rounded-2xl border-2 border-[#b00045] bg-white/70 p-5 text-sm leading-relaxed">
            <strong>Technischer Hinweis:</strong> Das Bewerbungsformular
            übermittelt oder speichert derzeit keine Angaben. Die genannten
            externen Speicherdienste sind im aktuellen Projekt ebenfalls noch
            nicht eingebunden. Die folgenden Angaben beschreiben daher teils
            geplante Abläufe und müssen vor dem Live-Einsatz mit der
            tatsächlichen technischen Umsetzung abgeglichen werden.
          </p>

          <section className="mt-10 space-y-4">
            <h2 className="font-serif text-2xl font-bold">Bewerbungsdaten</h2>
            <p className="leading-relaxed">
              Wenn du das Bewerbungsformular absendest, verarbeiten wir die von
              dir angegebenen Daten (Name, E-Mail-Adresse, Telefonnummer,
              Instagram-Profil, Beruf, Lernstand und deine Antworten) sowie die
              Herkunftsangaben deines Besuchs (UTM-Parameter der Anzeige). Die
              Herkunftsangaben merkt sich dein Browser nur für die aktuelle
              Sitzung, ohne Cookie, und schickt sie mit der Bewerbung an uns –
              nicht an Meta. Wir nutzen sie ausschließlich, um deine Bewerbung
              zu prüfen und mit dir Kontakt aufzunehmen. Gespeichert werden sie
              in unserer Bewerbungstabelle bei Google, in unserem internen
              Team-Chat bei Slack sowie in unserem Nachrichten-Tool Sendblue.
            </p>
          </section>

          <section className="mt-10 space-y-4">
            <h2 className="font-serif text-2xl font-bold">
              Werbemessung mit Meta
            </h2>
            <p className="leading-relaxed">
              Auf dieser Seite setzen wir den Meta-Pixel von Meta Platforms
              Ireland Ltd., Merrion Road, Dublin 4, Irland, ein. Wir laden den
              Pixel erst, wenn du im Cookie-Hinweis zustimmst. Er erfasst
              Seitenaufrufe und abgeschickte Bewerbungen zusammen mit
              Cookie-Kennungen (_fbp, _fbc) und technischen Angaben wie
              IP-Adresse, Gerät und Browser. Deine Antworten aus dem
              Bewerbungsformular, etwa Name oder E-Mail-Adresse, übermitteln wir
              nicht an Meta. Zweck ist die Messung und Optimierung unserer
              Anzeigen.
            </p>
            <p className="leading-relaxed">
              Rechtsgrundlage ist deine Einwilligung (§ 25 Abs. 1 TDDDG, Art. 6
              Abs. 1 lit. a DSGVO). Für die Erhebung und Übermittlung an Meta
              sind wir gemeinsam mit Meta verantwortlich (Art. 26 DSGVO). Meta
              kann Daten auch in die USA übermitteln; Meta ist nach dem EU-US
              Data Privacy Framework zertifiziert. Lehnst du ab, findet keine
              Messung statt – deine Bewerbung funktioniert trotzdem ganz normal.
            </p>
            <p className="leading-relaxed">
              Du kannst deine Einwilligung jederzeit über „Cookie-Einstellungen“
              im Footer widerrufen. Der Widerruf gilt ab sofort; die
              Meta-Cookies werden dabei gelöscht, bereits übermittelte Messwerte
              bleiben davon unberührt.
            </p>
            <CookieSettingsButton className="cta-interactive cta-on-dark min-h-12 rounded-full px-6 py-3 text-sm font-bold uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b00045]" />
          </section>

          <section className="mt-10 space-y-4">
            <h2 className="font-serif text-2xl font-bold">Deine Rechte</h2>
            <p className="leading-relaxed">
              Du kannst Auskunft, Berichtigung oder Löschung deiner Daten
              verlangen. Schreib uns dafür einfach über die im Impressum
              genannten Kontaktdaten.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
