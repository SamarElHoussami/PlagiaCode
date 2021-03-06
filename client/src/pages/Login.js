import React, { Component, Fragment } from 'react';
import styles from '../styles/registerStyle.module.css';
import { Link} from "react-router-dom";

/* Import Components */
import Input from '../components/Input';  
import Button from '../components/Button';


class Login extends Component {  
  constructor(props) {
    super(props);

    this.state = {
      User: {
        email: '',
        password: '',
      }
    }
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleInput = this.handleInput.bind(this)
    this.handleUserLogout = this.handleUserLogout.bind(this);

  }

  /* This life cycle hook gets executed when the component mounts */

  handleInput(e) {
    let value = e.target.value;
    let name = e.target.name;
    this.setState(
      prevState => ({
        User: {
          ...prevState.User,
          [name]: value
        }
      }),
      //() => console.log(this.state.User)
    );
  }

  handleFormSubmit(e) {
    e.preventDefault();
    let userData = this.state.User;
    fetch('http://localhost:5000/api/users/login', {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }).then(response => {
      if(!response.ok) {
        alert("Invalid Credentials");
      }
      else {
        response.json().then(data => {
          this.props.handleLogin(data); //send data back to parent
          this.props.history.push({
            pathname: '/dashboard',
            state: { user: data }
          });
        })
      }
      }).catch(err => {
       console.log('caught it!',err);
      });
  };

  handleUserLogout() {
    this.props.handleLogout();
    window.location.reload();

  }

  render() {
    {
      if(this.props.loggedInStatus === "true") {
        return (
          <Button
            action={this.handleUserLogout}
            type={"primary"}
            title={"Sign out"}
            style={buttonStyle}
          />
        )} else {
          return (
            <Fragment>
            <h1 className={styles.pageTitle}>Login</h1><hr/>
            <div className={styles.formContainer}>
              <form className="container" onSubmit={this.handleFormSubmit}>

                <Input type={"text"}
                  title={"Email"}
                  name={"email"}
                  value={this.state.User.email}
                  placeholder={"Enter your email"}
                  handleChange={this.handleInput}/> {/* Email of user */}

                <Input type={"password"}
                  title={"Password"}
                  name={"password"}
                  value={this.state.User.password}
                  placeholder={"Create a password"}
                  handleChange={this.handleInput}/> {/* Password of user */}

                <Button
                  action={this.handleFormSubmit}
                  type={"primary"}
                  title={"Sign in"}
                  style={buttonStyle}
                />{""}
                {/*Submit */}

              </form>

              <div className={styles.changeAuth}>
                <Link to="/register">Don't have an account? Register!</Link>
              </div>
            </div>
            </Fragment>
          );
        }
      }
    }
}

const buttonStyle = {
    display: "block",
    width: "60%",
    margin: "auto"
};

export default Login