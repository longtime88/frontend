'use client'
import React from 'react'


export const Button = ({ text, onClick }: { text: string; onClick: () => void }) => {
  return (
    <button className='rounded-full bg-gradient-to-r from-[#c95a2b] to-[#e8723c] px-5 py-3 text-sm font-bold tracking-wide text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:from-[#a0421a] hover:to-[#c95a2b]' onClick={onClick}>
      {text}
    </button>
  )
}




