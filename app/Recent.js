'use client'
import React, { useEffect, useState } from 'react'
import ContentRow from './Pages/ContentRow'

const Recent = () => {
  const [recent, setRecent] = useState([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('recentlyWatched')
      const data = raw ? JSON.parse(raw) : null
      // JSON.parse throws synchronously on malformed input — the old
      // `JSON.parse(x || null)` didn't catch that, it just crashed the
      // component if anything ever wrote a corrupted value.
      if (Array.isArray(data) && data.length) setRecent(data)
    } catch (err) {
      console.error('Couldn\'t read recently-watched history:', err)
      localStorage.removeItem('recentlyWatched')
    }
  }, [])

  if (recent.length === 0) return null

  return (
    <div className="min-h-80 sm:min-h-96 mb-10 sm:mb-14">
      <ContentRow BackgroundList={recent} Title="Recently Watched" mode="continue" />
    </div>
  )
}

export default Recent