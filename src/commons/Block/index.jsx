import React from "react";


export default ({ show, children }) => {
    console.log({ show });
    return (show ? <div>{children}</div> : <></>);
}