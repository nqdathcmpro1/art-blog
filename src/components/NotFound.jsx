import React from 'react'
import error from "@/public/error.png"

const NotFound = () => {
  return (
    <div className='w-full flex flex-col items-center '>
    <img src={error} className="w-72" />
    <h1 className='text-lg md:text-3xl font-bold '>The page you are looking for is not available.</h1>
    </div>
  )
}

export default NotFound