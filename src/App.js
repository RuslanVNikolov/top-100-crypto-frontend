import './App.css';
import { AuthContext } from './auth/AuthContext';
import Login from './auth/Login';
import CryptoTable from './content/CryptoTable';
import { useState } from 'react';

function App() {
  const [authState, setAuthState] = useState({
    token: null,
    isLoggedIn: false,
  });

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <div className='App'>
      <Login />
      <CryptoTable/>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
