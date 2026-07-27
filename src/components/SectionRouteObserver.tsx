"use client";

import { useEffect } from "react";

export function SectionRouteObserver() {
  useEffect(() => {
    const handleScroll = () => {
      // Find all sections or section container IDs on the page
      const knownSectionIds = ["about-us", "services", "testimonials", "our-team", "products", "contact"];
      const selector = ["section[id]", ...knownSectionIds.map((id) => `#${id}`)].join(", ");
      const sections = document.querySelectorAll<HTMLElement>(selector);
      const viewportCenter = window.innerHeight * 0.4; // 40% threshold for snappy section detection

      let activeSectionId = "";

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        // Check if section covers the upper-center viewport area
        if (rect.top <= viewportCenter && rect.bottom >= 100) {
          activeSectionId = section.id;
        }
      });

      // Update URL hash without polluting browser history or causing page jumps
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

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return null;
}

export default SectionRouteObserver;
