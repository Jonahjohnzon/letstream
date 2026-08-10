"use client"
import React, { useEffect } from 'react'
import { state } from '../store'
import { useSnapshot } from 'valtio'
import SignUp from './SignUp'
import Login from './Login'
import { IoClose } from 'react-icons/io5'

const Container = () => {
  const show = useSnapshot(state).signUp
  const switchReg = useSnapshot(state).login

  const close = () => { state.signUp = false }

  useEffect(() => {
    if (!show) return
    const onKeyDown = (e) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [show])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center w-screen h-screen">
      <div className="absolute inset-0 z-10 bg-black bg-opacity-60" onClick={close} />

      <main className="relative w-[90%] sm:w-fit py-8 px-2 rounded-lg bg-gray-900 z-20 shadow-xl shadow-black/50">
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors text-xl cursor-pointer"
        >
          <IoClose />
        </button>

        <div className="flex flex-col items-center justify-center w-full">
          <div className="flex items-center mb-6 w-2/3 gap-2">
            <button
              type="button"
              onClick={() => { state.login = true }}
              className={`text-center w-full text-white font-semibold text-lg pb-2 border-b-2 transition-colors cursor-pointer ${
                switchReg ? 'border-b-red-600' : 'border-b-transparent text-gray-500'
              }`}
            >
              Sign up
            </button>
            <button
              type="button"
              onClick={() => { state.login = false }}
              className={`text-center w-full text-white font-semibold text-lg pb-2 border-b-2 transition-colors cursor-pointer ${
                switchReg ? 'border-b-transparent text-gray-500' : 'border-b-red-600'
              }`}
            >
              Log in
            </button>
          </div>

          <div className="w-full sm:w-[430px] md:w-[500px]">
            {switchReg ? <SignUp /> : <Login />}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Container