import React from 'react'

const Spinner = () => (
  <div className="flex justify-center py-1">
    <div className="w-7 h-7 rounded-full border-t-2 border-t-[#03091A] border-yellow-600 border-x-4 border-b-4 animate-spin flex justify-center items-center">
      <div className="w-3 h-3 rounded-full border-b-2 border-b-[#03091A] border-red-600 border-x-4 border-t-4 -scale-y-100 animate-spin" />
    </div>
  </div>
)

export default Spinner