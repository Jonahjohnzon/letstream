'use client'
import Script from 'next/script'
import { usePathname } from 'next/navigation'

export function VignetteAd() {
  const pathname = usePathname()
  if (!pathname.startsWith('/watch')) return null

  return (
    <>
      {/* warm the connection before the script even loads */}
      <link rel="preconnect" href="https://n6wxm.com" />
      <link rel="dns-prefetch" href="https://n6wxm.com" />

      <Script
        id="monetag-vignette"
        strategy="afterInteractive" // back from lazyOnload — loads sooner
        dangerouslySetInnerHTML={{
          __html: `
            (function(s){
              s.dataset.zone='11562434';
              s.src='https://n6wxm.com/vignette.min.js';
            })([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))
          `,
        }}
      />
    </>
  )
}