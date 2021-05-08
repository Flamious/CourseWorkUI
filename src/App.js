import logo from './logo.svg';
import './App.css';
import Registration from "./auth/registration";
import Login from "./login/login";
import SignInSide from './signin';
import {Home} from './content/Home';
import {Navigation} from './Navigation/Navigation';
import * as Posts from './content/post';

import {BrowserRouter, Route, Switch} from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      {/* <h3 className="m3 d-flex justify-content-center">
        Share Your Music!
      </h3> */}

      {/* <Navigation/> */}

      <Switch>
        <Route path="/" component={Home} exact/>
        {/* <Route path="/p" component={Posts.PostsList} exact/> */}
        <Route path="/signup" component={Registration} exact/>
        <Route path="/signin" component={Login} exact/>
        {/* <Route path="/best" component={Best} exact/> */}
      </Switch>
    </BrowserRouter>
  );
}

export default App;
