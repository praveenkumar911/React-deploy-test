import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

import { AiOutlineForm } from "react-icons/ai";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { MdOutlineCelebration } from "react-icons/md";
import { GiFinishLine } from "react-icons/gi";
import { TfiCup } from "react-icons/tfi";

import "react-vertical-timeline-component/style.min.css";

const timeLine = [
  {
    id: 1,
    date: "14th February",
    eventTitle: "Registration Begins",
    desc: "Let the fun begin",
    Icon: AiOutlineForm,
  },
  {
    id: 2,
    date: "16th February",
    eventTitle: "Registration Closes",
    desc: "Registration form closes",
    Icon: IoIosCloseCircleOutline,
  },
  {
    id: 3,
    date: "17th February",
    eventTitle: "Mentor Allocation",
    desc: "You get your own mentor to clear all your doubts",
    Icon: CgProfile,
  },
  {
    id: 4,
    date: "17th February",
    eventTitle: "Opening Ceremony",
    desc: "Hackathon Begins",
    Icon: MdOutlineCelebration,
  },
  {
    id: 5,
    date: "18th February",
    eventTitle: "Hackathon Concludes",
    desc: "36 Hours of fun",
    Icon: GiFinishLine,
  },

  {
    id: 6,
    date: "18th February",
    eventTitle: "Results Announcement",
    desc: "let's close",
    Icon: TfiCup,
  },
];

const Timeline = () => {
  return (
    <div className=" w-full min-h-screen  flex flex-col items-center px-4  py-10 md:px-6">
      <h1 className="text-3xl font-bold py-10">Timeline</h1>
      <VerticalTimeline>
        {timeLine.map(({ id, date, eventTitle, desc, Icon }) => (
          <VerticalTimelineElement
            key={id}
            className="vertical-timeline-element--work"
            contentStyle={{ background: "#151030", color: "#fff" }}
            contentArrowStyle={{ borderRight: "7px solid #151030" }}
            date={date}
            iconStyle={{ background: "#7C3AED",fontWeight:'bold', color: "#fff" }}
            icon={<Icon />}
          >
            <h3 className="vertical-timeline-element-title text-xl font-bold">{eventTitle}</h3>
            <p>{desc}</p>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </div>
  );
};

export default Timeline;
