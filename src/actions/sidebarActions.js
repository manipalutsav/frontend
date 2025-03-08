import store from '../reducers/sidebarReducer.js';

export const open = () => store.dispatch({type:'open'})
export const close = () => store.dispatch({type:'close'})
