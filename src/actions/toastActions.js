import reducer from "../reducers/toastReducer.js";

export const toast = (message) =>  {

  reducer.dispatch({type:'SHOW_TOAST',message});
}
