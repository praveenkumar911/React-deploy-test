import React from 'react'
import { BiSolidPhoneCall } from 'react-icons/bi'
import { MdLocationPin } from 'react-icons/md'
import vite from '/vite.svg'
import linkedin from '../assets/social links/Linkedin.75bedaf.png'
import instagram from '../assets/social links/Instagram.6052075.png'
import facebook from '../assets/social links/logos_facebook.033e12c.png'
import telegram from '../assets/social links/telegram.54a7e64.png'
import twitter from '../assets/social links/Twitter.0879e74.png'
import discord from '../assets/social links/discord.8faa07b.png'

const Contact = () => {
    
  const socialLinks=[
    {
      id:1,
      icon:linkedin,
      bg:"hover:shadow-blue-700",
    },
    {
      id:2,
      icon:instagram,
      bg:"hover:shadow-pink-500",
    },
    {
      id:3,
      icon:twitter,
      bg:"hover:shadow-blue-500",
    },
    {
      id:4,
      icon:facebook,
      bg:"hover:shadow-blue-900",
    },
    {
      id:5,
      icon:telegram,
      bg:"hover:shadow-blue-500",
    },
    {
      id:6,
      icon:discord,
      bg:"hover:shadow-violet-500",
    },
    
    

  ]


  return (
    <div  name="contact" className='w-full min-h-[300px] flex  items-center justify-center footerGradient'>
      <div className='w-full flex flex-col justify-evenly  gap-14 px-10 py-9 md:w-[60%] lg:flex-row lg:px-2 lg:w-full  xl:flex-row xl:justify-evenly xl:w-full '>
        <div className='flex flex-col gap-5 '>
          <p className=' text-xl capitalize font-bold border-blue-400 border-b-2 w-[150px]'>contact us</p>
          <div className='flex flex-col gap-2' > 
            <p className='flex  items-center gap-4' > <BiSolidPhoneCall className=' font-extrabold text-2xl' /> 9642444443</p>
            <p className='flex items-center gap-4'>
              <MdLocationPin className=' font-extrabold text-2xl' />
              Korangi,  Kakinada,
              </p>
        </div>
        </div>
    
        <div className='flex flex-col gap-5'>
          <p className=' capitalize text-xl font-bold  border-blue-400 border-b-2 w-[150px]'>email us</p>
          <div className=' flex flex-col gap-3' >
            <div>
              <p className=' text-gray-300' >For General Enquiry
              </p>
              <p className='  font-semibold hover:border-blue-400 hover:border-b-2  cursor-pointer'>somesh.nookala44@gmail.com

              </p>
            </div>
            <div>
              {/* <p className='text-gray-300 '>For Sponsor Enquiry */}

              {/* </p>
              <p className=' font-semibold hover:border-blue-400 hover:border-b-2  cursor-pointer'> Sponsor

              </p> */}
            </div>
          </div>
        </div>

        <div className=' flex  flex-col gap-5'>
          <p className='capitalize text-xl font-bold  border-blue-400 border-b-2 w-[150px]'>KIET-GCC Developers</p>
          <div className=' flex flex-col gap-1'>
            <p className=' capitalize hover:border-blue-400 hover:border-b-2  cursor-pointer '>Swetha </p>
            <p className=' capitalize hover:border-blue-400 hover:border-b-2  cursor-pointer '>Praveen </p>
          </div>
        </div>

        <div className='flex flex-col items-center md:items-start gap-5'>
          <div className='flex gap-4 '>
            <img className=' drop-shadow-[0_15px_15px_rgba(211,44,255,0.5)]' src={vite} alt="logo" />
            <h2 className="text-2xl font-bold">
              <span className=" text-violet-500">KIET</span> AI-THON
            </h2>
          </div>
          <div className='flex flex-col items-center gap-3  xl:flex-row  '>
            <p className='px-2' >Follow us on</p>
            <div className=' flex  gap-4 lg:flex-wrap lg:justify-center '> 
                  {
                    socialLinks.map( ({id,icon,bg})=>(
                      <img key={id} className={` cursor-pointer w-10 drop-bg-blue-500 `}  src={icon} alt="" />
                    ))
                  }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
