import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../Component/Button';
import InfoButton from '../Component/InfoButton';
import { useRouter } from 'nextjs-toploader/app';
import { truncateText } from '../Text';

const Top = ({ BackgroundList }) => {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0);
  const Api = process.env.NEXT_PUBLIC_SIZEIMAGE1280;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % BackgroundList.length);
    }, 60000);

    return () => clearInterval(interval); 
  }, [BackgroundList?.length]);


  return (
    <div className="relative  w-[100vw] py-96 md:min-h-[100vh]  overflow-hidden ">
      
      <AnimatePresence>
        <motion.div
          key={currentIndex}
          className="absolute top-0 left-0   w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${Api}${BackgroundList[currentIndex]?.backdrop_path})`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1,transition:{duration:0.3} }}
          exit={{ opacity: 0,transition:{duration:1} }}
        >
      <section className="relative z-10 flex items-center w-full h-full px-5 md:px-10 2xl:px-40">
          <div className=' w-[93%] md:w-2/3 2xl:w-1/2 flex flex-col items-center md:items-start'>
            <h1 className=' text-3xl sm:text-4xl md:text-6xl text-center md:text-start md:w-[80%] font-bold mb-2 md:mb-4'>{BackgroundList[currentIndex]?.original_title}</h1>
            <div className=' flex items-center justify-between md:w-1/3 md:text-lg font-semibold mb-4' >
            <h3 className=' text-green-500 mr-2 md:mr-0'>{Math.ceil(BackgroundList[currentIndex]?.vote_average * 10) || 0}%</h3>
            <p className=' text-green-500 mr-2 md:mr-0'>Match</p>
            <h3>{BackgroundList[currentIndex]?.release_date}</h3>
            </div>
            
            <div className=' md:text-lg min-h-20 text-center md:text-start font-medium mb-3 w-[95%] xl:w-[80%]'>
                <h2>{truncateText(BackgroundList[currentIndex]?.overview, 200)}</h2>
            </div>
            <div className=' flex items-center flex-col md:flex-row '>
                <section className=' md:mr-10 mb-5 md:mb-0 cursor-pointer' onClick={()=>{
                  window.open("https://otieu.com/4/10438662")
                  router.push(`/stream/movie/${BackgroundList[currentIndex]?.id}/1/1`)
                }}><Button title={'Play/Download'}/></section>
                <section className=' cursor-pointer'  onClick={()=>{
                  router.push(`/details/movie/${BackgroundList[currentIndex]?.id}/1`)
                }}><InfoButton/></section>
            </div>
          </div>
      </section>
        </motion.div>
      </AnimatePresence>

      <div className="absolute w-full h-full top-0 bg-gradient-to-b from-[rgba(0,0,0,0.4)]  to-[rgba(0,0,0,1)]"></div>


    </div>
  );
};

export default Top;
