"use client";

import { useEffect, useRef } from "react";

const petalCount = 48;

type Petal = {
  x: number;
  y: number;
  size: number;
  speed: number;
  sway: number;
  phase: number;
  rotation: number;
  rotationSpeed: number;
  tiltX: number;
  tiltY: number;
  tiltSpeedX: number;
  tiltSpeedY: number;
};

export default function FallingPetals() {
  const containerRef = useRef<HTMLDivElement>(null);
  const petalRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const container = containerRef.current;
    const elements = petalRefs.current.filter(
      (element): element is HTMLSpanElement => element !== null,
    );
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!container || reducedMotion.matches) return;

    let width = container.clientWidth;
    let height = container.clientHeight;
    let frameId = 0;
    let previousTime: number | null = null;
    const petals: Petal[] = elements.map((element, index) => {
      const size = 10 + Math.random() * 8;
      const petal = {
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        speed: 18 + Math.random() * 17,
        sway: 20 + Math.random() * 45,
        phase: Math.random() * Math.PI * 2 + index,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 360,
        tiltX: Math.random() * 360,
        tiltY: Math.random() * 360,
        tiltSpeedX: (Math.random() - 0.5) * 100,
        tiltSpeedY: (Math.random() - 0.5) * 100,
      };

      element.style.width = `${size}px`;
      element.style.height = `${size * 1.4}px`;
      return petal;
    });

    function animate(time: number) {
      frameId = 0;
      const delta =
        previousTime === null
          ? 0
          : Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;
      const seconds = time / 1000;
      const wind = Math.sin(seconds * 0.18) * 12;

      petals.forEach((petal, index) => {
        const element = elements[index];
        petal.y += petal.speed * delta;
        petal.x +=
          (wind + Math.sin(seconds * 0.7 + petal.phase) * petal.sway) * delta;
        petal.rotation += petal.rotationSpeed * delta;
        petal.tiltX += petal.tiltSpeedX * delta;
        petal.tiltY += petal.tiltSpeedY * delta;

        if (petal.y > height + petal.size) {
          petal.y = -petal.size;
          petal.x = Math.random() * width;
        }
        if (petal.x < -petal.size) petal.x = width + petal.size;
        if (petal.x > width + petal.size) petal.x = -petal.size;

        element.style.transform = `translate3d(${petal.x}px, ${petal.y}px, 0) rotateX(${petal.tiltX}deg) rotateY(${petal.tiltY}deg) rotateZ(${petal.rotation}deg)`;
      });

      frameId = window.requestAnimationFrame(animate);
    }

    function pause() {
      window.cancelAnimationFrame(frameId);
      frameId = 0;
      previousTime = null;
    }

    function start() {
      if (document.hidden || reducedMotion.matches || frameId !== 0) return;
      frameId = window.requestAnimationFrame(animate);
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        pause();
      } else {
        start();
      }
    }

    function handleMotionChange() {
      if (reducedMotion.matches) {
        pause();
      } else {
        start();
      }
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      const previousWidth = width;
      width = entry.contentRect.width;
      height = entry.contentRect.height;
      if (previousWidth > 0 && width !== previousWidth) {
        petals.forEach((petal) => {
          petal.x = (petal.x / previousWidth) * width;
        });
      }
    });

    resizeObserver.observe(container);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    reducedMotion.addEventListener("change", handleMotionChange);
    start();

    return () => {
      pause();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotion.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return (
    <div aria-hidden="true" className="hero-petals" ref={containerRef}>
      {Array.from({ length: petalCount }, (_, index) => (
        <span
          key={index}
          ref={(element) => {
            petalRefs.current[index] = element;
          }}
        />
      ))}
    </div>
  );
}
