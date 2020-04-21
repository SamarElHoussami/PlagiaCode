import React, {Fragment} from 'react';
import '../App.css';
import Routing from './Routing';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '../components/NavBar';


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedInStatus: localStorage.getItem('loggedInStatus')
    }

    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleLogin(data) {
    this.setState({
      loggedInStatus: "true"
    });

    localStorage.setItem('loggedInStatus', true);
    localStorage.setItem('user', JSON.stringify(data));
    console.log("handled login: " + JSON.stringify(data) + " " + localStorage.getItem() + " <---");

  }

  handleUpdate(data) {
    this.setState({
      loggedInStatus: "true"
    });

    localStorage.setItem('user', JSON.stringify(data));
  }

  handleLogout() {
    this.setState({
      loggedInStatus: "false"
    });

    localStorage.setItem('loggedInStatus', false);
    localStorage.setItem('user', '');
  }

  render() {
    return (
      <Fragment>
          <NavBar loggedInStatus={this.state.loggedInStatus} handleLogout={this.handleLogout} />
          <Routing
            handleLogin={this.handleLogin}
            handleLogout={this.handleLogout}
            handleUpdate={this.handleUpdate}
            loggedInStatus={localStorage.getItem('loggedInStatus')}
            user={localStorage.getItem('user')}
          />
        </Fragment>
    );
  }
}

export default App;