"use client"
import React,{useEffect,useState, useRef} from 'react'
import { MdLocalMovies, MdMovie } from "react-icons/md";
import { TbJewishStarFilled } from "react-icons/tb";
import { IoLogOutSharp } from "react-icons/io5";
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { useSnapshot } from 'valtio';
import { state } from './store';
import { useRouter } from 'nextjs-toploader/app';
import { FaDiscord } from "react-icons/fa";
import { FaFilm } from "react-icons/fa6";
import { GiReactor } from "react-icons/gi";
import { FaUserCircle } from "react-icons/fa";
import { MdLiveTv } from "react-icons/md";






const Menu = () => {
  const router = useRouter()
  const previousYear = new Date().getFullYear() - 1;
  const show = useSnapshot(state).showmenu
  const name = useSnapshot(state).name
  const menuR = useRef(null);
   const log = useSnapshot(state).log
  

  const handleClickOutside = (event) => {
    if (menuR.current && !menuR.current.contains(event.target)) {
      state.showmenu = false
    }
  };


const Logout = async () => {
  const res = await fetch("/api/logout", { method: "POST" });
  const data = await res.json();

  if (data.success) {
    window.location.reload();
  }
};


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
    ref={menuR} className=' inline md:hidden fixed right-0 top-0 z-50 h-full border-l-white border-l-[1px] border-opacity-5 bg-gradient-to-b from-gray-900 to-black pt-10 w-60 px-5'>
        <div className=' flex flex-col items-start'>
            <h1 className=' mb-4 text-sm font-bold'>Menu</h1>
            <div className=' md:hidden mb-5 inline'>{log?
                <div className=' cursor-pointer border-[1px]  transition-all duration-300 ease-in-out border-white rounded-full' >
                    <img src='/13.png' className=' w-10 '/>
                    </div>:
                <div className=' cursor-pointer  hover:text-gray-400 flex items-center' onClick={()=>{
                state.signUp = true
            }}><FaUserCircle className='scale-[150%] mr-3'/><p className=' text-lg font-semibold'>Login</p></div>}</div>
            <h1 className=' md:hidden cursor-pointer hover:scale-90 transition-all mb-4 duration-300 ease-in-out text-lg font-semibold flex items-center' onClick={()=>{
                 state.showmenu = false
                router.push(`/movie/28/US/${previousYear}/1/1`)
            }}><span className=' mr-2'><MdMovie/></span><p>Movies</p></h1>
            <h1 className=' md:hidden cursor-pointer hover:scale-90 transition-all mb-4 duration-300 ease-in-out text-lg font-semibold flex items-center' onClick={()=>{
                 state.showmenu = false
                 router.push(`/tv/10759/US/${previousYear}/1/1`)
            }}><span className=' mr-2'><FaFilm/></span><p>Series</p></h1>
            <h1 className=' md:hidden cursor-pointer hover:scale-90 transition-all mb-4 duration-300 ease-in-out text-lg font-semibold flex items-center' onClick={()=>{
                 state.showmenu = false
                 router.push(`/tv/10759/KR/${previousYear}/1/1`)
            }}><span className=' mr-2'><FaFilm/></span><p>K-Drama</p></h1>
            <h1 className=' md:hidden cursor-pointer hover:scale-90 transition-all mb-4 duration-300 ease-in-out text-lg font-semibold flex items-center' onClick={()=>{
                 state.showmenu = false
                router.push(`/tv/16/JP/${previousYear}/1/1`)
            }}><span className=' mr-2'><GiReactor/></span><p>Animes</p></h1>
            {log &&<h1 className=' cursor-pointer hover:scale-90 transition-all mb-4 duration-300 ease-in-out text-lg font-semibold flex items-center' onClick={()=>{
              state.showmenu = false
              router.push(`/history/1`)}}><span className=' mr-2'><MdLocalMovies/></span><p>Recent Watch</p></h1>}
            {log &&<h1 className='  cursor-pointer hover:scale-90 transition-all mb-4 duration-300 ease-in-out text-lg font-semibold flex items-center' onClick={()=>{
              state.showmenu = false
              router.push(`/wishlist/1`)}}><span className=' mr-2'><TbJewishStarFilled/></span><p>Wish List</p></h1>}
            <h1 className=' hidden cursor-pointer hover:scale-90 transition-all mb-4 duration-300 ease-in-out text-lg font-semibold md:flex items-center' onClick={()=>{

              }}><span className=' mr-2' onClick={()=>{
                state.showmenu = false
                router.push(`https://discord.gg/SdVZGGEw`)}}><FaDiscord/></span><p>Discord</p></h1>
            {log &&<h1 className=' cursor-pointer hover:scale-90 font-semibold transition-all mb-4 duration-300 ease-in-out text-lg flex items-center' onClick={Logout}><span className=' mr-2' ><IoLogOutSharp/></span><p>Log Out</p></h1>}
        </div>
    </motion.div>}
  </AnimatePresence>
  )
}

export default Menu