"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Formik, Form, Field } from 'formik'
import { api, ApiError } from '@/app/ApiCore'
import MovieBlock from '@/app/Pages/MovieBlock'
import Pagination from '@/app/[type]/[genre]/[country]/[date]/[sort]/[page]/Component/Pagination'
import Button from '@/app/Component/Button'
import Block from '@/app/series/telenovelas/[page]/Component/Block'
import BackButton from '@/app/Component/BackButton'
import SkeletonGrid from '@/app/Component/SkeletonGrid'
import EmptyState from '@/app/Component/EmptyState'

const Layout = ({ type, texts, page }) => {
  const text = decodeURIComponent(texts)
  const router = useRouter()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagesNo, setPageNo] = useState(0)

  const handleSubmit = (values) => {
    const { query } = values
    if (!query.trim()) return
    // No more movie/TV choice to carry through — reuse whatever `type`
    // this page already has (telenovela stays telenovela, anything else
    // goes through the combined multi-search below).
    router.push(`/search/${type}/${encodeURIComponent(query)}/1`)
  }

  useEffect(() => {
    let cancelled = false

    const runSearch = async () => {
      if (!text?.trim()) {
        setList([])
        setPageNo(0)
        setLoading(false)
        return
      }
      setLoading(true)
      setError(null)
      try {
        let results = []
        let totalPages = 0

        if (type === 'telenovela') {
          const res = await fetch(`/api/searchtelenovela?title=${encodeURIComponent(text)}&page=${page}`)
          const data = await res.json()
          if (!res.ok) throw new Error(data?.message || 'Search failed')
          results = data.series || []
          totalPages = data?.pagination?.totalPages || 0
        } else {
          // /search/multi returns movies, tv shows, and people together —
          // each item carries its own media_type, so one request covers
          // both movies and series without asking the user to pick.
          const response = await api.get(
            `/3/search/multi?query=${encodeURIComponent(text)}&include_adult=false&language=en-US&page=${page}`
          )
          results = (response?.results || []).filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
          totalPages = response?.total_pages || 0
        }

        if (cancelled) return
        setList(results)
        setPageNo(totalPages)
      } catch (err) {
        if (cancelled) return
        console.error('Search failed:', err)
        setError(err instanceof ApiError ? err.message : "Couldn't load results — try again.")
        setList([])
        setPageNo(0)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    runSearch()
    // Re-runs whenever the search text, type, or page actually changes —
    // the original ran once on mount only, so a new search term or a
    // page click updated the URL but left stale results on screen.
    return () => { cancelled = true }
  }, [type, text, page])

  const goToPage = (nextPage) => {
    router.push(`/search/${type}/${encodeURIComponent(text)}/${nextPage}`)
  }

  return (
    <div className="relative min-h-[100vh] flex justify-center">
      <BackButton onClick={() => router.back()} />

      <div className="pt-14 sm:pt-24 w-[95%] md:w-[80%] xl:w-2/3 flex flex-col items-center">
        <button
          type="button"
          className="mb-3 cursor-pointer hover:scale-95 transition-all duration-300 ease-in-out"
          onClick={() => router.push('/')}
        >
          <img src="/logologo.png" className="w-14 sm:w-20" alt="Logo" />
        </button>

        <p className="mb-6 font-semibold text-xl text-white text-opacity-80">Search for movies and series</p>

        <Formik initialValues={{ query: text || '' }} onSubmit={handleSubmit} enableReinitialize>
          {() => (
            <Form className="w-[90%] sm:w-[70%] flex flex-col items-center">
              <div className="mb-8 w-full">
                <Field
                  name="query"
                  className="w-full h-12 border-white border-[2px] border-opacity-40 bg-transparent rounded-xl px-4 focus:outline-none focus:border-opacity-80 transition-colors"
                  type="text"
                  placeholder="Search for movies or series"
                />
              </div>

              <button type="submit" className="mb-10">
                <Button title={"Search"} />
              </button>
            </Form>
          )}
        </Formik>

        <div className="w-full min-h-[100vh]">
          {loading && <SkeletonGrid />}

          {!loading && error && <EmptyState message={error} />}

          {!loading && !error && list.length === 0 && (
            <EmptyState message={`No results for "${text}" — try a different search.`} />
          )}

          {!loading && !error && list.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4">
              {list.map((data) => (
                <div key={data.id || data._id}>
                  {type === 'telenovela' ? (
                    <Block data={data} />
                  ) : (
                    <MovieBlock data={data} passType={data.media_type || type} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-full my-5">
          <Pagination page={Number(page)} noOfPages={pagesNo} Right={() => goToPage(Number(page) + 1)} Left={() => goToPage(Number(page) - 1)} />
        </div>
      </div>
    </div>
  )
}

export default Layout