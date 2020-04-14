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

    }
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);

    this.handleInput = this.handleInput.bind(this)

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
     console.log(JSON.stringify(userData));
    fetch('http://localhost:5000/api/users/register', {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }).then(response => {
      if(!response.ok) {
        response.json().then(data => {
          console.log(JSON.stringify(data)); //TODO: show errors to user
        });
      }
      else {
        response.json().then(data => {
          console.log("Successful " + JSON.stringify(data));
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

  render() {
    return (
      <Fragment>
      <h1 className={styles.pageTitle}>Register</h1><hr/>
      <div className={styles.formContainer}>
        <form className="container" onSubmit={this.handleFormSubmit}>

          <Input type={"text"}
            title={"Full Name"}
            name={"name"}
            value={this.state.newUser.name}
            placeholder={"Enter your name"}
            handleChange={this.handleInput}/> {/* Name of the user */}

          <Input type={"text"}
            title={"Email"}
            name={"email"}
            value={this.state.newUser.email}
            placeholder={"Enter your email"}
            handleChange={this.handleInput}/> {/* Email of user */}

          <Input type={"password"}
            title={"Password"}
            name={"password"}
            value={this.state.newUser.password}
            placeholder={"Create a password"}
            handleChange={this.handleInput}/> {/* Password of user */}

          <Input type={"password"}
            title={"Re-enter Password"}
            name={"password2"}
            value={this.state.newUser.password2}
            placeholder={"Re-enter password"}
            handleChange={this.handleInput}/> {/* Password of user */}

          <Select title={"I am a: "}
            name={"type"}
            options={this.state.typeOptions}
            value={this.state.newUser.type}
            placeholder={"Select type of user"}
            handleChange={this.handleInput}/> {/* Type Selection */}

          <Button
            action={this.handleFormSubmit}
            type={"primary"}
            title={"Submit"}
            style={buttonStyle}
          />{" "}
          {/*Submit */}

          <Button
            action={this.handleClearForm}
            type={"secondary"}
            title={"Clear"}
            style={buttonStyle}
          />{" "}
          {/* Clear the form */}
        </form>

        <div className={styles.changeAuth}>
          <Link to="/login">Already have an account? Login!</Link>
        </div>
      </div>
      </Fragment>
    );
  }
}

const buttonStyle = {
  margin: "10px 10px 10px 0px"
};

export default Register