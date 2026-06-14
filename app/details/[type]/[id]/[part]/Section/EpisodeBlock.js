import React from 'react'
import { CiPlay1 } from "react-icons/ci";
import { useRouter } from 'nextjs-toploader/app';
import { saveToRecentlyWatched,History } from '@/app/history';
import { truncateText } from '@/app/Text';

const EpisodeBlock = ({data,id, Detail}) => {
    const ImageApi = process.env.NEXT_PUBLIC_SIZEIMAGE45
          const router = useRouter()
          let airDate = data?.air_date ? new Date(data.air_date) : null
          let currentDate = new Date()
    
          const addDefaultImg = ev => {
            ev.target.src = "/dfi.png"
         }

  return (
    <>
   <div className=' w-full h-full hover:scale-95 cursor-pointer transition-all duration-500 ease-in-out' onClick={()=>{
      if (airDate < currentDate && airDate )
      {
      window.open("https://omg10.com/4/10438662")
      router.push(`/stream/tv/${id}/${data.season_number}/${data.episode_number}`)
      }
    }}>
        <section className=' flex items-center h-full w-full rounded-md overflow-hidden'>
            <div className=' w-40 rounded-md relative h-full  ' >
              <img className=' absolute object-cover object-center w-full h-full z-10' src={`${ImageApi}${data.still_path}`} onError={addDefaultImg} loading='lazy'/>
                <div className=' w-full h-full relative z-20 flex justify-center items-center'>
                    <div className=' w-10 h-10 flex items-center justify-center rounded-full bg-opacity-60 bg-black'>
                    <CiPlay1 className=' text-opacity-100 text-white'/>
                    </div> 
                    <div className=' absolute bottom-0 left-0 h-5 min-w-5 flex justify-center items-center font-bold bg-opacity-60 rounded-tr-lg text-sm bg-black'>
                      {data.episode_number}
                    </div>
                </div>
            </div>
            <div className=' overflow-hidden bg-gray-900 h-full w-full px-2 py-2 italic relative'>
                <h1 className=' font-bold'>{data?.name}</h1>
                <p className=' relative w-[90%] z-30 text-opacity-50 text-xs sm:text-sm md:text-base text-white'>{truncateText(data?.overview, 120)}</p>
                {airDate < currentDate ||<div className=' absolute bottom-1 right-1 z-10'>
                  <img src='/nota.png' className=' w-36'/>
                </div>}
            </div>
        </section>
    </div></>
  )
}

export default EpisodeBlock