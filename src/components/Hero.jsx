import React, { useEffect } from "react";
import Lottie from 'lottie-react'
import animationData from '../assets/Lottie/animationNew.json'
import { Link } from 'react-router-dom'
import { Link as ScrollLink } from 'react-scroll'
import Aos from 'aos'
import "aos/dist/aos.css"


const Hero = () => {



   
  return (
    <div name="home" className="  w-full  flex flex-col   items-center justify-center xl:flex-row  xl:h-screen xl:px-14 ">
      <div className=" flex w-full items-center justify-center h-[500px] pt-28    lg:gap-6 xl:pt-0">
        <div data-aos="fade-right" data-aos-duration="900"  className="flex flex-col items-center px-3   h-[310px]"  >
          <div className="w-4 rounded-full h-4 bg-violet-600 z-10 "></div>
          <div  className=" w-1 h-[350px] violet-gradient rounded-tr-full  rounded-tl-full "></div>
        </div>

        <div className="px-4 py-7 flex flex-col  jutstify-center 2xl:items-center  gap-5 ">
          <p className="xl:text-xl " data-aos="fade-left" data-aos-duration="1000" > Welcome to </p>
          <h2 data-aos="fade-left" data-aos-duration="1100" className="text-4xl font-bold lg:text-5xl ">
            <span   className=" text-violet-500">KIET</span> AI-THON
          </h2>

          <div className="flex flex-col items-start gap-2 " >
            <p data-aos="fade-left" data-aos-duration="1200"> ⚪ Prizes worth ₹ 100,000+</p>
            {/* <p data-aos="fade-left" data-aos-duration="1200">
              ⚪ Fulltime and internship 
            </p> */}
          </div>

          <div className=" 2xl: flex 2xl:gap-6 flex-col  gap-6 md:flex-row ">
            <Link to='#' ><button data-aos="fade-left" data-aos-duration="1300" className="box px-8 py-2  bg-violet-600 rounded-lg font-bold w-[270px]  xl:text-xl xl:py-3 2xl:w-[320px]" >Register</button>
            </Link>
            <ScrollLink to="hackathon" smooth={true} duration={500} offset={-50} >   <button data-aos="fade-left" data-aos-duration="2000" className=" px-8 py-2 rounded-lg box1 font-bold w-[270px] xl:text-xl xl:py-3 2xl:w-[320px] md:w-[200px]" >Hackathon</button>
            </ScrollLink>

          </div>
        </div>
      </div>
      <div className=" flex w-full justify-center items-center" >
        <div data-aos="fade-right" data-aos-duration="1000" className="w-full  h-[400px] md:h-[600px] md:w-[70%] md:pb-0 lg:h-[600px] lg:w-[50%] xl:flex xl:w-[75%]">
          <Lottie animationData={animationData} />
        </div>

      </div>

    </div>
  );
};

export default Hero;
