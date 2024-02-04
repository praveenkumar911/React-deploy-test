import React from "react";
import blockchain from '../assets/tracks/tracks_blockchain_vector.svg'
import electronics from '../assets/tracks/tracks_digitalelectrovics_vector.svg'
import dev from '../assets/tracks/Tracks_LaptopVector.svg'
import aiMl from '../assets/tracks/tracks_ML_vector.svg'

const Tracks = () => {

  const tracks = [
    {
      id: 1,
      title: 'Development',
      desc: "A track to develop Websites and Mobile Apps based on the problem statements we have for you, in line with the theme.",
      img: dev,
      deley:"10"

    },
    {
      id: 2,
      title: 'Machine Learning',
      desc: "A track for all ML enthusiasts out there. It brings together participants to solve real-data challenges based on Sustainability by applying Machine learning. It aims to bring to life creative solutions to leverage the power of AI to amplify human capability.",
      img: aiMl,
      deley:"12"

    },

    {
      id: 3,
      title: 'Data Science',
      desc: "This track is for all those interested in Data Science. It focuses on problem statements based on  algorithms to solve a real-world sustainability problem.",
      img: electronics,
      deley:"14"

    },
    {
      id: 4,
      title: 'Web 3.0',
      desc: "This track is for Web3 enthusiasts to turn ideas into actual projects. It offers opportunities to work on blockchain-based problem statements focussing on different areas across NFTs, DeFi, and Metaverse to pursue a more sustainable future.",
      img: blockchain,
      deley:"16"

    },
  ]
  return (
    <div name="tracks" className="w-full px-5  flex flex-col items-center py-5 2xl:h-screen 2xl:justify-center">
      <h2 className="font-bold text-3xl py-7 xl:py-10  ">Tracks</h2>
      <div   className="p-4 flex gap-11 w-full flex-wrap items-center justify-center xl:gap-40 2xl:gap-14 2xl:h-[600px] ">
        {
          tracks.map(({ id, title, desc, img,deley }) => (
            <div data-aos="fade-left" data-aos-duration="2500" key={id} data-aos-delay={`${deley}00`}  className=" tracksShadow w-[350px] 2xl:h-[330px] 2xl:hover:h-[550px] duration-700  overflow-hidden relative liner-border p-[3px] rounded-[15px] md:w-[450px] xl:w-[450px] 2xl:w-[400px] ">
              <div  className="min-h-[100px] px-7  py-10 bg-tertiary rounded-[15px] shadow-card flex flex-col items-center justify-ene gap-5 2xl:h-[100%] 2xl:gap-9 lg:h-[550px]">
                <div className=" flex flex-col items-center gap-7">
                  <img src={img} alt="vite" className="w-[300px] h-[200px]" />
                  <h3 className="text-2xl font-bold">{title}</h3>
                </div>
                <div  >
                  <p>{desc} </p>
                </div>
              </div>
            </div>
          ))
        }

      </div>
    </div>
  );
};

export default Tracks;

