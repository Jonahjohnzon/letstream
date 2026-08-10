"use client"
import React, { useRef } from 'react'
import { MdLocalMovies, MdMovie } from "react-icons/md"
import { TbJewishStarFilled } from "react-icons/tb"
import { IoLogOutSharp } from "react-icons/io5"
import { AnimatePresence, motion } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { state } from './store'
import { useRouter } from 'nextjs-toploader/app'
import { FaDiscord, FaFilm, FaUserCircle } from "react-icons/fa"
import { GiReactor } from "react-icons/gi"
import MenuLink from './Menu/MenuLink'
import { useOutsideClick } from './Menu/useOutsideClick'
import { useLogout } from './Menu/useLogout'

const DISCORD_URL = 'https://discord.gg/SdVZGGEw'

const Menu = () => {
  const router = useRouter()
  const previousYear = new Date().getFullYear() - 1
  const show = useSnapshot(state).showmenu
  const log = useSnapshot(state).log
  const menuRef = useRef(null)
  const logout = useLogout()

  useOutsideClick(menuRef, () => { state.showmenu = false })

  const navigate = (path) => {
    state.showmenu = false
    router.push(path)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: 400 }}
          animate={{ x: 0, transition: { duration: 0.5 } }}
          exit={{ x: 400, transition: { duration: 0.5 } }}
          ref={menuRef}
          className="inline md:hidden fixed right-0 top-0 z-50 h-full border-l-[1px] border-white border-opacity-5 bg-gradient-to-b from-gray-900 to-black pt-10 w-64 px-5 overflow-y-auto"
        >
          <div className="flex flex-col items-start">
            <h2 className="mb-4 text-sm font-bold text-gray-400 uppercase tracking-wide">Menu</h2>

            <div className="mb-6">
              {log ? (
                <div className="cursor-pointer border-[1px] border-white rounded-full overflow-hidden w-10 h-10">
                  <img src="/13.png" className="w-full h-full object-cover" alt="Profile" />
                </div>
              ) : (
                <button
                  type="button"
                  className="cursor-pointer hover:text-gray-400 flex items-center"
                  onClick={() => { state.signUp = true }}
                >
                  <FaUserCircle className="text-2xl mr-3" />
                  <span className="text-lg font-semibold">Login</span>
                </button>
              )}
            </div>

            <div className="w-full">
              <MenuLink icon={<MdMovie />} label="Movies" onClick={() => navigate(`/movie/28/US/${previousYear}/1/1`)} />
              <MenuLink icon={<FaFilm />} label="Series" onClick={() => navigate(`/tv/10759/US/${previousYear}/1/1`)} />
              <MenuLink icon={<FaFilm />} label="K-Drama" onClick={() => navigate(`/tv/10759/KR/${previousYear}/1/1`)} />
              <MenuLink icon={<GiReactor />} label="Animes" onClick={() => navigate(`/tv/16/JP/${previousYear}/1/1`)} />
            </div>

            {log && (
              <>
                <MenuLink icon={<MdLocalMovies />} label="Recent Watch" onClick={() => navigate('/history/1')} />
                <MenuLink icon={<TbJewishStarFilled />} label="Wish List" onClick={() => navigate('/wishlist/1')} />
              </>
            )}

            <MenuLink icon={<FaDiscord />} label="Discord" href={DISCORD_URL} />

            {log && (
              <MenuLink icon={<IoLogOutSharp />} label="Log Out" onClick={() => { state.showmenu = false; logout() }} />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Menu