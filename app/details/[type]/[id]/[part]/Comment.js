import React from 'react'
import TitleBar from '@/app/Component/TitleBar'
import YouTube from 'react-youtube'

const opts = { height: '400', width: '100%', playerVars: { autoplay: 0, controls: 0, rel: 0 } }
const onReady = (event) => event.target.pauseVideo()

const TrailerBox = ({ url }) => {
  return (
    <div className='flex justify-center'>
      <section className='w-[95%] sm:w-[445px] md:w-[645px] lg:w-[745px]'>
        <TitleBar title={"Trailer Box"} />
        <section className='min-h-96 w-full mt-5 flex justify-center'>
          <div className='border-white border-[1px] h-[402px] w-[95%] md:w-[70%] lg:w-[745px] flex items-center justify-center'>
            {url ? (
              <YouTube videoId={url} opts={opts} onReady={onReady} />
            ) : (
              <p className='text-gray-400 font-semibold'>No trailer available</p>
            )}
          </div>
        </section>
      </section>
    </div>
  )
}

export default TrailerBox