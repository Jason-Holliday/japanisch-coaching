"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type RevealOnScrollProps = {
  as?: "div" | "li";
  children: ReactNode;
  className?: string;
  delay?: number;
};

export default function RevealOnScroll({
  as = "div",
  children,
  className,
  delay = 0,
}: RevealOnScrollProps) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      element.contains(document.activeElement) ||
      typeof IntersectionObserver === "undefined"
    ) {
      element.dataset.revealState = "visible";
      return;
    }

    element.dataset.revealState = "hidden";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.dataset.revealState = "visible";
          observer.unobserve(element);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const style: CSSProperties & { "--reveal-delay": string } = {
    "--reveal-delay": `${delay}ms`,
  };
  const Element = as;
  const setElementRef = (element: HTMLDivElement | HTMLLIElement | null) => {
    elementRef.current = element;
  };

  return (
    <Element
      className={["scroll-reveal", className].filter(Boolean).join(" ")}
      onFocusCapture={() => {
        if (elementRef.current) {
          elementRef.current.dataset.revealState = "focused";
        }
      }}
      ref={setElementRef}
      style={style}
    >
      {children}
    </Element>
  );
}
