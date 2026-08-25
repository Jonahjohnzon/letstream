"use client"
import Apicore from '@/app/ApiCore'
import WishlistButton from '@/app/Component/WishlistButton'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'nextjs-toploader/app'
import Recommend from './Recommended/Recommend'
import Footer from '@/app/Footer'
import Section from './Section/Section'
import Cast from './Cast/Cast'
import InfoStats from './InfoStats'
import Loading from '@/app/Loading'
import { IoArrowBack, IoStar } from "react-icons/io5"
import { getWishlistId, WishList } from '@/app/history'
import TrailerBox from './Comment'
import Button from '@/app/Component/Button'
import { useSnapshot } from 'valtio'
import { state } from '@/app/store'
import ReactGA from 'react-ga4'

const api = new Apicore()

const Bodyjs = ({ params }) => {
  const load = useSnapshot(state).wishload
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [wishshow, setwishshow] = useState(false)
  const [wishlistArray, setWishlistArray] = useState([])
  const [rec, setRec] = useState([])
  const [cast, setCast] = useState([])
  const [season, setSeason] = useState([])
  const [url, setUrl] = useState()
  const [Detail, setDetail] = useState(null)

  const BackdropApi = process.env.NEXT_PUBLIC_SIZEIMAGE1280
  const PosterApi = process.env.NEXT_PUBLIC_SIZEIMAGE300

  const id = params?.id
  const type = params?.type
  const part = params?.part

  const GetDetails = async () => {
    setLoading(true)
    try {
      const [detailRes, wishlistId, recRes, videoRes, creditRes] = await Promise.all([
        api.get(`/3/${type}/${id}?language=en-US`),
        getWishlistId(),
        api.get(`/3/${type}/${id}/recommendations?language=en-US&page=1`),
        api.get(`/3/${type}/${id}/videos?language=en-US`),
        api.get(`/3/${type}/${id}/credits?language=en-US`),
      ])

      setDetail(detailRes)
      setWishlistArray(wishlistId || [])
      setRec(recRes?.results || [])
      setCast(creditRes?.cast || [])
      setUrl(videoRes?.results?.find((item) => item.type === 'Trailer')?.key)

      if (type === 'tv') {
        const seasonNo = detailRes?.number_of_seasons || 0
        setSeason(Array.from({ length: seasonNo }, (_, i) => i + 1))
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: "/detail", title: "Body Page" })
    GetDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, type])

  if (loading || !Detail) return <div><Loading /></div>

  const airDateRaw = type === 'movie' ? Detail?.release_date : Detail?.first_air_date
  const hasAired = airDateRaw ? new Date(airDateRaw) < new Date() : false
  const runtime = type === 'movie' ? Detail?.runtime : Detail?.episode_run_time?.[0]

  const historyBody = {
    id: Detail?.id,
    media_type: type,
    poster_path: Detail?.poster_path,
    name: Detail?.name,
    original_name: Detail?.original_name,
    title: Detail?.title,
    vote_average: Detail?.vote_average,
    season: '1',
    episode: '1'
  }

  const PUSH = async () => {
    const info = await WishList(historyBody)
    setwishshow(!!info)
  }

  const addDefaultImg = (ev) => { ev.target.src = "/dfi.png" }

  const goStream = () => {
    window.open("https://omg10.com/4/11569591")
    router.push(`/stream/${type}/${id}/1/1`)
  }

  return (
    <section className='relative min-h-[100vh]'>
      <div
        className="relative top-0 left-0 w-[100vw] h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${BackdropApi}${Detail.backdrop_path})` }}
      >
        <div className="py-20 md:py-40 w-full flex justify-center items-center h-full top-0 bg-gradient-to-b from-[rgba(0,0,0,0.5)] to-[rgba(0,0,0,1)]">
          <button
            type="button"
            aria-label="Go back"
            className='top-7 z-50 left-7 text-4xl cursor-pointer absolute'
            onClick={() => router.push('/')}
          >
            <IoArrowBack />
          </button>

          <section className='w-[95%] md:w-[90%] 2xl:w-[60%] flex md:flex-row flex-col items-center justify-between'>
            <div className='mb-5 md:mb-0 w-full min-h-72 lg:w-[40%] flex justify-center md:justify-start lg:justify-center'>
            <img
              onError={addDefaultImg}
              src={`${PosterApi}${Detail?.poster_path}`}
              alt={Detail?.name || Detail?.title}
              width={288}
              height={432}
              className='w-40 md:w-60 lg:w-72 aspect-[2/3] object-cover shadow-sm shadow-black rounded-md'
            />
          </div>

            <div className='w-[100%] sm:w-[60%] flex flex-col items-center'>
              <div className='flex items-center gap-3 mb-1'>
                <h1 className='text-3xl sm:text-5xl font-bold text-center'>
                  {Detail?.name || Detail?.original_name || Detail?.title}
                </h1>
                {typeof Detail?.vote_average === 'number' && Detail.vote_average > 0 && (
                  <span className='flex items-center gap-1 bg-black bg-opacity-40 border border-yellow-400 border-opacity-40 rounded-full px-2 py-1 text-sm font-semibold'>
                    <IoStar className='text-yellow-400' />
                    {Detail.vote_average.toFixed(1)}
                  </span>
                )}
              </div>

              {Detail?.tagline && (
                <i className='font-semibold text-gray-300 mb-1 text-center'>{Detail.tagline}</i>
              )}

              <div className='font-semibold flex flex-wrap justify-center items-center gap-x-5 mb-1 text-sm sm:text-base'>
                {Detail?.origin_country?.length > 0 && <span>{Detail.origin_country.join(', ')}</span>}
                {airDateRaw && <span>{airDateRaw}</span>}
                {runtime ? <span><span className='mr-1'>Runtime:</span>{runtime} MIN</span> : null}
              </div>

              <div className='flex flex-wrap w-full justify-center items-center mb-5 gap-2'>
                {Detail?.genres?.map((g) => (
                  <p key={g.id} className='font-semibold px-3 py-1 whitespace-nowrap bg-red-900 rounded-sm text-sm'>
                    {g.name}
                  </p>
                ))}
              </div>

              <div className='text-center mb-10 font-medium px-3 text-lg h-20 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-red-400'>
                <p>{Detail?.overview || 'No overview available.'}</p>
              </div>

              <div className='flex sm:flex-row flex-col justify-center items-center gap-5'>
                {hasAired ? (
                  <div className='cursor-pointer' onClick={goStream}>
                    <Button title={"Stream/Download"} />
                  </div>
                ) : (
                  <div className='w-40'><img src='/nota.png' alt="Not yet available" /></div>
                )}

                {load ? (
                  <div className='w-8 h-8 border-white border-[2px] rounded-full border-l-0 animate-spin'></div>
                ) : (
                  !(wishlistArray.includes(id) || wishshow) && (
                    <div className='cursor-pointer' onClick={PUSH}>
                      <WishlistButton />
                    </div>
                  )
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      <InfoStats Detail={Detail} type={type} />

      <Cast cast={cast} />

      {season.length !== 0 && type === 'tv' && (
        <Section Detail={Detail} season={season} id={id} part={part} />
      )}

      <TrailerBox url={url} />

      <Recommend data={rec} />

      <div className='mt-10'>
        <Footer />
      </div>
    </section>
  )
}

export default Bodyjs