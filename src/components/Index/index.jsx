import React from "react";
import utsavLogo from "../../images/loader.gif"
import Countdown from 'react-countdown';

const cookingEventsOpenDate = new Date("February 27, 2023, 23:59:59");
const cookingEventsCloseDate = new Date("March 6, 2023, 17:00:00");
const studentEventsOpenDate = new Date("March 20, 2023, 00:00:00");
const studentEventsCloseDate = new Date("April 1, 2023, 23:59:59");

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
  <div css={{ textAlign: "center" }}>
    <h2 className="mucapp">MAHE Utsav Coordinators App</h2>
    <h1 className="mucapp"> UTSAV 2023!</h1>
    <RegistrationTimer />
    <img className="mucapp" css={{ width: "60%" }} alt="Logo" src={utsavLogo} />
  </div >
  ;
