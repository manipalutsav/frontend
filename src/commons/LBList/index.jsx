import React from "react";

const LBList = (props) => (
  <div css={{
    display: "flex",
    justifyContent: "space-between",
    textAlign: "center",
    alignItems: "center",
    padding: 12,
    borderBottom: "1px dashed rgba(0, 0, 0, .1)",
    color: props.color || "rgba(0, 0, 0, .5)"
  }}>
    <div css={{
      fontSize: "1.2em",
    }}>
      {props.position}
    </div>

    <div css={{
    }}>
      <div css={{
        fontSize: "1.2em"
      }}>
        {props.title}
      </div>
      <div css={{
        fontSize: "0.5em"
      }}>
        Team : {props.team}
      </div>
      <div css={{
        fontSize: "0.9em",
        // color: "rgba(0, 0, 0, .5)",
      }}>
        {props.description}
      </div>
    </div>

    <div css={{
      fontSize: "0.9em",
      // color: "rgba(0, 0, 0, .5)",
    }}>
      {
        props.points === undefined
          ? null
          : <>
            {props.main ? '' : <>
              <div>{props.points}</div>
              <div>Points</div>
            </>
            }
          </>
      }
    </div>
  </div>
);

export default LBList;
