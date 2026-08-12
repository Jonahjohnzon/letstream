// app/page.jsx (App Router)
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <link rel="preconnect" href="https://quge5.com" />
        <link rel="dns-prefetch" href="https://quge5.com" />
        <Script
          id="monetag-tag"
          src="https://quge5.com/88/tag.min.js"
          data-zone="269577"
          strategy="afterInteractive"
          data-cfasync="false"
        />
      </body>
    </html>
  )
}