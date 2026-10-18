# Japanisch-Coaching – Kenji Tanaka

Landingpage für das Japanisch-Coaching von Kenji Tanaka. Besucher können sich über ein mehrstufiges Bewerbungsformular bewerben. Die Bewerbung wird per E-Mail an den Betreiber geschickt, der Bewerber erhält automatisch eine Bestätigung.

**Technik:** Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript, Nodemailer (SMTP)

---

## Inhalt

- [Lokal starten](#lokal-starten)
- [Umgebungsvariablen](#umgebungsvariablen)
- [Deployment](#deployment)
- [Texte und Inhalte ändern](#texte-und-inhalte-ändern)
- [Projektstruktur](#projektstruktur)
- [Datenschutz-relevante Technik](#datenschutz-relevante-technik)

---

## Lokal starten

Voraussetzung: **Node.js 20.9 oder neuer**

```bash
npm install          # Abhängigkeiten installieren (einmalig)
cp .env.example .env.local   # Umgebungsvariablen anlegen, siehe unten
npm run dev          # Entwicklungsserver starten
```

Danach ist die Seite unter [http://localhost:3000](http://localhost:3000) erreichbar. Änderungen am Code werden automatisch neu geladen.

| Befehl          | Zweck                                         |
| --------------- | --------------------------------------------- |
| `npm run dev`   | Entwicklungsserver                            |
| `npm run build` | Produktions-Build erstellen                   |
| `npm run start` | Produktions-Build lokal starten (nach `build`) |
| `npm run lint`  | Code mit ESLint prüfen                        |

Die Seite funktioniert auch ohne ausgefüllte Umgebungsvariablen. Nur das Absenden des Formulars schlägt dann mit einer Fehlermeldung fehl.

---

## Umgebungsvariablen

1. `.env.example` nach `.env.local` kopieren und ausfüllen:
   ```bash
   cp .env.example .env.local
   ```
2. Für die Live-Seite dieselben Variablen beim Hosting eintragen (Vercel: **Project → Settings → Environment Variables**).

| Variable               | Pflicht | Zweck                                                                                     |
| ---------------------- | ------- | ----------------------------------------------------------------------------------------- |
| `SMTP_HOST`            | ja      | Mailserver, z. B. `smtp.ionos.de`                                                         |
| `SMTP_PORT`            | ja      | `465` (SSL) oder `587` (STARTTLS), Standard: `465`                                        |
| `SMTP_USER`            | ja      | Login für den Mailserver                                                                  |
| `SMTP_PASSWORD`        | ja      | Passwort für den Mailserver                                                               |
| `CONTACT_EMAIL`        | ja      | Postfach, das die Bewerbungen empfängt                                                    |
| `SMTP_FROM`            | nein    | Absenderadresse, falls `SMTP_USER` keine E-Mail-Adresse ist. Standard: `SMTP_USER`        |
| `SMTP_SECURE`          | nein    | TLS-Modus erzwingen (`true`/`false`). Standard: Port 465 = SSL, sonst STARTTLS            |
| `NEXT_PUBLIC_SITE_URL` | live ja | Domain der Live-Seite ohne `/` am Ende, z. B. `https://www.beispiel.de`                   |

**Wichtig**

- **Niemals echte Zugangsdaten** in dieses README, in `.env.example` oder sonst in Git schreiben. `.env.local` ist per `.gitignore` ausgeschlossen.
- Die SMTP-Daten werden nur auf dem Server gelesen und nie an den Browser ausgeliefert. Sie dürfen deshalb **nicht** mit `NEXT_PUBLIC_` beginnen.
- Ohne `NEXT_PUBLIC_SITE_URL` ist die Seite für Suchmaschinen gesperrt (`noindex`, `robots.txt` sperrt alles). Das ist für Tests und Vorschauen gewollt. Vorschau-Deployments auf Vercel bleiben auch mit gesetzter Domain gesperrt.
- Nach einer Änderung der Variablen muss die Seite **neu gebaut** werden (`NEXT_PUBLIC_SITE_URL` wird beim Build fest eingebaut).

---

## Deployment

Empfohlen ist **Vercel**, jeder andere Hoster mit Node.js-Unterstützung funktioniert ebenfalls.

### Vercel

1. Repository bei [vercel.com](https://vercel.com) importieren. Das Framework (Next.js) wird automatisch erkannt.
2. Unter **Settings → Environment Variables** alle Variablen aus der Tabelle oben eintragen.
3. Deployen. Jeder Push auf den Hauptbranch wird danach automatisch veröffentlicht.
4. Unter **Settings → Domains** die eigene Domain verbinden und `NEXT_PUBLIC_SITE_URL` darauf setzen, anschließend neu deployen.

### Eigener Server

```bash
npm ci
npm run build
npm run start        # läuft standardmäßig auf Port 3000
```

Davor einen Reverse-Proxy (z. B. nginx) mit HTTPS setzen und die Umgebungsvariablen im Server-Prozess bereitstellen.

### Checkliste vor dem Livegang

- [ ] Alle Umgebungsvariablen gesetzt, `NEXT_PUBLIC_SITE_URL` auf die echte Domain
- [ ] Testbewerbung abgeschickt: Mail an den Betreiber **und** Bestätigung an den Bewerber angekommen (auch Spam-Ordner prüfen)
- [ ] SPF und DKIM für die Absender-Domain eingerichtet (beim Mailanbieter bzw. im DNS), damit Mails nicht im Spam landen
- [ ] Impressum, Datenschutz, AGB und Widerrufsrecht eingebunden, Footer-Links zeigen auf die echten Seiten
- [ ] `https://www.beispiel.de/robots.txt` und `/sitemap.xml` zeigen die echte Domain

---

## Texte und Inhalte ändern

Alle Texte stehen direkt in den Komponenten unter `app/components/`. Listen (z. B. FAQ, Referenzen) sind als Arrays am Anfang der jeweiligen Datei definiert und lassen sich ohne Eingriff ins Layout ergänzen.

| Bereich auf der Seite            | Datei                                   | Was dort steht                                          |
| -------------------------------- | --------------------------------------- | ------------------------------------------------------- |
| Navigation (oben)                | `app/components/Navigations.tsx`        | Menüpunkte (`links`)                                    |
| Hero (Startbereich)              | `app/components/Hero.tsx`               | Überschrift, Einleitung, Vorteile (`benefits`)          |
| Probleme                         | `app/components/Problem.tsx`            | Problem-Karten mit Bild und Stickern (`problems`)       |
| Lösung                           | `app/components/Solution.tsx`           | Vorteile (`benefits`), Zitat                            |
| Leistungen                       | `app/components/Service.tsx`            | Leistungskarten (`services`)                            |
| Über Kenji Tanaka                     | `app/components/About.tsx`              | Vorstellung, Kurzfakten (`facts`), Follower-Zahlen (`socialAccounts`) |
| Referenzen                       | `app/components/References.tsx`         | Kundenstimmen (`clients`)                               |
| Ablauf                           | `app/components/Process.tsx`            | 3 Schritte mit Icons (`steps`)                          |
| FAQ                              | `app/components/FAQ.tsx`                | Fragen und Antworten (`questions`)                      |
| Bewerbungsformular               | `app/components/MultiStepFormular.tsx`  | Fragen, Auswahloptionen (`levels`), Danke-Text          |
| Footer                           | `app/components/Footer.tsx`             | Kurzbeschreibung, Social-Links, Rechtliches             |
| Datenschutz                      | `app/datenschutz/page.tsx`              | Datenschutzerklärung                                    |
| 404-Seite                        | `app/not-found.tsx`                     | Fehlerseite                                             |

**Weitere Stellen**

- **Seitentitel und Google-Beschreibung:** `app/layout.tsx` (`metadata`)
- **Tab-Titel beim Wechsel in einen anderen Tab** („Komm zurück …“): `app/components/TabTitle.tsx`
- **E-Mail an den Betreiber und Bestätigungsmail an den Bewerber:** `app/api/contact/route.ts`. Absendername und Antwortzeit stehen oben als `CONFIRMATION_SENDER_NAME` und `CONFIRMATION_RESPONSE_TIME`.
- **Neue Unterseiten** (z. B. Impressum) zusätzlich in `app/sitemap.ts` eintragen.

**Formularfelder ändern:** Neue oder umbenannte Felder müssen an **zwei** Stellen angepasst werden: im Formular (`MultiStepFormular.tsx`) und in der serverseitigen Prüfung (`fields` in `app/api/contact/route.ts`). Die Zeichenlimits (`maxLengths` bzw. `maxLength`) sollten auf beiden Seiten übereinstimmen.

**Bilder** liegen in `public/`. Fotos am besten als **WebP oder PNG** ablegen, nicht als SVG mit eingebettetem Foto, da Next.js SVGs nicht optimiert. Next.js liefert die Bilder automatisch in passender Größe und als WebP/AVIF aus.

**Farben:** Die Markenfarben sind direkt als Tailwind-Klassen gesetzt, u. a. Pink `#b00045` / `#f04498`, Dunkelblau `#030d1d` / `#06101f`, Creme `#faeee6`.

---

## Projektstruktur

```
app/
├── api/contact/route.ts   # Formular-Endpunkt: Validierung, Spam-Schutz, Mailversand
├── components/            # Alle Abschnitte der Seite
├── datenschutz/page.tsx   # Datenschutzseite
├── fonts/                 # Eingebundene Schriften (WOFF2) + Lizenzen
├── globals.css            # Globale Styles, Animationen
├── layout.tsx             # Grundgerüst, Schriften, Metadaten
├── not-found.tsx          # 404-Seite
├── page.tsx               # Startseite (setzt die Abschnitte zusammen)
├── robots.ts              # erzeugt /robots.txt
├── sitemap.ts             # erzeugt /sitemap.xml
└── site.ts                # Domain und Indexierungs-Logik
fonts/                     # Original-Schriftdateien (Quellmaterial, nicht eingebunden)
public/                    # Bilder und Grafiken
```

---

## Datenschutz-relevante Technik

Für die Datenschutzerklärung relevant:

- **Schriften** (Inter, Reggae One) sind lokal eingebunden und werden von der eigenen Domain ausgeliefert. Es gehen keine Anfragen an Google oder andere Dritte.
- **Kein Tracking**, keine Cookies, keine externen Skripte.
- **Formular:** Die Angaben werden per E-Mail (SMTP) an `CONTACT_EMAIL` geschickt und nicht in einer Datenbank gespeichert. Der Bewerber erhält eine Bestätigungsmail, die nur seinen Vornamen enthält.
- **Spam-Schutz** ohne externen Dienst: Lockfeld (Honeypot), Mindest-Ausfüllzeit und ein Limit von 5 Bewerbungen pro Stunde und IP. Die IP-Adresse wird dafür nur kurzzeitig im Arbeitsspeicher gehalten und weder gespeichert noch mitgeschickt.
- **Hosting:** Der Hoster protokolliert technisch bedingt Zugriffe (inkl. IP-Adresse) in Server-Logs.
- Mit dem Mailanbieter und dem Hoster ist ein **Auftragsverarbeitungsvertrag (AVV)** nötig.
