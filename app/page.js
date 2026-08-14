'use client'
import { useEffect, useState, useCallback } from "react";
import Top from "./Pages/Top";
import { api } from "./ApiCore";
import ContentRow from "./Pages/ContentRow";
import Footer from "./Footer";
import Upcoming from "./Pages/Upcoming";
import { useRouter } from 'nextjs-toploader/app';
import Loading from "./Loading";
import Navbar from "./Navbar";
import Recent from "./Recent";
import ReactGA from 'react-ga4'
import Popup from "./Popup";
import AndroidPopup from "./Component/AndroidPopup";
import MonetagAd from "./Component/MonetagAd";

// Every homepage row lives here, in the order it renders. Adding a new
// category is a one-line addition to this array — nothing else in the
// component needs to change. `heroSource: true` marks the row that also
// feeds the <Top/> hero banner.
const ROWS = [
  {
    key: 'trending',
    title: 'Trending Movies Today',
    type: 'movie',
    endpoint: '/3/trending/movie/day?language=en-US',
    heroSource: true,
  },
  {
    key: 'series',
    title: 'Series Today',
    type: 'tv',
    endpoint: '/3/trending/tv/day?language=en-US',
  },
  {
    key: 'kseries',
    title: 'K Series',
    type: 'tv',
    endpoint: '/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=ko-KR&page=1&sort_by=popularity.desc&with_origin_country=KR&without_genres=10764,99,10767',
  },
  {
    key: 'popularTv',
    title: 'Popular List',
    type: 'tv',
    endpoint: '/3/discover/tv?include_adult=false&language=en-US&page=1&sort_by=vote_average.desc&vote_count.gte=200',
  },
  {
    key: 'nowPlaying',
    title: 'Now Playing in Theaters',
    type: 'movie',
    endpoint: '/3/movie/now_playing?language=en-US&page=1',
  },
  // Trailers isn't a normal poster row — it renders through <Upcoming/>
  // instead of <ContentRow/> — but it's still fetched the same way, so it
  // stays in this list to get the same parallel-fetch + fallback handling.
  {
    key: 'upcoming',
    title: 'Upcoming Trailers',
    type: 'movie',
    endpoint: '/3/movie/upcoming?language=en-US&page=1',
    render: 'trailer',
  },
  {
    key: 'anime',
    title: 'Anime',
    type: 'tv',
    endpoint: '/3/discover/tv?include_adult=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=16&with_origin_country=JP',
  },
  {
    key: 'action',
    title: 'Action Movies',
    type: 'movie',
    endpoint: '/3/discover/movie?include_adult=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=28',
  },
  {
    key: 'topRated',
    title: 'Top Rated Movies',
    type: 'movie',
    endpoint: '/3/movie/top_rated?language=en-US&page=1',
  },
];

export default function Home() {
  const router = useRouter()
  const [dataByKey, setDataByKey] = useState({})
  const [loading, setLoading] = useState(true)
  const [pageUnavailable, setPageUnavailable] = useState(false)

  const getData = useCallback(async () => {
    setLoading(true)
    setPageUnavailable(false)

    // All rows are fetched in parallel and independently, via
    // Promise.allSettled rather than a chain of sequential `await`s. A
    // single slow or broken category (there are 12 now) no longer holds up
    // — or takes down — everything else on the page.
    const results = await Promise.allSettled(ROWS.map((row) => api.get(row.endpoint)))

    const next = {}
    let failures = 0
    results.forEach((result, i) => {
      const { key } = ROWS[i]
      if (result.status === 'fulfilled') {
        next[key] = result.value?.results ?? []
      } else {
        console.error(`Failed to load "${key}":`, result.reason)
        next[key] = []
        failures += 1
      }
    })

    setDataByKey(next)
    // Only redirect away from the homepage if literally every category
    // failed — that's the "the API is unreachable" case. Any partial
    // failure should just render as an empty (or skipped) row.
    if (failures === ROWS.length) setPageUnavailable(true)
    setLoading(false)
  }, [])

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: "/landingpage", title: "Landing Page" });
    getData()
  }, [getData])

  useEffect(() => {
    if (pageUnavailable) router.push('/not-found')
  }, [pageUnavailable, router])

  if (loading) return <div><Loading /></div>

  const heroRow = ROWS.find((r) => r.heroSource)
  const heroList = dataByKey[heroRow?.key] ?? []

  return (
    <div className="w-[100vw] relative">
      <Popup words={"USE ADS-BLOCK FOR EASE OF USE"} />
      <AndroidPopup />
      <MonetagAd />
      <Navbar />
      <Top BackgroundList={heroList} />

      <section className="pb-5 md:pb-20 -mt-20 sm:-mt-32">
        <div><Recent /></div>

        {ROWS.map((row, i) => {
          const spacing = i === 0 ? 'min-h-80 md:min-h-96' : 'mt-10 md:mt-14 min-h-80 md:min-h-96'

          if (row.render === 'trailer') {
            return (
              <div key={row.key} className="min-h-80 md:min-h-96 my-10 md:my-10">
                <Upcoming Trailer={dataByKey[row.key] ?? []} />
              </div>
            )
          }

          return (
            <div key={row.key} className={spacing}>
              <ContentRow
                BackgroundList={dataByKey[row.key] ?? []}
                Title={row.title}
                type={row.type}
                mode="details"
              />
            </div>
          )
        })}
      </section>

      <Footer />
    </div>
  );
}