"use client"
import Apicore from '@/app/ApiCore'
import WishlistButton from '@/app/Component/WishlistButton';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'nextjs-toploader/app';
import Recommend from './Recommended/Recommend';
import Footer from '@/app/Footer';
import Section from './Section/Section';
import Loading from '@/app/Loading';
import { IoArrowBack } from "react-icons/io5";
import { getWishlistId, WishList } from '@/app/history';
import TrailerBox from './Comment';
import Button from '@/app/Component/Button';
import { useSnapshot } from 'valtio';
import { state } from '@/app/store';
import ReactGA from 'react-ga4'

const Bodyjs =  ({params}) => {
  const load = useSnapshot(state).wishload
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [wishshow, setwishshow] = useState(false)
  const [wishlistArray, setWishlistArray] = useState([])
  const [rec, setRec] = useState([])
  const [season, setSeason] = useState([])
  const [url, setUrl] = useState()
  const Api = process.env.NEXT_PUBLIC_SIZEIMAGE1280;
  const Size = process.env.NEXT_PUBLIC_SIZEIMAGE300
  const [Detail, setDetail] = useState({})
  const id =  params?.id
  const type = params?.type
  const part =  params?.part
  const api = new Apicore()
  const GetDetails = async () =>{
    setLoading(true)
    let response;
    try{
    if(type == 'movie')
    {
      response = await api.get(`/3/movie/${id}?language=en-US`)
      setDetail(response)
     
    }
    else{
      response = await api.get(`/3/tv/${id}?language=en-US`)
      setDetail(response)
      const seasonNo = response.number_of_seasons
      const array = Array.from({ length: seasonNo }, (_, i) => i + 1);
      setSeason(array)
    }
    const wishlistId = await getWishlistId()
    setWishlistArray(wishlistId || [])
    const ur = await api.get(`/3/${type}/${id}/recommendations?language=en-US&page=1`);
    if(type == 'movie')
    {
    const trailer =  await api.get(`/3/movie/${id}/videos?language=en-US`)
    const dataresult = trailer.results
    const result = dataresult.find(item => item.type === "Trailer");
    setUrl(result?.key)
    }
    else{
      const trailer =  await api.get(`/3/tv/${id}/videos?language=en-US`)
      const dataresult = trailer.results
      const result = dataresult.find(item => item.type === "Trailer");
      setUrl(result?.key) 
    }
    setRec(ur.results)
  }
  catch(error)
  {
    console.log(error)
  }finally{
    setLoading(false)
  }
  }
  useEffect(()=>{
    ReactGA.send({ hitType: "pageview", page: "/detail", title: "Body Page" });
    GetDetails()
  },[])

  let airDate =Detail?.release_date ? new Date(Detail?.release_date) : null;
  let currentDate = new Date()
  if(loading)
    return <div><Loading/></div>
  const historyBody = {
    id:Detail?.id,
    media_type:type,
    poster_path:Detail?.poster_path,
    name:Detail?.name,
    original_name:Detail?.original_name,
    title:Detail?.title,
    vote_average:Detail?.vote_average,
    season:'1',
    episode:'1'
  }
  const PUSH = async()=>{
    const info = await WishList(historyBody)
    if(info)
    {
    setwishshow(true)
    }
    else{
      setwishshow(false)
    }
  }

  const addDefaultImg = ev => {
    ev.target.src = "/dfi.png"
 }
  return (
    <section className=' relative min-h-[100vh]'>
      <div      
      className="relative top-0 left-0 w-[100vw] h-full  bg-cover bg-center"
          style={{
            backgroundImage: `url(${Api}${Detail.backdrop_path})`,
          }}>

      
      <div className=" py-20 md:py-40  w-full flex justify-center items-center h-full top-0 bg-gradient-to-b from-[rgba(0,0,0,0.5)]  to-[rgba(0,0,0,1)]">
        <div className=' top-7 z-50 left-7 text-4xl cursor-pointer absolute' onClick={()=>{
          router.push('/')
        }}><IoArrowBack /></div>
        <section className='  w-[95%] md:w-[90%] 2xl:w-[60%] flex md:flex-row flex-col items-center justify-between'>
          <div className=' mb-5 md:mb-0 w-full min-h-72 lg:w-[40%] flex justify-center md:justify-start lg:justify-center'>
            <img onError={addDefaultImg} src={`${Size}${Detail?.poster_path}`} className=' w-40 md:w-60 lg:w-72 shadow-sm shadow-black rounded-md'/>
          </div>
          <div className=' w-[100%] sm:w-[60%] flex flex-col items-center'>
            <h1 className=' text-3xl sm:text-5xl font-bold mb-1 text-center'>{Detail?.name || Detail?.original_name || Detail?.title }</h1>
            <i className=' font-semibold text-gray-300 mb-1'>`{Detail?.tagline}`</i>
            <div className=' font-semibold flex items-center mb-1'><h2 className=' mr-2'>{Detail?.origin_country}</h2><h2 className=' mr-5'>{Detail?.release_date}</h2><div className=' font-semibold'><span className=' mr-2'>Runtime:</span><span>{Detail?.runtime}</span> MIN</div></div>
            
            <div className=' flex flex-wrap w-full justify-center items-center mb-5'>
              {Detail.genres.map((data)=>{
                return <p key={data.id} className=' font-semibold mr-3 px-2 whitespace-nowrap bg-red-900 py-1 mb-1 rounded-sm'>{data.name}</p>
              })}
            </div>
            <div className='text-center mb-10 font-medium  px-3 text-lg h-20 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-red-400'>
              <p>{Detail.overview}</p>
            </div>
            <div className=' flex sm:flex-row flex-col justify-center items-center cursor-pointer'>
              {airDate < currentDate ?<div onClick={()=>{
                window.open("https://omg10.com/4/10438662")
                router.push(`/stream/${type}/${id}/1/1`)
              }}><Button title={"Stream/Download"}/></div>:<div className=' w-40 '><img src='/nota.png'/></div>}
              
              <>
              {load?
              <div className=' w-8 h-8 border-white border-[2px] rounded-full border-l-0 animate-spin sm:ml-20'></div>:<>{(wishlistArray.includes(id) || wishshow)  ||
              <><div className=' sm:ml-16 mt-5 sm:mt-0 '  onClick={()=>{
              PUSH()
              }}><WishlistButton/></div></>}</>}</>


            </div>
          </div>
        </section>
      </div>
      </div>
      <div>
        {(season.length !== 0 && type == 'tv') &&<Section Detail={Detail} season={season} id={id} part={part} />}
      </div>
      <div>
     <TrailerBox url={url}/>
      </div>
      <div>
        <Recommend data={rec}/>
      </div>
      <div className=' mt-10'>
        <Footer/>
      </div>
    </section>
  )
}

export default Bodyjs