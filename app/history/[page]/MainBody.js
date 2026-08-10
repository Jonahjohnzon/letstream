"use client"
import { getUserHistory } from '@/app/history'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'nextjs-toploader/app'
import TitleBar from '@/app/Component/TitleBar'
import RecentBlock from '@/app/Pages/RecentBlock'
import Pagination from '@/app/[type]/[genre]/[country]/[date]/[sort]/[page]/Component/Pagination'
import BackButton from '@/app/Component/BackButton'
import SkeletonGrid from '@/app/Component/SkeletonGrid'
import EmptyState from '@/app/Component/EmptyState'

const MainBody = ({ page }) => {
  const router = useRouter()
  const [historyVideos, setHistoryVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pageNo, setPageNo] = useState(1)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getUserHistory(page)
        setHistoryVideos(data?.data || [])
        setPageNo(data?.totalPages || 1)
      } catch (err) {
        console.error('Failed to load history:', err)
        setError("Couldn't load your history — try again.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [page])

  return (
    <div className="min-h-[100vh] relative w-full flex justify-center">
      <BackButton onClick={() => router.back()} />

      <div className="w-[90%] 2xl:w-2/3 pt-20">
        <div className="mb-10"><TitleBar title={"My History"} /></div>

        <Pagination page={page} noOfPages={pageNo} Right={() => router.push(`/history/${Number(page) + 1}`)} Left={() => router.push(`/history/${Number(page) - 1}`)} />

        <div className="w-full mt-4">
          {loading && <SkeletonGrid />}

          {!loading && error && <EmptyState message={error} />}

          {!loading && !error && historyVideos.length === 0 && (
            <EmptyState message="Nothing watched yet — your history will show up here." />
          )}

          {!loading && !error && historyVideos.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4">
              {historyVideos.map((e) => (
                <div key={e.id}>
                  <RecentBlock data={e} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MainBody