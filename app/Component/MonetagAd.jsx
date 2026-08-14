'use client'
import { useEffect, useRef } from "react";

const MONETAG_ZONE_ID = '11576980';

// Injects Monetag's smart tag once per page load. Guarded with a ref +
// a global flag so React Strict Mode's double-invoke in dev, and any
// remount from client-side nav back to "/", doesn't fire the ad script
// twice on the same document.
export default function MonetagAd() {
  const injected = useRef(false);

  useEffect(() => {
    if (injected.current) return;
    if (typeof window !== 'undefined' && window.__monetagInjected) return;

    injected.current = true;
    if (typeof window !== 'undefined') window.__monetagInjected = true;

    const s = document.createElement('script');
    s.dataset.zone = MONETAG_ZONE_ID;
    s.src = 'https://nap5k.com/tag.min.js';

    const target = [document.documentElement, document.body].filter(Boolean).pop();
    target.appendChild(s);
  }, []);

  return null;
}