import React, { useState, useContext } from 'react';
import AuthForm from './AuthForm';
import classes from './Login.module.css';
import useAuth from './useAuth';
import { AuthContext } from './AuthContext';
import Modal from '../content/Modal'; // Import the new Modal component

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
            <Modal
              name={isSignUp ? "Sign Up" : "Login"}
              show={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              modalSize='small'
            >
              <AuthForm
                isSignUp={isSignUp}
                onSubmit={submitHandler}
                onSwitch={switchFormHandler}
                error={error}
              />
            </Modal>
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
}


export default Login;
