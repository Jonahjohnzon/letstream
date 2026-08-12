import React from 'react'
import { useRouter } from 'nextjs-toploader/app';

const CONTACT_URL = "https://discord.gg/SdVZGGEw";
// Wire this up to a real donation link when you have one — see the
// "Donate" note below for why it's rendered differently until then.
const DONATE_URL = null;

const Footer = () => {
  const router = useRouter()
  const year = new Date().getFullYear();

  return (
    <footer className="w-full flex items-center flex-col justify-center pt-5 bg-gray-950">
      <section className="w-[95%] xl:w-[80%] 2xl:w-2/3 mb-3">
        <div className="w-full flex flex-col md:flex-row justify-between mb-5">
          <button
            type="button"
            className="hidden md:flex items-center cursor-pointer text-left"
            onClick={() => router.push('/')}
          >
            <img src="/logologo.png" alt="ScreenOpps" className="w-16 mr-1" />
            <h1 className="text-3xl font-bold">Screenopps</h1>
          </button>

          <div className=" mb-8 sm:mb-0">
            <h3 className="font-semibold text-lg sm:text-2xl mb-1 sm:mb-2">Get the App</h3>
            {/* router.push, not an <a> — /android-app is an internal
                route, not an external URL, so this stays consistent with
                the "internal routes use router.push" rule below. */}
            <button
              type="button"
              onClick={() => router.push('/android-app')}
              className="block font-medium sm:text-base text-sm cursor-pointer hover:font-semibold hover:underline text-left"
            >
              Android (APK)
            </button>
          </div>

          <div>
            <h3 className="font-semibold text-lg sm:text-2xl mb-1 sm:mb-2">Resource</h3>
            {/* A real <a> tag, not router.push() — router.push is for
                internal routes and won't reliably navigate to an external
                URL like Discord. This also restores normal browser
                behavior: ctrl/cmd-click, "open in new tab", and crawlers
                being able to follow it at all. */}
            <a
              href={CONTACT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block font-medium sm:text-base text-sm cursor-pointer hover:font-semibold hover:underline"
            >
              Contact
            </a>

            {DONATE_URL ? (
              <a
                href={DONATE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-medium sm:text-base text-sm cursor-pointer hover:font-semibold hover:underline"
              >
                Donate
              </a>
            ) : (
              // Previously this rendered identically to the clickable
              // links above (same classes, same look) but had no href and
              // no onClick — anyone who clicked it got nothing, with no
              // indication why. Showing it as visibly inactive is more
              // honest than a link that silently does nothing.
              <p
                className="font-medium sm:text-base text-sm text-gray-500 cursor-not-allowed"
                title="Coming soon"
              >
                Donate (coming soon)
              </p>
            )}
          </div>
        </div>

        <div className="w-[80%] md:w-[40%]">
          <p className="sm:text-base text-sm text-gray-300 font-medium">
            This site does not store any files on our server, we only linked to the media which is hosted on 3rd party services.
          </p>
        </div>
      </section>

      <div className="text-gray-300 w-[95%] xl:w-[80%] 2xl:w-2/3 sm:text-base text-sm font-medium flex items-center py-2">
        <p className="mr-5"><span>&copy;</span> {year} Copyright</p>
        <p>Created by Mid9it</p>
      </div>
    </footer>
  )
}

export default Footer