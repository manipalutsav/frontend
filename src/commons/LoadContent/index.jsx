import React from "react";

import Loader from "../Loader";

export default ({ loading, children, noDiv, ...attrs }) => (loading ? <Loader /> : (noDiv ? children : <div {...attrs}>{children}</div>))