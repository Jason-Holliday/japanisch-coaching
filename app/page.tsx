import type { Metadata } from "next";
import Navigations from "./components/Navigations";
import Hero from "./components/Hero";
import Problem from "./components/Problem";
import Solution from "./components/Solution";
import Service from "./components/Service";
import About from "./components/About";
import References from "./components/References";
import Process from "./components/Process";
import ModalDialog from "./components/ModalDialog";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import WaveDivider from "./components/WaveDivider";
import MultiStepFormular from "./components/MultiStepFormular";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Page() {
  return (
    <>
      {/* Sprungziel für "zurück nach oben". Der Hero (#start) ist auf großen
          Bildschirmen sticky; ein Link dorthin würde nicht scrollen. */}
      <div aria-hidden="true" id="top" />
      <a
        className="sr-only fixed left-4 top-4 z-50 rounded-lg bg-[#030d1d] px-4 py-3 font-semibold text-white focus:not-sr-only focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        href="#main-content"
        tabIndex={0}
      >
        Zum Inhalt springen
      </a>
      <Navigations />
      <main id="main-content" tabIndex={-1}>
        <div className="relative isolate bg-[#faeee6]">
          <Hero />
          <div className="relative z-10">
            <Problem />
          </div>
        </div>
        <Solution />
        <Service />
        <WaveDivider direction="into-dark" />
        <About />
        <WaveDivider direction="into-light" />
        <References />
        <WaveDivider direction="into-dark" />
        <Process />
        <WaveDivider direction="into-light" />
        <FAQ />
        <WaveDivider direction="into-dark" />
        <MultiStepFormular
          idPrefix="bewerbung-inline"
          sectionId="bewerbung-section"
        />
        <ModalDialog />
      </main>
      <Footer />
    </>
  );
}
