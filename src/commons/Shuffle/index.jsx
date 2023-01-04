import React from "react";

import shuffle from "../../images/shuffle.gif";

export default () => (
  <div css={{
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    filter: "hue-rotate(245deg)"
  }}>
    <img className="mucapp" src={shuffle} alt="..." width="300" />
    <p css={{ margin: 0 }}>Shuffling...</p>
  </div>
);
