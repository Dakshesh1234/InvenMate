import React from 'react'

const Footer = () => {
    return (
        <div className='bg-slate-800 text-white flex flex-col justify-center items-center bottom-0 w-full'>
            <div className="logo font-bold text-2xl text-white ">
                <span>Inven</span>
                <span className="text-blue-800">Mate</span>
            </div>
            <div className='flex justify-center items-center'>
                Created with <img className='w-7 mx-2' src="icons/heart.png" alt="" /> by dha_Corp
            </div>
        </div>
    )
}

export default Footer
