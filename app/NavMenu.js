"use client"
import React,{useEffect,useState, useRef} from 'react'
import { MdLocalMovies } from "react-icons/md";
import { TbJewishStarFilled } from "react-icons/tb";
import { IoLogOutSharp } from "react-icons/io5";
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { useSnapshot } from 'valtio';
import { state } from './store';
import { useRouter } from 'nextjs-toploader/app';
import { FaDiscord } from "react-icons/fa";



const NavMenu = () => {
  const router = useRouter()
  const show = useSnapshot(state).show
  const name = useSnapshot(state).name
  const menuRef = useRef(null);
   const log = useSnapshot(state).log
  

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      state.show = false
    }
  };


const Logout = async () => {
  const res = await fetch("/api/logout", { method: "POST" });
  const data = await res.json();

  if (data.success) {
    window.location.reload();
  }
};


  function capitalizeFirstLetter(text) {
    if (!text) return text; 
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
 
<AnimatePresence>
{show&&<motion.div 
      initial={{  x: 400 }}
    animate={{ x: 0 , transition:{ duration: 0.5 }}}
    exit={{  x: 400, transition:{ duration: 0.5 } }} 
    ref={menuRef} className='md:inline hidden fixed right-0 top-0 z-50 h-full border-l-white border-l-[1px] border-opacity-5 bg-gradient-to-b from-gray-900 to-black pt-40 w-60 px-5'>
        <div>
            <h1 className=' mb-4 text-sm font-bold'>Menu</h1>
            <p className = "mb-10 font-semibold flex items-center"><span className='mr-2'>Hello,</span> <span className=' font-bold text-green-500'>{capitalizeFirstLetter(name)}</span></p>
            <h1 className=' cursor-pointer hover:scale-90 transition-all mb-4 duration-300 ease-in-out text-lg font-semibold flex items-center' onClick={()=>{
              state.show = false
              router.push(`/history/1`)}}><span className=' mr-2'><MdLocalMovies/></span><p>Recent Watch</p></h1>
            <h1 className='  cursor-pointer hover:scale-90 transition-all mb-4 duration-300 ease-in-out text-lg font-semibold flex items-center' onClick={()=>{
              state.show = false
              router.push(`/wishlist/1`)}}><span className=' mr-2'><TbJewishStarFilled/></span><p>Wish List</p></h1>
            <h1 className=' cursor-pointer hover:scale-90 transition-all mb-4 duration-300 ease-in-out text-lg font-semibold flex items-center' onClick={()=>{
                 state.show = false
                router.push(`https://discord.gg/SdVZGGEw`)}}><span className=' mr-2' ><FaDiscord/></span><p>Discord</p></h1>
            {log &&<h1 className=' cursor-pointer hover:scale-90 font-semibold transition-all mb-4 duration-300 ease-in-out text-lg flex items-center' onClick={Logout}><span className=' mr-2' ><IoLogOutSharp/></span><p>Log Out</p></h1>}
        </div>
    </motion.div>}
  </AnimatePresence>
  )
}

export default NavMenu