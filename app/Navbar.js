'use client'
import React, { useEffect } from 'react'
import { FiSearch } from "react-icons/fi";
import { useSnapshot } from 'valtio';
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from 'nextjs-toploader/app';
import { state } from './store';
import { getCookies } from './getCookie';
import { getUserDetail } from './history';
import { IoMdMenu } from "react-icons/io";

const NAV_LINKS = (previousYear) => [
  { label: 'Home', href: '/' },
  { label: 'Movies', href: `/movie/28/US/${previousYear}/1/1` },
  { label: 'Series', href: `/tv/10759/US/${previousYear}/1/1` },
  { label: 'K-Drama', href: `/tv/10759/KR/${previousYear}/1/1` },
  { label: 'Animes', href: `/tv/16/JP/${previousYear}/1/1` },
]

const Navbar = ({ active }) => {
  const router = useRouter()
  const log = useSnapshot(state).log
  const previousYear = new Date().getFullYear() - 1;

  useEffect(() => {
    let cancelled = false

    const checkAuth = async () => {
      const cookie = await getCookies()
      if (cancelled) return

      if (cookie) {
        const user = await getUserDetail()
        if (cancelled) return
        state.log = true
        state.id = user?.user_id
        state.name = user?.user_name
      } else {
        state.log = false
      }
    }

    checkAuth()
    // Empty dependency array — this only needs to run once when the navbar
    // mounts. Previously this ran with no array at all, so it re-fired on
    // every render (including the ones it caused by writing to `state`),
    // hammering the cookie/user-detail endpoints continuously.
    return () => { cancelled = true }
  }, [])

  return (
    <nav className={`px-5 md:px-10 2xl:px-36 ${active ? 'pt-2 pb-2 bg-gray-950 fixed bg-opacity-70' : 'pt-12 absolute'} top-0 z-40 w-full`}>
      <section className="flex items-center justify-between w-full">
        <div className="flex items-center cursor-pointer" onClick={() => router.push('/')}>
          <img src="/logologo.png" alt="ScreenOpps" className={`${active ? 'w-8 sm:w-12' : 'w-8 sm:w-10 md:w-16'} mr-2`} />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold">Screenopps</h2>
        </div>

        <ul className="md:flex w-[50%] hidden lg:w-[45%] xl:w-4/12 text-white justify-between font-bold items-center text-xl">
          {NAV_LINKS(previousYear).map((link) => (
            <li
              key={link.label}
              className="cursor-pointer hover:scale-[90%] transition-all duration-300 ease-in-out"
              onClick={() => router.push(link.href)}
            >
              {link.label}
            </li>
          ))}
        </ul>

        <div className="flex items-center text-2xl w-[22%] sm:w-[18%] md:w-[12%] lg:w-[10%] 2xl:w-[8%] 3xl:w-[7%] justify-between">
          <button
            type="button"
            aria-label="Search"
            className="cursor-pointer scale-[120%] hover:scale-[110%] transition-all duration-300 ease-in-out"
            onClick={() => router.push('/search/movie/1/1')}
          >
            <FiSearch />
          </button>
          <button
            type="button"
            aria-label="Open menu"
            className="md:hidden inline"
            onClick={() => { state.showmenu = true }}
          >
            <IoMdMenu />
          </button>
          <div className="hidden md:inline">
            {log ? (
              <button
                type="button"
                aria-label="Account"
                className="cursor-pointer border-[1px] hover:scale-[90%] transition-all duration-300 ease-in-out border-white min-w-10 min-h-10 rounded-full"
                onClick={() => { state.show = true }}
              >
                <img src="/13.png" alt="" className="w-10" />
              </button>
            ) : (
              <button
                type="button"
                aria-label="Sign up"
                className="cursor-pointer hover:text-gray-400"
                onClick={() => { state.signUp = true }}
              >
                <FaUserCircle />
              </button>
            )}
          </div>
        </div>
      </section>
    </nav>
  )
}

export default Navbar