import React from 'react';

const List = (props) => (
  <div css={{
    padding: "12px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #efefef",
    position: "relative",
    ":hover": {
      cursor: "pointer",
    }
  }}>
    <div css={{
      position: "absolute",
      fontSize: "1.2em",
      top: "50%",
      transform: "translateY(-50%)"
    }}>{props.position}</div>
    <div css={{
      float: "right",
      marginTop: "18px"
    }}>
      {`Points: ${props.points}`}
    </div>
    <div css={{
      marginLeft: "40px",
    }}>
    <div css={{ fontSize: "1.2em"}} >{props.title}</div>
    <div css={{ opacity: "0.45", fontSize: "0.8em", marginTop: "8px" }}>{props.subTitle}</div>

    </div>

  </div>
);

const TeamList = (props) => (
  <div  onClick={props.onClick}>
    <div id={props.slot} css={{
      padding: "10px",
      backgroundColor: props.backgroundColor,
      cursor: "pointer"
    }}>
      <div id={props.slot} css={{
        display : "inline-block",
        marginRight: "8px",
        fontSize : "0.9em"
      }}>{props.slot}</div>
      <div id={props.slot} css={{
        display : "inline-block",
        fontSize : "0.9em"
      }}>{props.name}</div>
      <div>
        {props.score}
      </div>
    </div>
  </div>
)

export {
  List,
  TeamList
}
