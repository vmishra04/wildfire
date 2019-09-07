import React from 'react';
import './App.css';

import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import Home from './components/home.js';
import OptIn from './components/optin.js';
import Evaluate from './components/evaluate.js';

function App() {
  return (
    <div className="App">

    <Router>
      <Route render={({ location }) => (
        <div className="singularity">
          <Route exact path="/" render={() => <Redirect to="/" />} />
          <TransitionGroup>
            <CSSTransition key={location.key} classNames="fade" timeout={{ enter: 500, exit: 0 }}
              transitionEnterTimeout={500}
              transitionLeaveTimeout={0} >
              <Switch location={location}>
                <Route exact path="/" component={Home} />
                <Route exact path="/optin" component={OptIn} />
                <Route exact path="/evaluate" component={Evaluate} />
              </Switch>
            </CSSTransition>
          </TransitionGroup>
        </div>
      )}
      />
    </Router>

    </div>
  );
}

export default App;
