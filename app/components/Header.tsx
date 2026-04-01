"use client"
import Link from "next/link"

export default function Header() {
  return (
    
        <header className="w-full  shadow px-6 py-2 flex flex-col gap-4 bg-blue-700">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white/80 select-none">
          Luna&Clean
          <span className="relative top-[-0.4em] text-xs ml-1">®</span>
        </h1>
      </div>

      <div className="flex items-center justify-between w-full">

        <form action="#" method="get" className="flex items-center w-1/3 bg-gray-400">
          <input
            type="text"
            name="q"
            placeholder="Suche..."
            className="grow px-3 py-2 border border-gray-300 rounded-l-md 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gray-500 border border-gray-300 border-l-0 
                       rounded-r-md hover:bg-gray-300 md:px-6 transition text-white"
          >
            🔍
          </button>
        </form>

        <nav>
          <ul className="flex flex-col gap-2 mt-4 md:flex-row md:gap-6 md:mt-0 items-start">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/ueber-uns">Über uns</Link></li>
            <li><Link href="/kontakt">Kontakt</Link></li>
            <li><Link href="/anmelden">Anmelden</Link></li>
          </ul>
        </nav>

      </div>
    </header>
  )
}
