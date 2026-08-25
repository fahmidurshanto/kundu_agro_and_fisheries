"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollAnimationObserver() {
  const pathname = usePathname();

  useEffect(() => {
    // Select sections, articles, main blocks, grid cards, tables, form containers
    const targetSelectors = [
      "section",
      ".scroll-animate",
      "main > div",
      "article",
      "form",
      "table",
      ".grid > div",
    ];

    const observeElements = () => {
      const elements = Array.from(
        document.querySelectorAll(targetSelectors.join(", "))
      );

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("reveal-visible");
              // Once revealed, we can unobserve if desired, or keep observing
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.08,
          rootMargin: "0px 0px -40px 0px",
        }
      );

      elements.forEach((el) => {
        // Skip header/nav or hidden overlays
        if (
          el.closest("header") ||
          el.closest("nav") ||
          el.classList.contains("reveal-visible") ||
          el.classList.contains("no-reveal")
        ) {
          return;
        }

        el.classList.add("reveal-on-scroll");
        observer.observe(el);
      });

      return observer;
    };

    // Timeout to ensure DOM is fully rendered after route transition
    const timer = setTimeout(() => {
      const observer = observeElements();
      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
