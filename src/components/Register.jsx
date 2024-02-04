import React, { useState } from "react";
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { AiOutlineArrowRight } from 'react-icons/ai';
import axios from 'axios'

import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import RegisterRes from "./RegisterRes";

const Register = () => {
  let [page, setPage] = useState(0);
  const [status,setStatus]=useState(null)
  const limit = 4;


  const [input, setInput] = useState({
    team_name: "",
    team_member_1_name: "",
    team_member_1_department: "",
    team_member_1_phone: "",
    team_member_1_email: "",
    team_member_1_register_number: "",

    team_member_2_name: "",
    team_member_2_department: "",
    team_member_2_phone: "",
    team_member_2_email: "",
    team_member_2_register_number: "",

    
    team_member_3_name: "",
    team_member_3_department: "",
    team_member_3_phone: "",
    team_member_3_email: "",
    team_member_3_register_number: "",
  })

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value })
  }

  const hadleSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post("https://web-it-like-spider.onrender.com/hackathon/register/", input)
      console.log(res.status,res.data);
      setStatus(res.status)
    }

    catch (e) {
      console.log(e.message);
      setStatus(400)
    }
  }





  const renderComponen = () => {
    switch (page) {
      case 0:
        return <StepOne inputHandler={inputHandler} input={input} />
      case 1:
        return <StepTwo inputHandler={inputHandler} input={input} />
      case 2:
        return <StepThree inputHandler={inputHandler} input={input} />
      case 3:
        return <RegisterRes status={status} page={page}  setPage={setPage} />
      default:
        return null;
    }
  }


  return (
    <div className="w-full h-screen  flex flex-col gap-5   justify-center items-center ">
      <h1 className=" font-semibold text-xl lg:text-3xl">Register</h1>
      <div className="w-[95%]  formglass flex flex-col items-center rounded-md gap-7 py-7 justify-around ">
        {
          page !==3 ? (  <div className="flex  items-center gap-6 text-base font-semibold">
          <p className=" lg:text-xl">Memeber</p>
          <div className=" w-10 h-10 rounded-full flex items-center justify-center lg:text-xl font-bold text-white border-purple-500 bg-[#8008AB] shadow-lg shadow-purple-500">
            {page + 1}
          </div>
          <div  className="lg:text-xl">Details</div>
        </div>):null
        }
        {
          renderComponen()
        }
         {
          page!==3 ? ( <div className="w-[90%] flex justify-between items-center">
          <button style={page === 0 ? { visibility: 'hidden' } : {}} className=" flex items-center gap-2 justify-center font-bold px-3 py-1  w-[110px] btnGlass " onClick={() => page <= 0 ? setPage(0) : setPage(page -= 1)}><AiOutlineArrowLeft/> Back  </button >

          {
            page === 2 ? (<button onClick={(e) => {
              hadleSubmit(e); page >= 3 ? setPage(limit - 1) : setPage(page += 1)
            }} className="flex items-center gap-4 justify-center font-bold px-3 py-1 w-[110px]  btnGlass " >Submit</button>) : (
              <button className="flex items-center gap-2  justify-center font-bold px-3 py-1  rounded-md w-[110px] btnGlass " onClick={() => page >= 3 ? setPage(limit - 1) : setPage(page += 1)} >Next <AiOutlineArrowRight /> </button>)
          }


        </div>) :null
         }
      </div>
    </div>
  );
};

export default Register;
