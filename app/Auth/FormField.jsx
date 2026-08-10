import React from 'react'

const FormField = ({ id, label, type = 'text', value, onChange, error, touched, placeholder }) => (
  <div className="mb-5">
    <label htmlFor={id} className="text-xs font-semibold tracking-wide text-gray-300">
      {label}
    </label>
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={type === 'password' ? 'current-password' : id === 'email' ? 'email' : 'off'}
      className="text-white placeholder:text-gray-500 px-4 w-full h-12 mt-2 rounded-md border border-gray-700 bg-gray-900 focus:outline-none focus:border-red-500 transition-colors"
    />
    <div className="text-red-500 text-xs mt-1 min-h-[1rem]">{touched && error}</div>
  </div>
)

export default FormField