import React from "react";
import utsavLogo from "../../images/loader.gif"
import Countdown from 'react-countdown';

const cookingEventsOpenDate = new Date("February 27, 2023, 23:59:59");
const cookingEventsCloseDate = new Date("March 6, 2023, 17:00:00");
const studentEventsOpenDate = new Date("March 15, 2023, 21:00:00");
const studentEventsCloseDate = new Date("March 27, 2023, 23:59:59");

const renderer = ({ days, hours, minutes, seconds, completed }) => {
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

const RegistrationTimer = () => {
  const current_date = new Date();
  if (current_date >= studentEventsOpenDate) {
    return (<>
      <span>Student event </span>
      <Countdown date={studentEventsCloseDate} renderer={renderer} />
    </>)
  } else if (current_date >= cookingEventsOpenDate) {
    return (<>
      <span>Cooking event </span>
      <Countdown date={cookingEventsCloseDate} renderer={renderer} />
    </>)
  }
  return <></>

}

export default () =>
  <div css={{ textAlign: "center", color: "#1b4079"}}>
    <h2 css={{ fontSize: "30px", paddingBottom:"30px" }}>Welcome to</h2>
    <h1 css={{ fontSize: "45px", color: "#F86F15", paddingBottom:"20px", fontWeight:"lighter" }}>MAHE UTSAV Coordinators' App</h1>
    <h2 css={{ fontSize: "40px", paddingBottom:"45px"}}>UTSAV 2023</h2>
    <img css={{ width: "35%", marginLeft:"33%"}} alt="Logo" src={utsavLogo} />
  </div>
  ;
