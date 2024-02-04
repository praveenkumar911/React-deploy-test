import React from "react";
import tceLogo from '../assets/tracks/tcelogo.PNG'
const About = () => {



  return (
    <div data-aos="fade-left" data-aos-duration="2000"data-aos-offset="600" name="about" id="about" className="flex justify-center items-center flex-col w-full py-10 xl:h-screen">
      <h3 className=" font-bold text-3xl py-6  xl:text-3xl ">About</h3>
      <div className="w-[90%]  relative liner-border p-[2px] rounded-[15px] 2xl:w-[75%]">
        <div className=" h-full text-justify w-full text-gray-200 bg-tertiary rounded-[15px] shadow-card px-8 py-7 flex flex-col items-center  gap-6 justify-evenly lg:py-9 xl:h-[500px] xl:text-lg xl:pt-10 2xl:text-lg">
          <img src={tceLogo} alt="tce" className=" rounded-md w-[400px]  md:w-[700px] lg:w-[900px] xl:w-[1000px] 2xl:w-[900px] " />
          Kakinada Institute of Engineering and Technology, also known as KIET, was established in 2001. It is a private institution located in East Godavari, Andhra Pradesh. 

This institute offers Undergraduate (UG), Postgraduate (PG) as well as Diploma courses in the Engineering field. The courses and programs have been approved by AICTE. All the above-mentioned courses are Full time and On-Campus.
        </div>
      </div>

    </div>
  );
};

export default About;
