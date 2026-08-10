"use client"
import { DeleteWish, getUserWishlist } from "@/app/history"
import React, { useEffect, useState } from "react"
import { useRouter } from "nextjs-toploader/app"
import TitleBar from "@/app/Component/TitleBar"
import MovieBlock from "../../Pages/MovieBlock"
import Pagination from "@/app/[type]/[genre]/[country]/[date]/[sort]/[page]/Component/Pagination"
import BackButton from "@/app/Component/BackButton"
import SkeletonGrid from "@/app/Component/SkeletonGrid"
import EmptyState from "@/app/Component/EmptyState"

const MainBody = ({ page }) => {
  const router = useRouter()
  const [wishVideos, setWishVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pageNo, setPageNo] = useState(1)
  const [removingId, setRemovingId] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getUserWishlist(page)
        setWishVideos(data?.data || [])
        setPageNo(data?.totalPages || 1)
      } catch (err) {
        console.error('Failed to load wishlist:', err)
        setError("Couldn't load your wishlist — try again.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [page])

  const handleDelete = async (id) => {
    setRemovingId(id)
    try {
      const data = await DeleteWish({ item_id: id })
      if (data.success) {
        // Remove locally instead of a full page reload — the previous
        // version called window.location.reload() just to drop one card.
        setWishVideos((prev) => prev.filter((item) => item.id !== id))
      }
    } catch (err) {
      console.error('Failed to remove from wishlist:', err)
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className="min-h-[100vh] relative w-full flex justify-center">
      <BackButton onClick={() => router.back()} />

      <div className="w-[90%] 2xl:w-2/3 pt-20">
        <div className="mb-10"><TitleBar title={"My Wishlist"} /></div>

        <Pagination page={page} noOfPages={pageNo} Right={() => router.push(`/wishlist/${Number(page) + 1}`)} Left={() => router.push(`/wishlist/${Number(page) - 1}`)} />

        <div className="w-full mt-4">
          {loading && <SkeletonGrid />}

          {!loading && error && <EmptyState message={error} />}

          {!loading && !error && wishVideos.length === 0 && (
            <EmptyState message="Nothing in your wishlist yet — add something you want to watch." />
          )}

          {!loading && !error && wishVideos.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4">
              {wishVideos.map((e) => (
                <div key={e.id} className="flex flex-col items-center group">
                  <MovieBlock data={e} />
                  <div className="h-12 w-full">
                  <button
                    type="button"
                    onClick={() => handleDelete(e.id)}
                    disabled={removingId === e.id}
                    className="hidden group-hover:block w-full py-1 text-center bg-red-600 hover:bg-red-800 rounded-b-md font-semibold text-sm disabled:opacity-50 transition-colors"
                  >
                    {removingId === e.id ? 'Removing…' : 'Remove'}
                  </button>
                  </div>
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