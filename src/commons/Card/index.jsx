import React from 'react';
import { Button, Input } from '../Form'
import { navigate } from 'gatsby';
import { FiX } from "react-icons/fi";

const RoundCard = (props) => (
  <div
    css={{
      margin: "2%",
      padding: 20,
      borderRadius: "4px",
      // border: "2px solid #efefef",
      minWidth: "100px",
      maxWidth: "400px",
      display: "inline-block",
      boxShadow: "0px 5px 12px -5px rgba(0, 0, 0, .1)",
    }}
  >
    <div css={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 20,
      fontSize: "1.2em",
    }}>
      <span>{props.title}</span>
      <span css={{
        cursor: "pointer",
        ":hover": {
          color: "red",
        },
      }}>
        <FiX onClick={() => props.onClick(props.roundId)} />
      </span>
    </div>

    {/* TODO: enable tag later on*/}
    {/*<Tag styles={{
              float: "right",
              margin: 16,
            }} type={props.type}/>*/}
    <div>
      <Button onClick={event => { navigate(`/events/${props.eventId}/rounds/${props.roundId}/edit`) }} styles={{ color: "black", backgroundColor: "#f5f5f5", width: "100%" }} color="#f5f5f5" >Edit Round</Button>
      <Button onClick={event => { navigate(`/events/${props.eventId}/rounds/${props.roundId}/slot`) }} styles={{ marginTop: "16px", color: "black", backgroundColor: "#f5f5f5", width: "100%" }} color="#f5f5f5" >View Slots</Button>
      <Button onClick={event => { navigate(`/judge/${props.eventId}/rounds/${props.roundId}`); }} styles={{ marginTop: "16px", width: "100%" }} value="Start Round" >Start Round</Button>
      <Button onClick={event => { navigate(`/events/${props.eventId}/rounds/${props.roundId}/bias`); }} styles={{ marginTop: "16px", width: "100%" }} >Bias</Button>
      <Button onClick={event => { navigate(`/events/${props.eventId}/rounds/${props.roundId}/scoresheet`); }} styles={{ marginTop: "16px", width: "100%" }} value="View Scoresheet" >View Scoresheet</Button>
      <Button onClick={event => { navigate(`/events/${props.eventId}/rounds/${props.roundId}/leaderboard`); }} styles={{ marginTop: "16px", width: "100%" }} value="Start Round" >View Leaderboard</Button>
    </div>
  </div>
);

const CriteriaCard = (props) => (
  <div
    css={{
      margin: "2%",
      borderRadius: "4px",
      width: (props.single) ? "100%" : "40%",
      display: "inline-block",
      boxShadow: "0px 5px 12px -5px rgba(0, 0, 0, .1)",
    }}
  >
    <div
      css={{
        padding: "16px",
        fontSize: "1em",
        textAlign: "center"
      }}
    >{props.title} </div>

    <div
      css={{
        padding: "16px",
      }}
    >
      <Input
        value={props.value}
        name={props.name}
        type="number"
        onChange={props.onChange}
        placeholder="Enter points here"
        disabled={props.disabled}
        styles={{
          width: "100%",
          textAlign: "center",
          fontSize: "1.3em",
          margin: 0,
        }}
      />
    </div>
  </div>
);

export {
  RoundCard,
  CriteriaCard
}
