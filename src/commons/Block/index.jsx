import React from "react";


export default ({ show, children, id = null }) => {
    // console.log(show, id)
    return (show ? <>{children}</> : <></>);
}