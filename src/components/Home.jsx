import React,{useEffect} from 'react'
import Navbar from "./Navbar";
import Hero from "./Hero";
import About from "./About";
import Tracks from "./Tracks";
import Statistics from "./Statistics";
import Timeline from "./Timeline";
import Sponers from "./Sponers";
import Contact from './Contact';
import Hackathon from './Hackathon';
import Faq from './Faq';
import Aos from 'aos';
import 'aos/dist/aos.css'


const Home = () => {
    useEffect( ()=>{
        Aos.init({
            disable: function() {
              var maxWidth = 435;
              return window.innerWidth < maxWidth;
            }
          });
      
    },[])

    return (
        <div className=" overflow-hidden w-full bg-primary  bg-hero-pattern bg-no-repeat bg-cover bg-fixed ">
            <div className=" w-full ">
                <Navbar />
                <Hero />
            </div>
            <About />
            <Hackathon />
            <Tracks />
            <Statistics />
            <Timeline />
            {/* <Sponers /> */}

            <Faq />
            <Contact />
        </div>
    )
}

export default Home
