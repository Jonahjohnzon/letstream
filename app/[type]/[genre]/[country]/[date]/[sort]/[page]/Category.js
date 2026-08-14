"use client"
import React, { useEffect, useState } from 'react'
import InputBox from './Component/InputBox'
import { api, ApiError } from '@/app/ApiCore'
import MovieBlock from '@/app/Pages/MovieBlock'
import Footer from '@/app/Footer'
import Pagination from './Component/Pagination'
import { sortOptions } from './Genres'
import { useRouter } from 'nextjs-toploader/app';
import MonetagAd from '@/app/Component/MonetagAd';

const TMDB_MAX_PAGE = 500; // TMDB hard-caps discover results at page 500.

// Builds the discover query with URLSearchParams instead of hand-rolled
// template-literal concatenation. The old version had
// `${genre != '16' && `&with_origin_country=${country}`}` inline in a
// template literal — when that condition was false, JS doesn't omit
// anything, it stringifies `false` straight into the URL
// (`with_genres=16false`), silently breaking Animation-movie and
// Anime-TV filtering. Building the params as an object sidesteps that
// whole class of bug.
function buildDiscoverQuery({ type, genre, country, date, sortId, page, minRating }) {
  const sortDef = sortOptions.find((s) => s.id === sortId) ?? sortOptions[0];
  const dateField = type === 'movie' ? 'primary_release_date' : 'first_air_date';
  const isAnime = genre === '16' && type === 'tv';

  const qp = new URLSearchParams({
    include_adult: 'false',
    include_video: 'false',
    language: 'en-US',
    page: String(page),
    sort_by: sortDef.field(type),
    with_genres: String(genre),
  });

  qp.set(`${dateField}.gte`, `${date}-01-01`);
  qp.set(`${dateField}.lte`, `${date}-12-31`);

  if (isAnime) {
    qp.set('with_origin_country', 'JP');
  } else {
    qp.set('with_origin_country', country);
  }

  if (sortDef.minVoteCount) qp.set('vote_count.gte', String(sortDef.minVoteCount));
  if (minRating) qp.set('vote_average.gte', minRating);

  return qp.toString();
}

const Category = ({ params, searchParams }) => {
  const router = useRouter()
  const { type, genre, country, date, sort: sortId, page } = params;
  const minRating = searchParams?.rating ?? '';

  const [pages, setPages] = useState(0)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false;

    const getData = async () => {
      setLoading(true)
      setError(null)
      try {
        const query = buildDiscoverQuery({ type, genre, country, date, sortId, page, minRating });
        const response = await api.get(`/3/discover/${type}?${query}`);
        if (cancelled) return;
        setData(response?.results ?? []);
        setPages(Math.min(response?.total_pages ?? 0, TMDB_MAX_PAGE));
      } catch (err) {
        if (cancelled) return;
        console.error('Failed to load category results:', err);
        setError(err instanceof ApiError ? err.message : 'Couldn\'t load results — try again.');
        setData([]);
        setPages(0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    getData();
    // This is the fix for the main bug: the original effect ran once
    // (`[]`) and never again, so changing year/genre/sort/rating/page
    // updated the URL and the pagination display but left the grid
    // showing stale results. Re-running whenever any filter or the page
    // itself changes is what makes the filters actually work.
    return () => { cancelled = true };
  }, [type, genre, country, date, sortId, page, minRating]);

  const currentPage = Number(page) || 1;

  const goToPage = (nextPage) => {
    const clamped = Math.max(1, Math.min(nextPage, pages || 1));
    router.push(`/${type}/${genre}/${country}/${date}/${sortId}/${clamped}${minRating ? `?rating=${minRating}` : ''}`);
  };

  return (
    <div className="w-[100vw] pt-24 sm:pt-32 font-semibold relative z-20 min-h-[100vh] flex flex-col items-center justify-center">
      <MonetagAd />
      <div className="w-[90%] 2xl:w-2/3 mb-10">
        <div className="mb-5"><InputBox params={params} searchParams={searchParams} /></div>

        <Pagination page={currentPage} noOfPages={pages} loading={loading} Right={() => goToPage(currentPage + 1)} Left={() => goToPage(currentPage - 1)} />

        <div className="mt-5 flex flex-wrap justify-center gap-4 min-h-[100vh]">
          {loading && Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="w-36 sm:w-48 h-60 sm:h-72 rounded-lg bg-white/5 animate-pulse" />
          ))}

          {!loading && error && (
            <p className="text-red-400 text-center w-full py-10">{error}</p>
          )}

          {!loading && !error && data.length === 0 && (
            <p className="text-gray-400 text-center w-full py-10">
              Nothing matches these filters yet — try widening the year range or clearing a filter.
            </p>
          )}

          {!loading && !error && data.map((item) => (
            <div key={item.id} className="mb-4">
              <MovieBlock data={item} passType={type} />
            </div>
          ))}
        </div>

        <Pagination page={currentPage} noOfPages={pages} loading={loading} Right={() => goToPage(currentPage + 1)} Left={() => goToPage(currentPage - 1)} />
      </div>
      <Footer />
    </div>
  )
}

export default Category