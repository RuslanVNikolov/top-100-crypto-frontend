import React, { createContext, useState } from 'react';

const initialState = {
  token: localStorage.getItem('token'),
  username: localStorage.getItem('username'),
};

const AuthContext = createContext({
  authState: initialState,
  setAuthState: () => {},
});

const AuthProvider = (props) => {
  const [state, setState] = useState(initialState);

  const setAuthState = (newState) => {
    setState((prevState) => {
      const updatedState = { ...prevState, ...newState };

      // Store the token and username in localStorage
      localStorage.setItem('token', updatedState.token || '');
      localStorage.setItem('username', updatedState.username || '');

      return updatedState;
    });
  };

  return (
    <AuthContext.Provider value={{ authState: state, setAuthState }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
