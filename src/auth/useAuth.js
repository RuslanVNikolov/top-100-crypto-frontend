import { useState } from 'react';

const API_BASE_URL = 'http://localhost:8080';

const useAuth = (setAuthState) => {
  const [error, setError] = useState();

  const sendAuthRequest = async (newUser, username, password) => {
    const fullPath = `${API_BASE_URL}/auth/${newUser ? 'register' : 'login'}`;
    console.log(fullPath)
    const response = await fetch(fullPath, {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      setError({
        title: 'Unable to authenticate',
        message: response.statusText,
      });
      console.error(error);
    }

    const token = await response.json();
    console.log(token);
    setAuthState({ username: username, token: token});
    return token;
  };

  const validateCredentials = (username, password) => {
    if (username.length === 0 || password.length === 0) {
      setError({
        title: 'Invalid input',
        message: 'Please enter a valid username and password (non-empty values).',
      });
      console.error(error);
      return false;
    }

    return true;
  };

  return { error, sendAuthRequest, validateCredentials };
};

export default useAuth;
