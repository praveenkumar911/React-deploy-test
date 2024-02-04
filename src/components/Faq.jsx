import React, { useState } from 'react'
import { MdOutlineKeyboardDoubleArrowDown } from 'react-icons/md'
import { MdOutlineKeyboardDoubleArrowUp } from 'react-icons/md'

const Faq = () => {

    const faqs = [
        {
            id: 1,
            title: "What is the KIET AI-THON?",
            ans: "KIET AI-THON is a 36-hour long weekend event where thousands of students from all over Kiet Group collaborate to work on fun problem statements based on software and AI domains to give an obliging solution. "
        },
        {
            id: 2,
            title: "Who can participate?",
            ans: "KIET AI-THON is open to all undergraduate students from all colleges across KIET GROUP."
        },  
        {
            id: 3,
            title: "How much is the participation fee?",
            ans: "Kindly contact your Head Of The Department."
        },
        {
            id: 4,
            title: "What are the prerequisites needed to participate in the hackathon?",
            ans: "A laptop and a cup of coffee."
        }


    ]

    const [arrow, setArrow] = useState([false, false, false, false])

    const handleArrow = (id) => {
        const temp = [...arrow]
        temp[id - 1] = !temp[id - 1]
        setArrow(temp)
    }

    return (
        <div name="faq" className='w-full flex  flex-col  items-center gap-9 py-32 '>
        <p className=' text-2xl font-bold   py-2'> Frequently Asked Questions
            </p>
            <div className=' w-full flex flex-col gap-3 md:w-[80%] lg:w-[60%]'>

                {
                    faqs.map(({ id, title, ans }) => (
                        <div onClick={ ()=> handleArrow(id)} key={id} className=' w-full flex  flex-col gap-5 px-6 py-2 fagTitle rounded-md '>
                            <div className=' flex w-full justify-between gap-5 '>

                                <p className=' font-bold text-lg '> {title} </p>
                                <div className=' font-bold text-2xl' onClick={() => handleArrow(id)}>
                                    {arrow[id - 1] ? <MdOutlineKeyboardDoubleArrowUp /> : <MdOutlineKeyboardDoubleArrowDown />}
                                </div>                                

                            </div>
                            {
                                arrow[id - 1] && (
                                    <div className=' transition text-justify faqGlass w-full py-4 px-6'>
                                        <p>{ans}</p>
                                    </div>
                                )
                            }


                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Faq
