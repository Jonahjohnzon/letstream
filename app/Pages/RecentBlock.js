import React from 'react'
import { useRouter } from 'nextjs-toploader/app';
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import { FaStar } from "react-icons/fa";
import { History, saveToRecentlyWatched } from '../history';

const RecentBlock = ({data, passType = ""}) => {

    const Api = process.env.NEXT_PUBLIC_SIZEIMAGE;
    const router = useRouter();
    const type =  data.media_type? data.media_type == "movie" ? 'movie':'tv' : passType
    const season = data?.season || '1'
    const episode = data?.episode || '1'
    const addDefaultImg = ev => {
      ev.target.src = "/dfi.png"
   }
  return (
    <LazyLoadComponent effect="blur" className=" w-full"     wrapperProps={{
style: {transitionDelay: "1s"},
}}>
    <div  role="img" aria-label="movie image" title="movie image"  className=' rounded-lg cursor-pointer overflow-hidden w-36 sm:w-48 h-60 sm:h-72  group relative ' onClick={()=>{
      window.open("https://poawooptugroo.com/4/8808782")

      router.push(`/stream/${type}/${data?.id}/${season}/${episode}`)}
       } >
      <img onError={addDefaultImg} className=' w-full h-full object-cover object-center absolute z-10 ' src={data?.url?`${data.poster_path}`:`${Api}${data.poster_path}`} loading='lazy' alt={data.name || data.original_name || data.title}/>
        <div className=' flex justify-center items-end bg-black w-full h-full absolute z-20 bg-opacity-0 group-hover:bg-opacity-80 transition-all duration-300 ease-in-out'>
          <div className=' px-2  font-bold w-full opacity-0   group-hover:opacity-100 transition-all text-center flex flex-col items-center absolute -bottom-10 group-hover:bottom-10 duration-300 ease-in-out'>
            <p className=' text-lg font-semibold'>{data.name || data.original_name || data.title}</p>
            <div className=' flex items-center w-fit justify-center'><p className=' text-yellow-300 mr-2'><FaStar/></p><p>{data?.url?`${data.vote_average}`:Math.ceil(data.vote_average)}/10</p></div>
          </div>
        </div>
        {type == 'tv'&&<div className=' flex font-semibold text-xs bg-black bg-opacity-80 items-center absolute bottom-0 left-0 p-1 rounded-tr-lg z-40'>
          <div className=' mr-1'>S{season}</div>
          <div>E{episode}</div>
        </div>}
    </div> 
    </LazyLoadComponent>
  )
}

export default RecentBlock