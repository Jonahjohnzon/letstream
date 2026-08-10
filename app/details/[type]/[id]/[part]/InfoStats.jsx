import React from 'react'

const Stat = ({ label, value }) => {
  if (!value && value !== 0) return null
  return (
    <div className="flex flex-col items-center sm:items-start px-4 py-2">
      <span className="text-xs uppercase tracking-wide text-gray-400">{label}</span>
      <span className="font-semibold text-sm sm:text-base text-center sm:text-left">{value}</span>
    </div>
  )
}

const formatMoney = (n) => (n ? `$${n.toLocaleString('en-US')}` : null)

const InfoStats = ({ Detail, type }) => {
  if (!Detail) return null

  const originalLanguage = Detail.original_language?.toUpperCase()
  const companies = Detail.production_companies?.map((c) => c.name).filter(Boolean).join(', ')
  const seasonsInfo =
    type === 'tv'
      ? `${Detail.number_of_seasons ?? '-'} season${Detail.number_of_seasons === 1 ? '' : 's'}, ${Detail.number_of_episodes ?? '-'} episodes`
      : null

  return (
    <div className="flex justify-center w-full">
      <section className="w-[95%] sm:w-[90%] xl:w-2/3 flex flex-wrap justify-center sm:justify-start divide-x divide-white divide-opacity-10 border-t border-b border-white border-opacity-10 py-4 mb-10">
        <Stat label="Status" value={Detail.status} />
        <Stat label="Original language" value={originalLanguage} />
        {type === 'movie' && <Stat label="Budget" value={formatMoney(Detail.budget)} />}
        {type === 'movie' && <Stat label="Revenue" value={formatMoney(Detail.revenue)} />}
        {seasonsInfo && <Stat label="Seasons" value={seasonsInfo} />}
        {companies && <Stat label="Production" value={companies} />}
      </section>
    </div>
  )
}

export default InfoStats