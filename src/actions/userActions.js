import reducer from "../reducers/userReducer.js";

export const login = (email, password) => {
  reducer.dispatch({type: 'LOGIN', email, password});
}

export const create = (payload) => {
  reducer.dispatch({type: 'CREATE', payload});
}

export const get = (id) => {
  reducer.dispatch({type: 'GET', id});
}

export const update = (payload) => {
  reducer.dispatch({type: 'UPDATE', payload});
}

export const logout = () => {
  reducer.dispatch({type: 'LOGOUT'});
}
