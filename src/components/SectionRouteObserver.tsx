"use client";

import { useEffect } from "react";

export function SectionRouteObserver() {
  useEffect(() => {
    const knownSectionIds = ["about-us", "services", "testimonials", "our-team", "products", "contact", "highlights"];
    const selector = ["section[id]", ...knownSectionIds.map((id) => `#${id}`)].join(", ");
    const sections = Array.from(document.querySelectorAll<HTMLElement>(selector));

    if (sections.length === 0) return;

    const visibleSections = new Set<string>();

    const updateActiveSection = () => {
      let activeSectionId = "";
      for (const section of sections) {
        if (visibleSections.has(section.id)) {
          activeSectionId = section.id;
          break;
        }
      }

      if (activeSectionId === "hero" || !activeSectionId) {
        if (window.location.hash !== "") {
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
          window.dispatchEvent(
            new CustomEvent("sectionchange", {
              detail: { section: "", fullPath: window.location.pathname },
            })
          );
        }
      } else {
        const targetHash = `#${activeSectionId}`;
        if (window.location.hash !== targetHash) {
          window.history.replaceState(null, "", targetHash);
          window.dispatchEvent(
            new CustomEvent("sectionchange", {
              detail: { section: activeSectionId, fullPath: window.location.pathname + targetHash },
            })
          );
        }
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.add(entry.target.id);
          } else {
            visibleSections.delete(entry.target.id);
          }
        });
        updateActiveSection();
      },
      {
        root: null,
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => {
      if (section.id) observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}

export default SectionRouteObserver;

