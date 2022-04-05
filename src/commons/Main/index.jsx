import React from "react";

export default (props) => (
  <main css={{
    minHeight: "100vh",
    display: "flex",
    overflow: "scroll"
  }}>
    {props.children}
  </main>
);
