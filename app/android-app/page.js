'use client'
import { useState } from "react";
import Link from "next/link";

const APK_URL = "https://files.catbox.moe/jv7nkm.apk";

const FEATURES = [
  {
    title: "Built for small screens",
    body: "Every row and player control is laid out for one-thumb browsing, not a shrunken desktop page.",
  },
  {
    title: "Picks up where you left off",
    body: "Your watchlist and progress sync the moment you open the app — no re-searching for that show.",
  },
  {
    title: "Lighter on data",
    body: "Posters and previews load at a size that makes sense for mobile connections.",
  },
];

const STEPS = [
  {
    title: "Allow installs from this source",
    body: "On your phone, open Settings → Apps → Special access → Install unknown apps, then allow it for your browser or file manager.",
  },
  {
    title: "Download the APK",
    body: "Tap the button below to start the download directly.",
  },
  {
    title: "Open and install",
    body: "Once the download finishes, open the file from your notifications or Downloads folder and confirm the install.",
  },
];

export default function AndroidAppPage() {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(APK_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard may be unavailable — the link is still visible and tappable
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0b0b0f] text-white">
      {/* marquee header */}
      <header className="relative overflow-hidden border-b border-[#22222b]">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none [background-image:radial-gradient(circle,#F5C242_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="relative mx-auto max-w-3xl px-6 py-16 sm:py-20 text-center">
          <Link
            href="/"
            className="inline-block text-sm text-[#6b6b76] hover:text-[#a8a8b3] transition-colors mb-8"
          >
            ← Back to browsing
          </Link>

          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5C242]/10 border border-[#F5C242]/30">
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="#F5C242" strokeWidth="1.5">
              <rect x="6.5" y="2.5" width="11" height="19" rx="2" />
              <line x1="6.5" y1="17.5" x2="17.5" y2="17.5" />
              <line x1="10.7" y1="20" x2="13.3" y2="20" />
              <path d="M9 6.5 L15 6.5" strokeLinecap="round" />
            </svg>
          </div>

          <p className="text-sm font-semibold tracking-[0.25em] text-[#F5C242] uppercase mb-3">
            Android · APK
          </p>
          <h1
            className="text-3xl sm:text-4xl font-extrabold uppercase leading-tight"
            style={{ letterSpacing: '0.01em' }}
          >
            Your watchlist,
            <br className="hidden sm:block" /> in your pocket
          </h1>
          <p className="mt-4 text-[#a8a8b3] max-w-md mx-auto text-base sm:text-lg">
            Download the Android app directly — no Play Store required.
          </p>
          <a
          
            href={APK_URL}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#F5C242] px-8 py-3.5 text-base sm:text-lg font-bold text-[#141414] tracking-wide hover:bg-[#ffd668] transition-colors"
          >
            Download APK
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 4v12m0 0-4-4m4 4 4-4M5 20h14" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="text-xs text-[#6b6b76]">Direct download</span>
            <span className="text-[#3a3a44]">·</span>
            <button
              onClick={copyLink}
              className="text-xs text-[#6b6b76] hover:text-[#F5C242] transition-colors underline underline-offset-2"
            >
              {copied ? "Link copied" : "Copy link"}
            </button>
          </div>
        </div>
      </header>

      {/* features */}
      <section className="mx-auto max-w-3xl px-6 py-14">
        <h2 className="text-sm font-semibold tracking-[0.25em] text-[#F5C242] uppercase mb-6">
          Why the app
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-[#22222b] bg-[#121218] p-5"
            >
              <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-[#a8a8b3] leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* install steps */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <h2 className="text-sm font-semibold tracking-[0.25em] text-[#F5C242] uppercase mb-6">
          How to install
        </h2>
        <ol className="space-y-4">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="flex gap-4 rounded-xl border border-[#22222b] bg-[#121218] p-5"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F5C242] text-xs font-bold text-[#141414]">
                {i + 1}
              </span>
              <div>
                <h3 className="text-base font-bold text-white mb-1">{step.title}</h3>
                <p className="text-sm text-[#a8a8b3] leading-relaxed">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-8 text-center text-sm text-[#6b6b76]">
          Only install APKs from links you trust. This one comes straight from us.
        </p>
      </section>
    </div>
  );
}