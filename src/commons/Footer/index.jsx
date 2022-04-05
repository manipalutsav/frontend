import React from "react";
import { Link } from "gatsby";
import constants, { servers } from '../../utils/constants';


const Contact = (props) => <a href={"tel:+91" + props.number}>{props.name} ({props.number})</a>

export default () => (
  <footer className="no-print" css={{
    color: "white",
    backgroundColor: "black",
    padding: "50px 20px",
    textAlign: "center"
  }}>
    <div>
      Copyright &copy; {(new Date().getFullYear())} - MAHE
    </div>
    <br />
    <div>
      If you have any issues or queries, please feel free to contact
      <br />
      <Contact name="Poornima" number="9980853396" />
      &ensp;or&ensp;
      <Contact name="Sambit" number="9986104763" />
    </div>
    <div>
      <Link to="/devs" css={{ color: "white" }}><span role="img" aria-label="unicorn">🦄</span></Link>
    </div>
    {constants.server === servers.testing ? <p>Testing</p> : <></>}
    {constants.server === servers.development ? <p>Development</p> : <></>}
  </footer>
);
