import React from 'react';
import '../App.css';
import Routing from './Routing';

class App extends React.Component {
  constructor() {
    super();

    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogin(data) {
    localStorage.setItem('loggedInStatus', true);
    localStorage.setItem('user', JSON.stringify(data));

  }

  handleLogout() {
    localStorage.setItem('loggedInStatus', false);
    localStorage.setItem('user', '');
  }

  render() {
    return (
      <Routing
        handleLogin={this.handleLogin}
        handleLogout={this.handleLogout}
        loggedInStatus={localStorage.getItem('loggedInStatus')}
        user={localStorage.getItem('user')}
      />
    );
  }
}

export default App;