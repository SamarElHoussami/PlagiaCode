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
      },
      errors: [],
      errorMessage: ""
    }
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleInput = this.handleInput.bind(this)
    this.handleUserLogout = this.handleUserLogout.bind(this);
    this.generateStyle = this.generateStyle.bind(this);

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

    generateStyle(name) {
    if(this.state.errors.includes(name)) {
      const style = {
        border: "2px solid red"
      }
      return style;
    } else {
      const style = {
      }

      return style;
    }
  }


  handleFormSubmit(e) {
    e.preventDefault();
    let userData = this.state.User;
    fetch('/api/users/login', {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }).then(response => {
      if(!response.ok) {
       response.json().then(data => {
          const errorNames = Object.keys(data);
          var errors = [];
            errorNames.forEach(error => {
                errors.push(error);
            });

            var errorMessage = "";
            if(errorNames.length === 1) {
              errorMessage = Object.values(data)[0];
            } else {
              errorMessage = "Please input required fields";
            }

            this.setState({
              errors: errors,
              errorMessage: errorMessage
            });
        });
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
            <div className={styles.loginContainer}>
            <h1 className={styles.pageTitle}>Login</h1>
            <div className={styles.formContainer}>
              <form className="container" onSubmit={this.handleFormSubmit}>

                <Input type={"text"}
                  title={"Email"}
                  name={"email"}
                  value={this.state.User.email}
                  placeholder={"Enter your email"}
                  handleChange={this.handleInput}
                  style={this.generateStyle("email")}/> {/* Email of user */}

                <Input type={"password"}
                  title={"Password"}
                  name={"password"}
                  value={this.state.User.password}
                  placeholder={"Create a password"}
                  handleChange={this.handleInput}
                  style={this.generateStyle("password")}/> {/* Password of user */}

                <p style={{color: "red", textAlign: "center", fontSize: "19px", fontWeight: "bold"}}>{this.state.errorMessage}</p>
                
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
            </div>
          );
        }
      }
    }
}

const buttonStyle = {
    display: "block",
    width: "90%",
    margin: "auto",
    border: "none"
};

export default Login