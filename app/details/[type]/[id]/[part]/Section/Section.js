import React, { useEffect, useRef, useState } from 'react'
import Apicore from '@/app/ApiCore'
import List from './List'
import { useRouter } from 'nextjs-toploader/app'
import { FaAngleDown } from "react-icons/fa"

const api = new Apicore()

const Section = ({ season, id, part, Detail }) => {
  const router = useRouter()
  const [list, setList] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const GetSeason = async () => {
      try {
        const response = await api.get(`/3/tv/${id}/season/${part}?language=en-US`)
        setList(response?.episodes || [])
      } catch (error) {
        console.log(error)
      }
    }
    GetSeason()
  }, [id, part])

  return (
    <div className='flex justify-center w-full pb-20'>
      <div className='w-[95%] sm:w-[90%] xl:w-2/3'>
        <div ref={dropdownRef} className="z-40 relative w-[80%] sm:w-36">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full sm:text-lg flex items-center justify-between border-[2px] bg-transparent font-semibold border-white border-opacity-50 p-4 rounded-md text-left"
          >
            <span>{`Season ${part}`}</span>
            <FaAngleDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          {isOpen && (
            <div className="absolute mt-2 bg-black border border-white border-opacity-50 rounded-md max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 w-full z-10">
              {season.map((s) => (
                <div
                  key={s}
                  onClick={() => { setIsOpen(false); router.push(`/details/tv/${id}/${s}`) }}
                  className="cursor-pointer hover:bg-slate-600 p-3 font-semibold"
                >
                  {`Season ${s}`}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-5">
          <List list={list} id={id} Detail={Detail} />
        </div>
      </div>
    </div>
  )
}

export default Section