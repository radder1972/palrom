'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollObserver() {
  const pathname = usePathname();

  useEffect(() => {
    let intersectionObserver;

    function bindObserver() {
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }

      const scrollElements = document.querySelectorAll('.animate-on-scroll');
      const timelineItems = document.querySelectorAll('.timeline-item');

      if (scrollElements.length === 0 && timelineItems.length === 0) return;

      const scrollObserverOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px', // Trigger slightly before element enters view
        threshold: 0.1,
      };

      intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('appear');

            // Sequential animation helper for timeline items
            if (entry.target.classList.contains('timeline-item')) {
              entry.target.classList.add('visible');
            }
            intersectionObserver.unobserve(entry.target);
          }
        });
      }, scrollObserverOptions);

      scrollElements.forEach((el) => {
        // Only observe if it hasn't appeared yet
        if (!el.classList.contains('appear')) {
          intersectionObserver.observe(el);
        }
      });
      timelineItems.forEach((item) => {
        if (!item.classList.contains('appear') && !item.classList.contains('visible')) {
          intersectionObserver.observe(item);
        }
      });
    }

    // Initial binding
    bindObserver();

    // Watch for dynamically added DOM nodes (e.g. after geolocation verification mounts content)
    const mutationObserver = new MutationObserver((mutations) => {
      let hasNewElements = false;
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          hasNewElements = true;
          break;
        }
      }
      if (hasNewElements) {
        bindObserver();
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }
      mutationObserver.disconnect();
    };
  }, [pathname]);

  return null;
}
