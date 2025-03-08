import reducer from "../reducers/commonReducer.js";

export const send = (data) => {
  reducer.dispatch({type: 'SEND', data});
}