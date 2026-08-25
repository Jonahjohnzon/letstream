import React from 'react'
import { CiPlay1 } from "react-icons/ci"
import { useRouter } from 'nextjs-toploader/app'
import { truncateText } from '@/app/Text'

const EpisodeBlock = ({ data, id }) => {
  const ImageApi = process.env.NEXT_PUBLIC_SIZEIMAGE45
  const router = useRouter()
  const airDate = data?.air_date ? new Date(data.air_date) : null
  const hasAired = airDate ? airDate < new Date() : false

  const addDefaultImg = (ev) => { ev.target.src = "/dfi.png" }

  const handleClick = () => {
    if (!hasAired) return
    window.open("https://omg10.com/4/11569591")
    router.push(`/stream/tv/${id}/${data.season_number}/${data.episode_number}`)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className='w-full h-full hover:scale-95 cursor-pointer transition-all duration-500 ease-in-out'
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <section className='flex items-center h-full w-full rounded-md overflow-hidden'>
        <div className='w-40 rounded-md relative h-full'>
          <img
            className='absolute object-cover object-center w-full h-full z-10'
            src={data.still_path ? `${ImageApi}${data.still_path}` : '/dfi.png'}
            onError={addDefaultImg}
            alt={data?.name}
            loading='lazy'
          />
          <div className='w-full h-full relative z-20 flex justify-center items-center'>
            <div className='w-10 h-10 flex items-center justify-center rounded-full bg-black bg-opacity-60'>
              <CiPlay1 className='text-white' />
            </div>
            <div className='absolute bottom-0 left-0 h-5 min-w-5 flex justify-center items-center font-bold bg-black bg-opacity-60 rounded-tr-lg text-sm'>
              {data.episode_number}
            </div>
          </div>
        </div>
        <div className='overflow-hidden bg-gray-900 h-full w-full px-2 py-2 relative'>
          <h1 className='font-bold'>{data?.name}</h1>
          <p className='relative w-[90%] z-30 text-xs sm:text-sm md:text-base text-white text-opacity-60'>
            {truncateText(data?.overview, 120)}
          </p>
          {!hasAired && (
            <div className='absolute bottom-1 right-1 z-10'>
              <img src='/nota.png' className='w-36' alt="Not yet available" />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default EpisodeBlock