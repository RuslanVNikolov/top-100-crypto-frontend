import React, { useState, useContext } from 'react';
import AuthForm from './AuthForm';
import classes from './Login.module.css';
import useAuth from './useAuth';
import { AuthContext } from './AuthContext';

const Login = (props) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { authState, setAuthState } = useContext(AuthContext);
  const { username } = authState;
  const { error, sendAuthRequest, validateCredentials } = useAuth(setAuthState);

  const switchFormHandler = () => {
    setIsSignUp((prevIsSignUp) => !prevIsSignUp);
  };

  const submitHandler = async (username, password) => {
    if (validateCredentials(username, password)) {
      await sendAuthRequest(isSignUp, username, password);
      setIsModalOpen(false);
    }
  };

  const logoutHandler = () => {
    setAuthState({ token: null, username: null });
  
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  };
  

  return (
    <div>
      {username ? (
        <button className={classes.openButton} onClick={logoutHandler}>
          Logout
        </button>
      ) : (
        <>
          {isModalOpen && (
            <div className={classes.backdrop}>
              <div className={classes.modal}>
                <div className={classes.modalHeader}>
                  <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
                  <button type="button" className={classes.closeButton} onClick={() => setIsModalOpen(false)}>
                    &times;
                  </button>
                </div>
                <div className={`${classes.modalBody} ${isSignUp ? 'signup-form' : 'login-form'}`}>
                  <AuthForm isSignUp={isSignUp} onSubmit={submitHandler} onSwitch={switchFormHandler} />
                </div>
              </div>
            </div>
          )}
          {!isModalOpen && (
            <button className={classes.openButton} onClick={() => setIsModalOpen(true)}>
              Login / Sign Up
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Login;
