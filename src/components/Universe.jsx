import React from "react";
import { ReactNebula } from "@flodlc/nebula";
import Register from "./Register";
import Navbar from "./Navbar";
import Nav from "./Nav";

const Universe = () => {
  return (
    <div className=" w-full h-[1000px] relative ">
        <Nav/>
      <div className=" relative w-full h-full">
        <ReactNebula
          config={{
            starsCount: 300,
            starsRotationSpeed: 0.5,
            nebulasIntensity: 20,
            cometFrequence: 300,
            sunScale: 2,
            solarSystemSpeedOrbit: 10,
            planetsScale: 2,
          }}
        />
        
      </div>
      <div className=" absolute w-[100%] md:w-[70%] lg:w-[60%] top-[50%] xl:w-[45%] 2xl:w-[40%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
            <Register/>
      </div>
    </div>
  );
};

export default Universe;
