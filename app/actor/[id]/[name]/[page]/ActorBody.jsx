"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { api, ApiError } from '@/app/ApiCore'
import MovieBlock from '@/app/Pages/MovieBlock'
import Footer from '@/app/Footer'
import Pagination from '@/app/[type]/[genre]/[country]/[date]/[sort]/[page]/Component/Pagination'
import { useRouter } from 'nextjs-toploader/app'
import { IoArrowBack } from 'react-icons/io5'

const PAGE_SIZE = 20

// Route params can arrive still percent-encoded depending on how the
// segment was built upstream (and once this bug existed, some URLs out
// there are now double/triple-encoded). Decoding in a loop until the
// string stops changing gets back to plain text regardless of how many
// times it was encoded, so we always encode from a known-clean base
// instead of stacking another layer on top of an unknown one.
function fullyDecode(value = '') {
  let prev = value
  for (let i = 0; i < 5; i++) {
    let next
    try {
      next = decodeURIComponent(prev)
    } catch {
      return prev // malformed sequence — bail with what we have rather than throw
    }
    if (next === prev) return next
    prev = next
  }
  return prev
}

function dedupeById(list) {
  const seen = new Set()
  return list.filter((item) => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

function sortByDateDesc(list, type) {
  const dateField = type === 'movie' ? 'release_date' : 'first_air_date'
  return [...list].sort((a, b) => {
    const dateA = a[dateField] ? new Date(a[dateField]).getTime() : 0
    const dateB = b[dateField] ? new Date(b[dateField]).getTime() : 0
    return dateB - dateA
  })
}

const ActorBody = ({ params, searchParams }) => {
  const router = useRouter()
  const { id, page } = params
  const currentPage = Number(page) || 1

  // Canonical, plain-text name — every URL we build from here on
  // encodes from THIS, once, never from the raw params.name directly.
  const displayName = fullyDecode(params.name)

  const activeTab = searchParams?.tab === 'tv' ? 'tv' : 'movie'

  const [person, setPerson] = useState(null)
  const [credits, setCredits] = useState({ movie: [], tv: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const ProfileApi = process.env.NEXT_PUBLIC_SIZEIMAGE300
  const addDefaultImg = (ev) => { ev.target.src = '/dfi.png' }

  useEffect(() => {
    let cancelled = false

    const getData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [personRes, creditsRes] = await Promise.all([
          api.get(`/3/person/${id}?language=en-US`),
          api.get(`/3/person/${id}/combined_credits?language=en-US`),
        ])
        if (cancelled) return

        const cast = creditsRes?.cast ?? []
        const movies = sortByDateDesc(dedupeById(cast.filter((c) => c.media_type === 'movie')), 'movie')
        const tv = sortByDateDesc(dedupeById(cast.filter((c) => c.media_type === 'tv')), 'tv')

        setPerson(personRes)
        setCredits({ movie: movies, tv })
      } catch (err) {
        if (cancelled) return
        console.error('Failed to load actor credits:', err)
        setError(err instanceof ApiError ? err.message : "Couldn't load results — try again.")
        setCredits({ movie: [], tv: [] })
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    getData()
    return () => { cancelled = true }
  }, [id])

  const activeList = credits[activeTab]
  const pages = Math.max(1, Math.ceil(activeList.length / PAGE_SIZE))
  const pageItems = useMemo(
    () => activeList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [activeList, currentPage]
  )

const from = searchParams?.from ? decodeURIComponent(searchParams.from) : null
const fromQuery = searchParams?.from ? `&from=${searchParams.from}` : ''

const goBack = () => {
  if (from) router.push(from)
  else router.back()
}

const goToPage = (nextPage) => {
  const clamped = Math.max(1, Math.min(nextPage, pages))
  router.push(`/actor/${id}/${encodeURIComponent(displayName)}/${clamped}?tab=${activeTab}${fromQuery}`)
}

const switchTab = (tab) => {
  if (tab === activeTab) return
  router.push(`/actor/${id}/${encodeURIComponent(displayName)}/1?tab=${tab}${fromQuery}`)
}

  return (
    <div className="w-[100vw] pt-14 sm:pt-12 font-semibold relative z-20 min-h-[100vh] flex flex-col items-center justify-center">
      <div className="w-[90%] 2xl:w-2/3 mb-10">
        <button
            type="button"
            aria-label="Go back"
            onClick={goBack}
            className="text-3xl mb-5 cursor-pointer"
            >
            <IoArrowBack />
            </button>

        <div className="flex items-center gap-4 mb-6">
          {person?.profile_path && (
            <img
              src={`${ProfileApi}${person.profile_path}`}
              onError={addDefaultImg}
              alt={person?.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-white border-opacity-20"
            />
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{person?.name || displayName}</h1>
            {person?.known_for_department && (
              <p className="text-gray-400 text-sm font-normal">{person.known_for_department}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            type="button"
            onClick={() => switchTab('movie')}
            className={`px-4 py-2 rounded-lg border-[1px] border-white border-opacity-40 transition-colors ${
              activeTab === 'movie' ? 'bg-red-900' : 'bg-black hover:bg-white/5'
            }`}
          >
            Movies <span className="text-gray-400 font-normal">({credits.movie.length})</span>
          </button>
          <button
            type="button"
            onClick={() => switchTab('tv')}
            className={`px-4 py-2 rounded-lg border-[1px] border-white border-opacity-40 transition-colors ${
              activeTab === 'tv' ? 'bg-red-900' : 'bg-black hover:bg-white/5'
            }`}
          >
            TV Shows <span className="text-gray-400 font-normal">({credits.tv.length})</span>
          </button>
        </div>

        <Pagination page={currentPage} noOfPages={pages} loading={loading} Right={() => goToPage(currentPage + 1)} Left={() => goToPage(currentPage - 1)} />

        <div className="mt-5 flex flex-wrap justify-center gap-4 min-h-[100vh]">
          {loading && Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="w-36 sm:w-48 h-60 sm:h-72 rounded-lg bg-white/5 animate-pulse" />
          ))}

          {!loading && error && (
            <p className="text-red-400 text-center w-full py-10">{error}</p>
          )}

          {!loading && !error && pageItems.length === 0 && (
            <p className="text-gray-400 text-center w-full py-10">
              No {activeTab === 'movie' ? 'movies' : 'TV shows'} found for this person.
            </p>
          )}

          {!loading && !error && pageItems.map((item) => (
            <div key={item.id} className="mb-4">
              <MovieBlock data={item} passType={activeTab} />
            </div>
          ))}
        </div>

        <Pagination page={currentPage} noOfPages={pages} loading={loading} Right={() => goToPage(currentPage + 1)} Left={() => goToPage(currentPage - 1)} />
      </div>
      <Footer />
    </div>
  )
}

export default ActorBody