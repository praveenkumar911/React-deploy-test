import React, { useEffect, useState} from 'react'
import { ThreeDots } from 'react-loader-spinner'
import {useNavigate} from "react-router-dom"


const RegisterRes = ({ status, page, setPage }) => {

    const [Loading, setLoading] = useState(false)
    const navigate =useNavigate();


    useEffect(() => {

        setTimeout(() =>{
            setLoading(true)
        } , 2000);
       
    }, [])
      
     if( status!=null){
         if(status===200){
              setTimeout(() => {
                  navigate('/')
              }, 3000);
         }
         else{
             setTimeout(() => {
                  setPage(0)
             }, 3000);
         }
     }
     

    return (
        <div className='w-full min-h-[400px] flex flex-col justify-center px-10 gap-4 py-10 ' >
            <div className=' flex justify-center'>
                {Loading === false ? (<ThreeDots
                    height="80"
                    width="80"
                    radius="9"
                    color="#fff"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClassName=""
                    visible={true}
                />) : null
                }

            </div>


            {
                Loading && <div>
                     {   
                       
                        status === 200 ?  ( <div className='flex items-center justify-center px-4 py-7  formSubmissionGlass '>
                            <p className=' text-2xl font-bold text-center'>Thank you for your Successful Registration </p>
                            
                          
                        </div>) : (<div className='flex items-center justify-center px-4 py-7  formSubmissionGlass-1 '>
                            <p className=' text-2xl font-bold'>Opps Something Went Wrong</p>
                           
                        </div>)
                    }
                </div>
            }


        </div>
    )
}

export default RegisterRes
