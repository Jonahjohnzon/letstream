'use client'
import React from 'react'
import { useRouter } from 'nextjs-toploader/app';
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import { FaStar } from "react-icons/fa";

const addDefaultImg = (ev) => { ev.target.src = "/dfi.png" }

/**
 * Shared poster tile for both the discovery rows ("details" mode) and the
 * continue-watching row ("continue" mode). These two used to be separate,
 * near-identical components (MovieBlock / RecentBlock) that would silently
 * drift apart every time one got a fix the other didn't.
 *
 * mode="details"  -> click goes to the info page (TrendingToday's old behavior)
 * mode="continue" -> click resumes streaming directly, shows an S/E badge,
 *                    and handles the telenovela custom-source case
 *                    (RecentWatch's old behavior)
 */
const PosterCard = ({ data, passType = "", mode = "details" }) => {
  const Api = process.env.NEXT_PUBLIC_SIZEIMAGE;
  const router = useRouter();

  const type = data.media_type ? (data.media_type === "movie" ? "movie" : "tv") : passType;
  const season = data?.season || '1';
  const episode = data?.episode || '1';
  const title = data.name || data.original_name || data.title;

  // Custom/telenovela sources ship a fully-qualified `url`; TMDB sources
  // need the image CDN prefix. Rating formatting follows the same split —
  // TMDB's vote_average gets rounded up for a cleaner "x/10" display,
  // custom sources are shown as-is.
  const posterSrc = data?.url ? `${data.poster_path}` : `${Api}${data.poster_path}`;
  const rating = data?.url ? `${data.vote_average}` : Math.ceil(data.vote_average || 0);

  const handleActivate = () => {
    window.open("https://omg10.com/4/10438662")
    if (mode === "continue") {
      if (data.media_type !== "telenovela") {
        router.push(`/stream/${type}/${data?.id}/${season}/${episode}`)
      } else {
        router.push(`/telestream?link=${data?.url}`)
      }
    } else {
      router.push(`/details/${type}/${data.id}/1`)
    }
  }

  return (
    <LazyLoadComponent effect="blur" className="w-full" wrapperProps={{ style: { transitionDelay: "1s" } }}>
      <div
        role="button"
        tabIndex={0}
        aria-label={`${mode === "continue" ? "Continue watching" : "View details for"} ${title}`}
        className="rounded-lg cursor-pointer overflow-hidden w-36 sm:w-48 h-60 sm:h-72 group relative outline-none focus-visible:ring-2 focus-visible:ring-white"
        onClick={handleActivate}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleActivate()
          }
        }}
      >
        <img
          onError={addDefaultImg}
          className="w-full h-full object-cover object-center absolute z-10"
          src={posterSrc}
          loading="lazy"
          alt={title}
        />
        <div className="flex justify-center items-end bg-black w-full h-full absolute z-20 bg-opacity-0 group-hover:bg-opacity-80 transition-all duration-300 ease-in-out">
          <div className="px-2 font-bold w-full opacity-0 group-hover:opacity-100 transition-all text-center flex flex-col items-center absolute -bottom-10 group-hover:bottom-10 duration-300 ease-in-out">
            <p className="text-lg font-semibold">{title}</p>
            <div className="flex items-center w-fit justify-center">
              <p className="text-yellow-300 mr-2"><FaStar /></p>
              <p>{rating}/10</p>
            </div>
          </div>
        </div>
        {mode === "continue" && type === 'tv' && (
          <div className="flex font-semibold text-xs bg-black bg-opacity-80 items-center absolute bottom-0 left-0 p-1 rounded-tr-lg z-40">
            <div className="mr-1">S{season}</div>
            <div>E{episode}</div>
          </div>
        )}
      </div>
    </LazyLoadComponent>
  )
}

export default PosterCard