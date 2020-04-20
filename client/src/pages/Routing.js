import React, {Fragment} from 'react';
import { Route, BrowserRouter as Router, Switch} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import Home from './Home';
import Courses from './Courses';
import CoursePage from './CoursePage';


class Routing extends React.Component {
  constructor(props) {
    super(props);
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
                  loggedInStatus={this.props.loggedInStatus}
                />
            )}/>

            <Route exact path="/dashboard" render={props => (
                <Dashboard
                  {...props}
                  handleUpdate={this.props.handleUpdate}
                  handleLogin={this.props.handleLogin}
                  handleLogout={this.props.handleLogout}
                  loggedInStatus={this.props.loggedInStatus}
                />
            )}/>

            <Route exact path="/courses" render={props => (
                <Courses
                  {...props}
                  handleUpdate={this.props.handleUpdate}
                  handleLogin={this.props.handleLogin}
                  handleLogout={this.props.handleLogout}
                  loggedInStatus={this.props.loggedInStatus}
                />
            )}/>

            <Route exact path="/courses/:name" render={props => (
                <CoursePage
                  {...props}
                  handleUpdate={this.props.handleUpdate}
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
