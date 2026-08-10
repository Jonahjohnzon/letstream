import React from 'react'
import { IoArrowBack } from 'react-icons/io5'

const BackButton = ({ onClick }) => (
  <button
    type="button"
    aria-label="Go back"
    onClick={onClick}
    className="top-6 sm:top-10 left-5 sm:left-10 text-3xl sm:text-4xl cursor-pointer absolute z-30 hover:text-gray-300 transition-colors"
  >
    <IoArrowBack />
  </button>
)

export default BackButton