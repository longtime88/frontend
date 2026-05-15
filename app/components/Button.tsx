
'use client'
import React from 'react'


export const Button = ({ text, onClick }: { text: string; onClick: () => void }) => {
  return (
    <main>
    <button className='rounded-full bg-gradient-to-r from-[color:var(--brand)] to-[#e18244] px-5 py-3 text-white transition hover:from-[color:var(--brand-deep)] hover:to-[#c05d2b]' onClick={onClick}>
      {text}
      </button>
      </main>
   

  )
}





