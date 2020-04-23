import React, { Component, Fragment } from 'react';
import styles from '../styles/registerStyle.module.css';
import { Link } from "react-router-dom";

/* Import Components */
import Input from '../components/Input';  
import Select from '../components/Select';
import Button from '../components/Button';

class Register extends Component {  
  constructor(props) {
    super(props);

    this.state = {
      newUser: {
        name: '',
        email: '',
        password: '',
        password2: '',
        type: ''
      },

      typeOptions: ['Student', 'Teacher'],
      errors: [],
      errorMessage: ""

    }
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);

    this.handleInput = this.handleInput.bind(this);
    this.generateStyle = this.generateStyle.bind(this);

  }

  /* This life cycle hook gets executed when the component mounts */

  handleInput(e) {
    let value = e.target.value;
    let name = e.target.name;
    this.setState(
      prevState => ({
        newUser: {
          ...prevState.newUser,
          [name]: value
        }
      }),
      //() => console.log(this.state.newUser)
    );
  }

  handleFormSubmit(e) {
    e.preventDefault();
    let userData = this.state.newUser;
    fetch('/api/users/register', {
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
          //alert(JSON.stringify(errorMessage)) //TODO: show errors to user
        });
      }
      else {
        response.json().then(data => {
          this.props.handleLogin(data); //send data back to parent
          this.props.history.push('/dashboard');
        })
      }
      }).catch(err => {
       console.log('caught it!',err);
      });
  };

  handleClearForm(e) {
    e.preventDefault();
    this.setState({
      newUser: {
        name: '',
        email: '',
        password: '',
        password2: '',
        type: ''
      }
    });
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

  render() {
    return (
      <div className={styles.loginContainer}>
      <h1 className={styles.pageTitle}>Register</h1>
      <div className={styles.formContainer}>
        <form className="container" onSubmit={this.handleFormSubmit}>

          <Input type={"text"}
            title={"Full Name"}
            name={"name"}
            value={this.state.newUser.name}
            placeholder={"Enter your name"}
            handleChange={this.handleInput}
            style={this.generateStyle("name")}/> {/* Name of the user */}

          <Input type={"text"}
            title={"Email"}
            name={"email"}
            value={this.state.newUser.email}
            placeholder={"Enter your email"}
            handleChange={this.handleInput}
            style={this.generateStyle("email")}/> {/* Email of user */}

          <Input type={"password"}
            title={"Password"}
            name={"password"}
            value={this.state.newUser.password}
            placeholder={"Create a password"}
            handleChange={this.handleInput}
            style={this.generateStyle("password")}/> {/* Password of user */}

          <Input type={"password"}
            title={"Re-enter Password"}
            name={"password2"}
            value={this.state.newUser.password2}
            placeholder={"Re-enter password"}
            handleChange={this.handleInput}
            style={this.generateStyle("password2")}/> {/* Password of user */}

          <Select title={"I am a: "}
            name={"type"}
            options={this.state.typeOptions}
            value={this.state.newUser.type}
            placeholder={"Select type of user"}
            handleChange={this.handleInput}
            style={this.generateStyle("type")}/> {/* Type Selection */}

            <p style={{color: "red", textAlign: "center", fontSize: "19px", fontWeight: "bold"}}>{this.state.errorMessage}</p>

          <div className={styles.btnContainer}>
            <Button
              action={this.handleFormSubmit}
              type={"primary"}
              title={"Submit"}
              style={buttonStyle}
            />{" "}
            {/*Submit */}
          </div>
        </form>

        <div className={styles.changeAuth}>
          <Link to="/login">Already have an account? Login!</Link>
        </div>
      </div>
      </div>
    );
  }
}

const buttonStyle = {
  margin: "auto",
  width: "100%",
  border: "none"
};

export default Register