import React from "react";

export default (props) => (
  <div css = {{
    minHeight: "100vh",
    width:"75vw",
    padding: 20,
    // width:'100%',
    margin:"0 auto",
    // border:"2px solid red"
    '@media (max-width: 900px)': {
      width: "100vh",
    },
  }}>
    { props.children }
  </div>
);
