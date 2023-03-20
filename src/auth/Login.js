import React, { useState } from 'react';
import AuthForm from './AuthForm';
import classes from './Login.module.css';
import useAuth from './useAuth';

const Login = (props) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { error, sendAuthRequest, validateCredentials } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const switchFormHandler = () => {
    setIsSignUp((prevIsSignUp) => !prevIsSignUp);
  };

  const submitHandler = async (username, password) => {
    if (validateCredentials(username, password)) {
      await sendAuthRequest(isSignUp, username, password);
    }
  };

  return (
    <div>
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

    </div>
  );
};

export default Login;
