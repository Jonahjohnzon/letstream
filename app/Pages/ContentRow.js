'use client'
import React, { useRef, useState, useCallback } from 'react'
import TitleBar from '../Component/TitleBar'
import PosterCard from '../Component/PosterCard'
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

/**
 * Shared horizontal row used for both the discovery grids ("details" mode,
 * previously TrendingToday) and the continue-watching row ("continue" mode,
 * previously RecentWatch). Adds desktop scroll arrows and edge fades so a
 * scrollable row actually looks scrollable, instead of relying on people
 * discovering the horizontal-scroll affordance by accident.
 */
const ContentRow = ({ BackgroundList, Title, type, mode = "details" }) => {
  const scrollerRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 8)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }, [])

  const scrollBy = (dir) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' })
  }

  if (!BackgroundList || BackgroundList.length === 0) {
    return (
      <div className="bg-transparent relative z-40 flex flex-col items-center">
        <div className="w-[95%] 2xl:w-5/6 mb-5 px-2"><TitleBar title={Title} /></div>
        <p className="w-[95%] 2xl:w-5/6 text-gray-500 text-sm px-2">Nothing to show here yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-transparent relative z-40 flex flex-col items-center">
      <div className="w-[95%] 2xl:w-5/6 mb-5 px-2"><TitleBar title={Title} /></div>

      <section className="relative w-[95%] 2xl:w-5/6 group/row">
        {canScrollLeft && (
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollBy(-1)}
            className="hidden md:flex items-center justify-center absolute left-0 top-0 bottom-0 z-30 w-10 bg-gradient-to-r from-black/80 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <IoChevronBack size={28} />
          </button>
        )}
        {canScrollRight && (
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollBy(1)}
            className="hidden md:flex items-center justify-center absolute right-0 top-0 bottom-0 z-30 w-10 bg-gradient-to-l from-black/80 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <IoChevronForward size={28} />
          </button>
        )}

        <div
          ref={scrollerRef}
          onScroll={updateArrows}
          onLoad={updateArrows}
          className="flex items-center overflow-x-scroll scrollbar-none scroll-smooth"
        >
          {BackgroundList.map((data, i) => (
            // id alone isn't guaranteed unique here (the same title can
            // legitimately appear twice in "recently watched" at different
            // timestamps) — pairing it with the index is a safe compromise
            // without falling back to an index-only key.
            <div key={`${data.id ?? data.url ?? 'item'}-${i}`} className="m-2">
              <PosterCard data={data} passType={type} mode={mode} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default ContentRow