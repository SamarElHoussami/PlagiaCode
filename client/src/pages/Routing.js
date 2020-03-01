import React from 'react';
import { Route, BrowserRouter as Router, Switch} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import Home from './Home';

class Routing extends React.Component {
  constructor(props) {
    super(props);
    console.log("router: " + JSON.stringify(props));
  }

  render() {
    return (
      <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" render={props => (
                <Login
                  {...props}
                  handleLogin={this.props.handleLogin}
                  handleLogout={this.props.handleLogout}
                  loggedInStatus={this.props.loggedInStatus}
                />
            )}/>
            <Route exact path="/register" render={props => (
                <Register
                  {...props}
                  handleLogin={this.props.handleLogin}
                  handleLogout={this.props.handleLogout}
                  loggedInStatus={this.props.state.loggedInStatus}
                />
            )}/>

            <Route exact path="/dashboard" render={props => (
                <Dashboard
                  {...props}
                  handleLogin={this.props.handleLogin}
                  handleLogout={this.props.handleLogout}
                  loggedInStatus={this.props.loggedInStatus}
                />
            )}/>
          </Switch>
      </Router>
    );
  }
}

export default Routing;
