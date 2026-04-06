
'use client'
import React from 'react'


export const Button = ({ text, onClick }: { text: string; onClick: () => void }) => {
  return (
    <button className='bg-amber-950 text-white py-5 px-4 rounded-md hover:bg-amber-800 transition-colors duration-200' onClick={onClick}>
      {text}
    </button>
   

  )
}





