import React, { Component } from 'react';
import styles from '../styles/registerStyle.module.css';
import { withRouter } from "react-router-dom";

/* Import Components */
import Input from '../components/Input';  
import Select from '../components/Select';
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
     console.log(JSON.stringify(userData));
    fetch('http://localhost:5000/api/users/login', {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }).then(response => {
      if(!response.ok) {
        console.log(response.data);
      }
      else {
        response.json().then(data => {
          console.log("Successful" + JSON.stringify(data));
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

  render() {
    return (
      <div className={styles.formContainer}>
        <form className="container" onSubmit={this.handleFormSubmit}>

          <Input type={"text"}
            title={"Email"}
            name={"email"}
            value={this.state.User.email}
            placeholder={"Enter your email"}
            handleChange={this.handleInput}/> {/* Email of user */}

          <Input type={"text"}
            title={"Password"}
            name={"password"}
            value={this.state.User.password}
            placeholder={"Create a password"}
            handleChange={this.handleInput}/> {/* Password of user */}

          <Button
            action={this.handleFormSubmit}
            type={"primary"}
            title={"Submit"}
            style={buttonStyle}
          />{" "}
          {/*Submit */}

        </form>
      </div>
    );
  }
}

const buttonStyle = {
  margin: "10px 10px 10px 10px"
};

export default Login