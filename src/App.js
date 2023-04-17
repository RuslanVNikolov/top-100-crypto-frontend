import './App.css';
import { AuthContext } from './auth/AuthContext';
import Login from './auth/Login';
import CryptoTable from './content/CryptoTable';
import Portfolio from './content/Portfolio';
import { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

function App() {
  const [authState, setAuthState] = useState({
    token: null,
    username: null,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');

    if (storedToken && storedUsername) {
      setAuthState((prevState) => ({
        ...prevState,
        token: storedToken,
        username: storedUsername,
      }));
    }
  }, []);

  const { username } = authState;

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <Router>
        <div className="App">
          <nav>
            <ul>
              <li>
                <Link to="/">CryptoTable</Link>
              </li>
              {username && (
                <li>
                  <Link to="/portfolio">Portfolio</Link>
                </li>
              )}
              <li className="login-container">
                <Login />
              </li>
            </ul>
          </nav>
          <Routes>
            <Route path="/" element={<CryptoTable />} />
            {username && (
              <Route path="/portfolio" element={<Portfolio />} />
            )}
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
