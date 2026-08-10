"use client"
import React, { useRef } from 'react'
import { MdLocalMovies } from "react-icons/md"
import { TbJewishStarFilled } from "react-icons/tb"
import { IoLogOutSharp } from "react-icons/io5"
import { AnimatePresence, motion } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { state } from './store'
import { useRouter } from 'nextjs-toploader/app'
import { FaDiscord } from "react-icons/fa"
import MenuLink from './Menu/MenuLink'
import { useOutsideClick } from './Menu/useOutsideClick'
import { useLogout } from './Menu/useLogout'
import { capitalizeFirstLetter } from './Menu/textUtils'

const DISCORD_URL = 'https://discord.gg/SdVZGGEw'

const NavMenu = () => {
  const router = useRouter()
  const show = useSnapshot(state).show
  const name = useSnapshot(state).name
  const log = useSnapshot(state).log
  const menuRef = useRef(null)
  const logout = useLogout()

  useOutsideClick(menuRef, () => { state.show = false })

  const navigate = (path) => {
    state.show = false
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
          className="md:inline hidden fixed right-0 top-0 z-50 h-full border-l-[1px] border-white border-opacity-5 bg-gradient-to-b from-gray-900 to-black pt-40 w-64 px-5"
        >
          <div>
            <h2 className="mb-4 text-sm font-bold text-gray-400 uppercase tracking-wide">Menu</h2>
            <p className="mb-8 font-semibold flex items-center">
              <span className="mr-2">Hello,</span>
              <span className="font-bold text-green-500">{capitalizeFirstLetter(name)}</span>
            </p>

            {/* Unlike the mobile Menu, these two aren't gated behind `log` —
                kept as-is since I can't tell if that's intentional for
                desktop. Wrap in `log && (...)` if it should match mobile. */}
            <MenuLink icon={<MdLocalMovies />} label="Recent Watch" onClick={() => navigate('/history/1')} />
            <MenuLink icon={<TbJewishStarFilled />} label="Wish List" onClick={() => navigate('/wishlist/1')} />

            <MenuLink icon={<FaDiscord />} label="Discord" href={DISCORD_URL} />

            {log && (
              <MenuLink icon={<IoLogOutSharp />} label="Log Out" onClick={() => { state.show = false; logout() }} />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default NavMenu