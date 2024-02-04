import React, { useState } from 'react'
import vite from '/vite.svg'
import { HiMenuAlt3 } from 'react-icons/hi'
import { FaTimes } from 'react-icons/fa'
import { Link, animateScroll as scroll } from "react-scroll";

const Navbar = () => {

  const [nav, setNav] = useState(false)

  const Navlinks = [
    {
      id: 1,
      title: 'home',
      url: 'home'
    },
    {
      id: 2,
      title: 'about',
      url: 'about'
    },
    {
      id: 3,
      title: 'tracks',
      url: 'tracks'
    },
 
    // {
    //   id: 4,
    //   title: 'Timeline',
    //   url: 'Timeline'
    // },

    {
      id: 5,
      title: 'FAQ',
      url: 'faq'
    },

    {
      id: 6,
      title: 'contact',
      url: 'contact'
    },
    {
      id: 7,
      title: 'statistics',
      url: 'statistics'
    },
  ]

  return (

    <nav className='glass w-full flex items-center justify-between p-4 fixed z-20'>
      <div className='font-bold px-2 flex items-center gap-3 text-xl'>
        <img src={vite} className=' w-7 drop-shadow-[0_15px_15px_rgba(211,44,255,0.5)]' alt="vite logo" />
        AI-THON
      </div>
      <div className='flex items-center  justify-evenly'>

        <div className=' hidden lg:flex'>
          {
            Navlinks.map(({ id, title, url }) => (
              <li key={id} className='hover:border-b-[2px]   border-blue-400 list-none px-3 py-4 capitalize text-gray-300 cursor-pointer   hover:text-gray-100 hover:font-semibold' >
                <Link to={url} smooth={true} duration={500} offset={100} > {title}</Link>

              </li>

            ))
          }
        </div>

        <div onClick={() => setNav(!nav)} className=' text-2xl p-3 font-bold lg:hidden'>
          {nav ? <FaTimes /> : <HiMenuAlt3 className=' font-thin' />}
        </div>

      </div>

      {
        nav && <div className='w-full flex flex-col h-screen text-xl font-semibold gap-5 py-10 items-center absolute navGlass top-[75px] left-0  '>
          {
            Navlinks.map(({id,title,url}) => (
              <li key={id}  className=' list-none px-3 py-2 capitalize text-gray-100 cursor-pointer  hoverz:text-gray-100 hover:font-semibold' > <Link onClick={() => setNav(!nav)}  to={url} smooth={true} duration={500} offset={-50} > {title}</Link>
              </li>
            ))
          }
        </div>
      }



    </nav>
  )
}

export default Navbar