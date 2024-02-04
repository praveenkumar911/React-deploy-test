import React from 'react'
import qualcomm from '../assets/sponers/qualcomm.svg'
import bharatX from '../assets/sponers/bharatX.svg'
import bluelearn from '../assets/sponers/bluelearn.svg'
import gradvine from '../assets/sponers/gradvine.svg'
import postman from '../assets/sponers/qualcomm.svg'
import unstop from '../assets/sponers/unstop.png'




const Sponers = () => {
  const sponers=[
    {
        id:1,
        img:qualcomm
    },
    {
        id:2,
        img:bharatX
    },
    {
        id:3,
        img:bluelearn
    },
    {
        id:4,
        img:gradvine
    },
    {
        id:5,
        img:postman
    },
    {
        id:6,
        img:unstop
    },
  ]

  return (
    <div name="sponsors" className='w-full flex flex-col items-center justify-center py-20 xl:h-screen '>
         <h1 className='text-2xl font-bold py-5 lg:text-3xl'>Sponsors</h1>
       <div className='flex flex-wrap p-6 gap-20 w-[90%] justify-center items-center lg:w-full 2xl:w-[80%]'>
           {
            sponers.map(({id,img})=>(
                <div data-aos="flip-right" data-aos-duration="1000" key={id} className='w-[500px] lg:w-[400px] p-8  min-h-[200px]  flex items-center rounded-md justify-center spoonersGradinet ' > 
                <img src={img} alt="" />
              </div>
            ))
           }
       </div>
    </div>
  )
}

export default Sponers