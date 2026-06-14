'use client'
import Top from "./Pages/Top";
import { useEffect, useState } from "react";
import Apicore from "./ApiCore";
import TrendingToday from "./Pages/TrendingToday";
import Footer from "./Footer";
import Upcoming from "./Pages/Upcoming";
import { useRouter } from 'nextjs-toploader/app';
import Loading from "./Loading";
import Navbar from "./Navbar";
import Recent from "./Recent";
import ReactGA from 'react-ga4'
import Popup from "./Popup";


export default function Home() {
  const api = new Apicore()
  const router = useRouter()
  const [BackgroundList, setBackgroundList] = useState([])
  const [Series, setSeries] = useState([])
  const [Popular, setPopular] = useState([])
  const [Trailer, setTrailer] = useState([])
  const [Onair, setOnair] = useState([])
  const [Ks, setKs] = useState([])
  const [loading, setLoading] = useState(true)
  const currentYear = new Date().getFullYear();
  const getData = async ()=>{
    try{
      setLoading(true)
      const response = await api.get('/3/trending/movie/day?language=en-US')
      const kseries = await api.get(`/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=ko-KR&page=1&sort_by=popularity.desc&with_origin_country=KR&without_genres=10764,99,10767`)
      const series = await api.get('/3/trending/tv/day?language=en-US')
      const popular = await api.get('/3/discover/tv?include_adult=false&language=en-US&page=1&sort_by=vote_average.desc&vote_count.gte=200')
      const air = await api.get('/3/movie/top_rated?language=en-US&page=1')

      const upcoming = await api.get('/3/movie/upcoming?language=en-US&page=1')
      setBackgroundList(response?.results)
      setKs(kseries?.results)
      setSeries(series?.results)
      setPopular(popular?.results)
      setTrailer(upcoming?.results)
      setOnair(air?.results)
      setLoading(false)
    }
    catch(error)
    {
      router.push('/not-found')
    }
    finally{
    
    }
  }

  useEffect(()=>{
    ReactGA.send({ hitType: "pageview", page: "/landingpage", title: "Landing Page" });
    getData()
  },[])
if(loading)
  return <div><Loading/></div>

  return (
    <div className="w-[100vw] relative  ">
      <Popup words={"USE ADS-BLOCK FOR EASE OF USE"}/>
       <Navbar/>
     <Top BackgroundList={BackgroundList}/>
     <section className=" pb-5 md:pb-20 -mt-20 sm:-mt-32">
      <div><Recent/></div>
      <div className=" min-h-80 md:min-h-96">
     <TrendingToday BackgroundList={BackgroundList} type={'movie'} Title={"Trending Movies Today"}/>
     </div>
     <div className="mt-10 md:mt-14 min-h-80 md:min-h-96">
     <TrendingToday BackgroundList={Series} Title={"Series Today"} type={'tv'}/>
     </div>
      <div className="mt-10 md:mt-14 min-h-80 md:min-h-96">
     <TrendingToday BackgroundList={Ks} Title={"K Series"} type={'tv'}/>
     </div>
     <div className="mt-10 md:mt-14 min-h-80 md:min-h-96">
     <TrendingToday BackgroundList={Popular} Title={"Popular List"} type={'tv'}/>
     </div>

     <div className=" min-h-80 md:min-h-96 my-10 md:my-10">
     <Upcoming Trailer={Trailer}/>
     </div>
     <div className="mt-10 md:mt-14 min-h-80 md:min-h-96">
     <TrendingToday BackgroundList={Onair} Title={"Top Rated Movies"} type={'movie'}/>
     </div>
     </section>
     <Footer/>
    </div>
  );
}
