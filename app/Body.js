"use client"
import React from 'react'
import {  Dosis} from "next/font/google";
import "./globals.css";
import NextTopLoader from 'nextjs-toploader';
import Container from './Auth/Container';
import { useSnapshot } from 'valtio';
import { state } from './store';
import NavMenu from './NavMenu';
import Menu from './Menu';
import Message from './Message';
import ReactGA from 'react-ga4'



const dosis = Dosis({ subsets: ['latin'] })
const tracking  = "G-7YGWTWFNZW"
ReactGA.initialize(tracking)




const Body = ({children}) => {
  const sign = useSnapshot(state).signUp
  return (
    <body
    className={`   ${dosis.className} antialiased`}
    suppressHydrationWarning
  >
    <link rel="icon" href="/logologo.png" sizes="any" />
        <NextTopLoader 
       color="#fffd00"
       initialPosition={0.08}
       crawlSpeed={200}
       height={3}
       crawl={true}
       showSpinner={false}
       easing="ease"
       speed={200}
       shadow="0 0 10px #fffd00,0 0 5px #fffd00"
       className=" z-50"
      />
    <div className=' select-none overflow-x-hidden    relative scrollbar-track-black scrollbar-thin'>
      <Message/>
      <NavMenu/>
      <Menu/>
    {sign&&<Container/>}
    {children}
    </div>
  </body>
  )
}

export default Body