"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import RevealOnScroll from "./RevealOnScroll";

const questions = [
  {
    question: "Ich habe einen Vollzeitjob. Klappt das trotzdem?",
    answer:
      "Ja, genau dafür ist das Programm gemacht. Unsere Teilnehmer haben eigene Unternehmen, Kinder oder arbeiten als Arzt mit zwei Praxen. Der Plan passt sich deinem Alltag an.",
  },
  {
    question: "Ich bin kompletter Anfänger. Ist das Programm für mich?",
    answer:
      "Auf jeden Fall. Wir starten dort, wo du stehst – auch wenn du noch kein Hiragana lesen kannst.",
  },
  {
    question: "Ich lerne schon länger mit Apps, Büchern oder an der VHS. Lohnt es sich noch?",
    answer:
      "Gerade dann. Wenn du viel weißt, aber nicht sprichst, setzen wir genau dort an.",
  },
  {
    question: "Warum muss ich mich bewerben?",
    answer:
      "Wir begleiten jeden Teilnehmer persönlich und nehmen nur Menschen auf, bei denen wir sicher sind, dass wir ihnen helfen können. Deshalb prüfen wir jede Bewerbung selbst.",
  },
  {
    question: "Wie läuft der Bewerbungsprozess ab?",
    answer:
      "Du reichst deine Bewerbung ein. Wenn du gut reinpasst, melden wir uns persönlich bei dir. Im Gespräch schauen wir gemeinsam, ob das Programm zu dir passt und wie du starten kannst.",
  },
  {
    question: "Was kostet das Programm?",
    answer:
      "Die Investition liegt bei mindestens 1.500 €. Die genauen Details besprechen wir persönlich nach deiner Bewerbung.",
  },
  {
    question: "Wann kann ich starten?",
    answer: "Idealerweise innerhalb der nächsten 30 Tage nach deiner Bewerbung.",
  },
];

export default function FAQ() {
  const [openQuestions, setOpenQuestions] = useState<number[]>([]);

  function toggleQuestion(index: number) {
    setOpenQuestions((current) =>
      current.includes(index)
        ? current.filter((openIndex) => openIndex !== index)
        : [...current, index],
    );
  }

  return (
    <section
      aria-labelledby="faq-title"
      className="bg-[#faeee6] px-6 py-16 text-[#06101f] sm:px-10 sm:py-20 lg:px-14 lg:py-24"
      id="faq"
    >
      <div className="mx-auto max-w-3xl">
        <RevealOnScroll>
          <h2
            className="text-center font-serif text-3xl font-black uppercase text-[#06101f] sm:text-4xl"
            id="faq-title"
          >
            Häufige Fragen
          </h2>
        </RevealOnScroll>
        <div className="mt-8 space-y-4 sm:mt-10">
          {questions.map((item, index) => {
            const isOpen = openQuestions.includes(index);
            const answerId = `faq-answer-${index}`;

            return (
              <RevealOnScroll
                className="faq-reveal-item w-full"
                delay={index * 100}
                key={item.question}
              >
                <button
                  aria-controls={answerId}
                  aria-expanded={isOpen}
                  aria-labelledby={`faq-question-${index}`}
                  className="group block w-full cursor-pointer rounded-3xl border-3 border-transparent bg-[#030d1d] px-5 py-4 text-left text-white transition-[border-color,box-shadow] duration-200 hover:border-[#f04498] hover:shadow-lg focus-visible:border-[#f04498] focus-visible:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f04498] motion-reduce:transition-none sm:px-6"
                  onClick={() => toggleQuestion(index)}
                  tabIndex={0}
                  type="button"
                >
                  <span className="flex items-start justify-between gap-4 font-semibold leading-snug">
                    <span id={`faq-question-${index}`}>{item.question}</span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`mt-0.5 size-5 shrink-0 transition-transform duration-300 motion-reduce:transition-none ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                  <span
                    aria-hidden={!isOpen}
                    className="grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none"
                    id={answerId}
                    style={{
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <span className="overflow-hidden">
                      <span className="block max-w-2xl pt-4 text-sm font-normal leading-relaxed text-white sm:text-base">
                        {item.answer}
                      </span>
                    </span>
                  </span>
                </button>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
