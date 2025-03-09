import React from "react";

import Header from "../../commons/Header";
import Main from "../../commons/Main";
import Footer from "../../commons/Footer";

import "../base.css";

export default (props) => (
  <>
    <Header />
    <Main style={{ backgroundColor: "red" }}>
      { props.children }
    </Main>
    <Footer />
  </>
);
