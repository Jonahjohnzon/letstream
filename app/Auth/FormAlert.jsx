import React from 'react'

const FormAlert = ({ message, isError }) => {
  if (!message) return <div className="h-8 mb-2" />
  return (
    <div className="flex justify-center w-full mb-2 h-8">
      <p className={`font-semibold text-sm ${isError ? 'text-red-500' : 'text-green-500'}`}>
        {message}
      </p>
    </div>
  )
}

export default FormAlert