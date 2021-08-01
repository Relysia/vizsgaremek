import { useState, createContext, useEffect } from 'react';
import './sass/App.sass';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import Landing from './components/main/Landing';
import Home from './components/main/Home';
import Navbar from './components/main/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Budget from './components/private/Budget';

export const UserContext = createContext(null);
export const MenuContext = createContext(false);

function App() {
  const [user, setUser] = useState(null);
  const [menuActive, setMenuActive] = useState(false);

  const googleRegUrl = process.env.REACT_APP_GOOGLE_REG_URL;
  const googleAuthUrl = process.env.REACT_APP_GOOGLE_AUTH_URL;

  useEffect(() => {
    let token = localStorage.getItem('jwt');

    try {
      if (jwt_decode(token)) {
        setUser(jwt_decode(token));
      }

      if (jwt_decode(token).exp < Date.now() / 1000) {
        setUser(null);
        localStorage.removeItem('jwt');
      }
    } catch (error) {
      return;
    }
  }, []);

  return (
    <Router>
      <UserContext.Provider value={user}>
        <MenuContext.Provider value={menuActive}>
          <Navbar setUser={setUser} setMenuActive={setMenuActive} />
          <div className='top-bar'></div>
          <div className='bot-bar'></div>
          <Switch>
            {user ? (
              <>
                <Route path='/' exact component={Home}></Route>
                <Route path='/budget' exact component={Budget}></Route>
              </>
            ) : (
              <>
                <Route path='/' exact component={Landing}></Route>
                <Route
                  path='/googlereg'
                  component={() => {
                    window.location.href = googleRegUrl;
                    return null;
                  }}></Route>
                <Route
                  path='/googleauth'
                  component={() => {
                    window.location.href = googleAuthUrl;
                    return null;
                  }}></Route>
                <Route path='/login' component={Login}></Route>
                <Route path='/register' component={Register}></Route>
              </>
            )}
          </Switch>
        </MenuContext.Provider>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
