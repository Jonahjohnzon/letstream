"use client"
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'nextjs-toploader/app';
import { IoChevronDown } from "react-icons/io5";
import { movieGenre, tvGenre, countries, sortOptions, ratingOptions } from '../Genres';

/**
 * One reusable dropdown instead of the four/five near-identical
 * open/close/list blocks this used to be built from. `options` is always
 * `[{ id, label }]` — callers translate their own data shape into that.
 */
const Dropdown = ({ id, label, options, activeId, onSelect, isOpen, onToggle, widthClass, disabled, disabledLabel }) => {
  if (disabled) {
    return (
      <div
        className={`${widthClass} rounded-lg border-[1px] border-white border-opacity-20 px-2 py-2 text-gray-500 bg-black/40 cursor-not-allowed whitespace-nowrap overflow-hidden`}
        title={disabledLabel}
      >
        {disabledLabel}
      </div>
    );
  }

  const activeLabel = options.find((o) => String(o.id) === String(activeId))?.label ?? label;

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => onToggle(id)}
        className={`${widthClass} flex items-center justify-between gap-1 cursor-pointer outline-none bg-black rounded-lg border-white border-[1px] border-opacity-40 px-2 py-2 text-white whitespace-nowrap overflow-hidden hover:border-opacity-70 transition-colors`}
      >
        <span className="truncate">{activeLabel}</span>
        <IoChevronDown className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} size={14} />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className={`absolute z-30 ${widthClass} bg-black rounded-lg border-white border-[1px] border-opacity-40 mt-1 max-h-60 overflow-y-auto scrollbar-track-black scrollbar-thin scrollbar-thumb-slate-400`}
        >
          {options.map((opt) => (
            <button
              type="button"
              key={opt.id}
              role="option"
              aria-selected={String(opt.id) === String(activeId)}
              className={`w-full text-left px-2 py-2 whitespace-nowrap cursor-pointer hover:bg-slate-600 ${String(opt.id) === String(activeId) ? 'bg-slate-800 font-semibold' : ''}`}
              onClick={() => onSelect(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const InputBox = ({ params, searchParams }) => {
  const router = useRouter()
  const containerRef = useRef(null)
  const [openId, setOpenId] = useState(null)

  const currentYear = new Date().getFullYear();
  const { type, country, genre, date, sort } = params;
  const rating = searchParams?.rating ?? '';

  const years = useMemo(() => {
    const list = [];
    for (let year = currentYear; year >= 1940; year--) list.push(year);
    return list;
  }, [currentYear]);

  const isAnime = genre === '16' && type === 'tv';

  // Close whichever dropdown is open when a click lands outside the whole
  // filter bar. The original never did this — a dropdown, once opened,
  // only closed when you picked an option, not when you clicked away.
  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenId(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  const goTo = (next) => {
    setOpenId(null);
    const path = `/${next.type}/${next.genre}/${next.country}/${next.date}/${next.sort}/1`;
    const query = next.rating ? `?rating=${next.rating}` : '';
    router.push(path + query);
  };

  const genreOptions = (type === 'movie' ? movieGenre : tvGenre).map((g) => ({ id: String(g.id), label: g.name }));
  const countryOptions = countries.map((c) => ({ id: c.code, label: c.name }));
  const sortDropdownOptions = sortOptions.map((s) => ({ id: s.id, label: s.label }));
  const ratingDropdownOptions = ratingOptions.map((r) => ({ id: r.value, label: r.label }));

  return (
    <div ref={containerRef} className="flex flex-wrap items-center gap-3">
      <Dropdown
        id="year"
        label="Select Year"
        options={years.map((y) => ({ id: String(y), label: String(y) }))}
        activeId={date}
        isOpen={openId === 'year'}
        onToggle={toggle}
        widthClass="w-24 sm:w-32 lg:w-40"
        onSelect={(year) => goTo({ type, genre, country, date: year, sort, rating })}
      />

      <Dropdown
        id="sort"
        label="Sort by"
        options={sortDropdownOptions}
        activeId={sort}
        isOpen={openId === 'sort'}
        onToggle={toggle}
        widthClass="w-32 sm:w-40 lg:w-48"
        onSelect={(sortId) => goTo({ type, genre, country, date, sort: sortId, rating })}
      />

      {!isAnime && (
        <Dropdown
          id="genre"
          label="Genre"
          options={genreOptions}
          activeId={genre}
          isOpen={openId === 'genre'}
          onToggle={toggle}
          widthClass="w-24 sm:w-36 lg:w-44"
          onSelect={(genreId) => goTo({ type, genre: genreId, country, date, sort, rating })}
        />
      )}

      <Dropdown
        id="country"
        label="Country"
        options={countryOptions}
        activeId={country}
        isOpen={openId === 'country'}
        onToggle={toggle}
        widthClass="w-24 sm:w-36 lg:w-44"
        disabled={isAnime}
        disabledLabel="Japan (Anime)"
        onSelect={(code) => goTo({ type, genre, country: code, date, sort, rating })}
      />

      <Dropdown
        id="rating"
        label="Any Rating"
        options={ratingDropdownOptions}
        activeId={rating}
        isOpen={openId === 'rating'}
        onToggle={toggle}
        widthClass="w-24 sm:w-32 lg:w-36"
        onSelect={(value) => goTo({ type, genre, country, date, sort, rating: value })}
      />
    </div>
  )
}

export default InputBox