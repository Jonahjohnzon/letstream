import React from 'react'

const SkeletonGrid = ({ count = 20 }) => (
  <div className="w-full flex flex-wrap justify-center gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="w-36 sm:w-48 h-60 sm:h-72 rounded-lg bg-white/5 animate-pulse" />
    ))}
  </div>
)

export default SkeletonGrid