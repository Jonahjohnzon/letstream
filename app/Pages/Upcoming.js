'use client'
import React, { useEffect, useState } from 'react'
import TitleBar from '../Component/TitleBar'
import { api } from '../ApiCore'
import Ads from './Ads'
import YouTube from 'react-youtube'

const Upcoming = ({ Trailer }) => {
  const [id, setId] = useState(null)
  const [url, setUrl] = useState(null)
  const [trailerName, setTrailerName] = useState(null)
  const [loading, setLoading] = useState(true)

  // Pick a random movie once we actually know how many we have. The
  // original `Math.floor(Math.random() * 20)` assumed at least 20 items —
  // if `Trailer` had fewer (or was empty), `Trailer[id]` was `undefined`
  // and everything downstream broke silently.
  useEffect(() => {
    if (Trailer?.length) {
      setId(Trailer[Math.floor(Math.random() * Trailer.length)]?.id)
    }
  }, [Trailer])

  useEffect(() => {
    if (!id) return
    let cancelled = false

    const getTrailer = async () => {
      setLoading(true)
      setUrl(null)
      try {
        const response = await api.get(`/3/movie/${id}/videos?language=en-US`)
        if (cancelled) return
        const trailer = response?.results?.find((item) => item.type === "Trailer")
        setUrl(trailer?.key ?? null)
        setTrailerName(trailer?.name ?? "Trailer")
      } catch (err) {
        if (!cancelled) console.error('Failed to load trailer:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    getTrailer()
    return () => { cancelled = true }
  }, [id])

  const opts = {
    height: '440px',
    width: '100%',
    playerVars: { autoplay: 0, controls: 0, rel: 0 },
  };

  if (!Trailer?.length) return null;

  return (
    <div className="bg-transparent relative z-40 flex flex-col items-center">
      <div className="w-[95%] lg:w-[80%] 3xl:w-[70%] mb-5 px-2">
        <TitleBar title={"Today's Trailers"} />
      </div>

      <div className="w-[95%] lg:w-[80%] 3xl:w-[70%] flex items-center justify-center xl:justify-between">
        <section className="w-full md:w-[80%] lg:w-[65%] flex items-start">
          <div className="xl:mr-5 flex justify-center items-center min-h-[440px] w-full">
            {loading && (
              <div className="w-full h-[440px] rounded-lg bg-white/5 animate-pulse" />
            )}
            {!loading && url && (
              <div className="2xl:w-[740px] w-[340px] xs:w-[460px] sm:w-[580px] md:w-[640px]">
                <YouTube videoId={url} title={trailerName} opts={opts} />
              </div>
            )}
            {!loading && !url && (
              <p className="text-gray-500 text-sm">No trailer available right now.</p>
            )}
          </div>
        </section>
        <div className="xl:inline hidden"><Ads /></div>
      </div>
    </div>
  )
}

export default Upcoming