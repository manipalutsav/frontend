import React, { useEffect, useState } from "react";
import utsavLogo from "../../images/loader.gif"
import Countdown from 'react-countdown';
import { getSetting } from "../../services/settingsServices";

const cookingEventsOpenDate = new Date("February 27, 2023, 23:59:59");
const cookingEventsCloseDate = new Date("March 6, 2023, 17:00:00");
const studentEventsOpenDate = new Date("March 15, 2023, 21:00:00");
const studentEventsCloseDate = new Date("March 27, 2023, 23:59:59");

const reg_renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return <span>registrations are closed!</span>;
  } else {
    if (days === 0 && hours === 0 && minutes === 0) {
      return <span>registrations close in: {seconds} seconds</span>;
    } else if (days === 0 && hours === 0) {
      return <span>registrations close in: {minutes} minutes and {seconds} seconds</span>;
    } else if (days === 0) {
      return <span>registrations close in: {hours} hours, {minutes} minutes and {seconds} seconds</span>;
    } else {
      return <span>registrations close in: {days} days, {hours} hours, {minutes} minutes and {seconds} seconds</span>;
    }
  }
};

const event_renderer = ({ days, hours, minutes, seconds, completed }) => {
  if(completed)
  {
    return <div className="m-4 flex justify-center">
        <div className="p-4 rounded-md bg-orange-200 text-3xl gap-2 align-middle justify-center flex outline outline-orange-500 outline-2">
            The event is on! <span className="font-['Noto_Color_Emoji']">🎉</span>
        </div>
    </div>
  }
  else{ // Text Countdown
    if (days === 0 && hours === 0 && minutes === 0) {
      return <span>Staff events start in: {seconds} seconds</span>;
    } else if (days === 0 && hours === 0) {
      return <span>Staff events start in: {minutes} minutes and {seconds} seconds</span>;
    } else if (days === 0) {
      return <span>Staff events start in: {hours} hours, {minutes} minutes and {seconds} seconds</span>;
    } else {
      return <span>Staff events start in: {days} days, {hours} hours, {minutes} minutes and {seconds} seconds</span>;
    }
  }
  // Block countdown
  // else{
  //   return (
  //     <div className="lg:m-4 sm:m-1">
  //       <div className="flex gap-5 justify-center lg:scale-75  transition-all my-3">
  //         <div className=" max-sm:gap-2 lg:w-[40%] max-w-[128px] lg:p-6 p-3 rounded-md bg-orange-200 gap-6 flex flex-col outline outline-orange-500">
  //           <div id="ct-day" className=" text-3xl md:text-6xl font-['Barlow_Condensed'] scale-y-150">{days}</div>
  //           <div className=" opacity-75 max-sm:text-xs">Day{days > 1?"s":""}</div>
  //         </div>
  //         <div className=" max-sm:gap-2 lg:w-[40%] max-w-[128px] lg:p-6 p-3 rounded-md bg-orange-200 gap-6 flex flex-col outline outline-orange-500">
  //           <div id="ct-day" className=" text-3xl md:text-6xl font-['Barlow_Condensed'] scale-y-150">{hours}</div>
  //           <div className=" opacity-75 max-sm:text-xs">Hour{hours > 1?"s":""}</div>
  //         </div>
  //         <div className=" max-sm:gap-2 lg:w-[40%] max-w-[128px] lg:p-6 p-3 rounded-md bg-orange-200 gap-6 flex flex-col outline outline-orange-500">
  //           <div id="ct-day" className=" text-3xl md:text-6xl font-['Barlow_Condensed'] scale-y-150">{minutes}</div>
  //           <div className=" opacity-75 max-sm:text-xs">Minute{minutes > 1?"s":""}</div>
  //         </div>
  //         <div className=" max-sm:gap-2 lg:w-[40%] max-w-[128px] lg:p-6 p-3 rounded-md bg-orange-200 gap-6 flex flex-col outline outline-orange-500">
  //           <div id="ct-day" className=" text-3xl md:text-6xl font-['Barlow_Condensed'] scale-y-150">{seconds}</div>
  //           <div className=" opacity-75 max-sm:text-xs">Second{seconds > 1?"s":""}</div>
  //         </div>
  //       </div>
  //       <div className=" text-orange-700 lg:w-[40%] rounded-b m-auto">Until the excitement unfolds!</div>
  //     </div>
  //   )
  // }
  
};

const RegistrationTimer = () => {
  const current_date = new Date();
  if (current_date >= studentEventsOpenDate) {
    return (<>
      <span>Student event </span>
      <Countdown date={studentEventsCloseDate} renderer={reg_renderer} />
    </>)
  } else if (current_date >= cookingEventsOpenDate) {
    return (<>
      <span>Cooking event </span>
      <Countdown date={cookingEventsCloseDate} renderer={reg_renderer} />
    </>)
  }
  return <></>

}

export default () =>{
  const [title, setTitle] = useState("UTSAV 2024!")
  useEffect(() => {
    getSetting("title").then(data=>setTitle(data || "UTSAV 2024!"));
  }, [])
  
  return (
    <div css={{ textAlign: "center" }}>
    <h2 className="mucapp">MAHE Utsav Coordinators App</h2>
    <h1 className="mucapp">{title}</h1>
    {/* <RegistrationTimer /> */}
    <div className="mt-8">
      <Countdown date={new Date("April 1, 2024, 10:30:00")} renderer={event_renderer}/>

    </div>
    {/* <div className=" text-orange-600 text-4xl m-2 my-4">Custom text here</div> */}
    {/* <div className="festival-live-message">The festival is on!</div> */}
    <img className="mucapp" css={{ width: "60%" }} alt="Logo" src={utsavLogo} />
  </div >
  ) 
};
