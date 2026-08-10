import React from 'react'
import TitleBar from '@/app/Component/TitleBar'
import { useRouter, usePathname } from 'next/navigation'

const CastCard = ({ person }) => {
  const router = useRouter()
  const pathname = usePathname()
  const ImageApi = process.env.NEXT_PUBLIC_SIZEIMAGE300
  const addDefaultImg = (ev) => { ev.target.src = '/dfi.png' }

  const goToActor = () => {
    const from = encodeURIComponent(pathname)
    router.push(`/actor/${person.id}/${encodeURIComponent(person.name)}/1?from=${from}`)
  }

  return (
    <button
      type="button"
      onClick={goToActor}
      className="flex flex-col items-center text-center cursor-pointer group"
    >
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white border-opacity-10 bg-gray-800 group-hover:border-opacity-40 transition-colors">
        <img
          src={person.profile_path ? `${ImageApi}${person.profile_path}` : '/dfi.png'}
          onError={addDefaultImg}
          loading="lazy"
          alt={person.name}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="mt-2 text-sm font-semibold leading-tight line-clamp-1 group-hover:text-red-400 transition-colors">
        {person.name}
      </p>
      {person.character && !person.character.startsWith('Self') && (
        <p className="text-xs text-gray-400 leading-tight line-clamp-1">{person.character}</p>
      )}
    </button>
  )
}

const Cast = ({ cast }) => {
  if (!cast || cast.length === 0) return null

  return (
    <div className="mb-10 w-full flex justify-center">
      <section className="w-[95%] sm:w-[90%] xl:w-2/3">
        <div className="mb-6"><TitleBar title={"Cast"} /></div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-4 gap-y-6">
          {cast.slice(0, 16).map((person) => (
            <CastCard key={person.id} person={person} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Cast