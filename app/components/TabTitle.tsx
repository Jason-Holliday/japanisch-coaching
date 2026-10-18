"use client";

import { useEffect } from "react";

const returnTitle = "Komm zurück zum Japanisch-Coaching";

export default function TabTitle() {
  useEffect(() => {
    let originalTitle = document.title;

    function handleVisibilityChange() {
      if (document.hidden) {
        originalTitle = document.title;
        document.title = returnTitle;
      } else {
        document.title = originalTitle;
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return null;
}
