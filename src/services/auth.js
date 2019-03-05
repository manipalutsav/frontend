import constants from '../utils/constants';
export const isBrowser = () => typeof window !== "undefined";


export const getUser = () =>{
// Wrap the require in check for window
  if(typeof window !== `undefined`) {
    isBrowser() && window.localStorage.getItem("utsavUser")
      ? JSON.parse(window.localStorage.getItem("utsavUser"))
      : {};
  }
  else
    return {};
}

const setUser = user =>{
  if(typeof window !== `undefined`) {
    window.localStorage.setItem("utsavUser", JSON.stringify(user));
    return user;
  }
  else
    return {};
}

const authorize = async ({ email, password }) => {
  let response = await fetch(constants.server+'/users/login', {
    method: 'post',
    mode: "cors",
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
     email,
     password
    })
   });
   return await response.json();
};

export const handleLogin = async (partialUser) => {
  // TODO: Add some sanity checks

  let user = await authorize(partialUser);
  if(user.data)
    return setUser(user);
  else
    return user;
}

export const isLoggedIn = () => {
let { data } = getUser();
  if(data)
    return !!data.email;
};

export const logout = callback => {
  setUser({});
  callback();
};
