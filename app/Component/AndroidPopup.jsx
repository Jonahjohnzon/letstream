'use client'
import { useEffect, useState } from "react";
import { useRouter } from 'nextjs-toploader/app';

// Marquee-styled popup that nudges users toward the Android app.
// Shows once per browser (persisted in localStorage) unless `force` is
// passed true, so it doesn't nag returning visitors on every page load.
export default function AndroidPopup({ force = false, delayMs = 1200 }) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!force) {
      const dismissed = window.localStorage.getItem('androidPopupDismissed');
      if (dismissed) return;
    }
    const timer = setTimeout(() => setVisible(true), delayMs);
    return () => clearTimeout(timer);
  }, [force, delayMs]);

  const dismiss = () => {
    setVisible(false);
    window.localStorage.setItem('androidPopupDismissed', '1');
  };

  const goToDownloadPage = () => {
    window.localStorage.setItem('androidPopupDismissed', '1');
    setVisible(false);
    router.push('/android-app');
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm px-4 pb-6 sm:pb-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="android-popup-title"
    >
      <div className="relative w-full max-w-sm rounded-2xl border border-[#2a2a33] bg-[#121218] p-6 shadow-[0_0_0_1px_rgba(245,194,66,0.08),0_20px_60px_rgba(0,0,0,0.6)]">
        {/* marquee bulb strip */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-[#F5C242] animate-pulse"
              style={{ animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>

        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-3 right-3 text-[#6b6b76] hover:text-white transition-colors text-lg leading-none"
        >
          ✕
        </button>

        <div className="flex flex-col items-center text-center gap-3 pt-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5C242]/10 border border-[#F5C242]/30">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#F5C242" strokeWidth="1.6">
              <rect x="6.5" y="2.5" width="11" height="19" rx="2" />
              <line x1="6.5" y1="17.5" x2="17.5" y2="17.5" />
              <line x1="10.7" y1="20" x2="13.3" y2="20" />
              <path d="M9 6.5 L15 6.5" strokeLinecap="round" />
            </svg>
          </div>

          <h2
            id="android-popup-title"
            className="text-lg font-bold tracking-wide text-white uppercase"
            style={{ letterSpacing: '0.02em' }}
          >
            Take it with you
          </h2>
          <p className="text-base text-[#a8a8b3] leading-relaxed">
            Get the Android app for offline-friendly browsing, faster loads,
            and a smoother watchlist — right from your phone.
          </p>

          <div className="flex w-full flex-col gap-2 mt-2">
            <button
              onClick={goToDownloadPage}
              className="w-full rounded-lg bg-[#F5C242] px-4 py-2.5 text-base font-semibold text-[#141414] tracking-wide hover:bg-[#ffd668] transition-colors"
            >
              Download for Android
            </button>
            <button
              onClick={dismiss}
              className="w-full rounded-lg px-4 py-2 text-sm font-medium text-[#6b6b76] hover:text-[#a8a8b3] transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}