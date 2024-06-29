import React from 'react'

const Header = () => {
  return (
    <header className="text-white bg-slate-800 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <a className="flex title-font font-medium items-center text-white mb-4 md:mb-0">
          <span className= "text-2xl">Inven</span>
          <span className="text-blue-800 text-2xl">Mate</span>
          <span className="ml-3 text-2xl"> Stock Management System</span>
        </a>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <button className='text-wite bg-blue-800 my-5 rounded-full flex justify-between items-center ring-white ring-1'>
            <img className='invert w-10 p-1' src="/icons/github.svg" alt="github logo" />
            <a target='_blank' href="https://github.com/Dakshesh1234">
              <span className='font-bold px-2'>Github</span>
            </a>
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header