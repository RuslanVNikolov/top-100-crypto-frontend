// AuthForm.js
import React, { useRef } from 'react';
import classes from './Login.module.css';

const AuthForm = ({ isSignUp, onSubmit }) => {
  const usernameInputRef = useRef();
  const passwordInputRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredUserame = usernameInputRef.current.value.trim();
    const enteredPassword = passwordInputRef.current.value.trim();

    onSubmit(enteredUserame, enteredPassword);
    usernameInputRef.current.value = '';
    passwordInputRef.current.value = '';
  };

  return (
    <form onSubmit={submitHandler} className={classes.modalBody}>
      <div className={classes.inputGroup}>
        <label htmlFor="username">Username</label>
        <input id="username" ref={usernameInputRef} type="text" />
      </div>
      <div className={classes.inputGroup}>
        <label htmlFor="password">Password</label>
        <input id="password" ref={passwordInputRef} type="password" />
      </div>
      <div className={classes.buttonGroup}>
        <button type="submit" className={classes.loginButton}>
          {isSignUp ? 'Sign up' : 'Login'}
        </button>
      </div>
    </form>
  );
};

export default AuthForm;
