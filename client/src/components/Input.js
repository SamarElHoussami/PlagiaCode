import React from "react";
import styles from "../styles/registerStyle.module.css";

const Input = (props) => {
    return (  
  <div className="form-group">
    <label htmlFor={props.name} className={[styles.inputLabel, "form-label"].join(' ')}>{props.title}</label>
    <input
      className={[styles.textInput, "form-control"].join(' ')}
      id={props.name}                  
      name={props.name}
      type={props.type}                 //number or text
      value={props.value}
      onChange={props.handleChange}
      placeholder={props.placeholder} 
      style={props.style}
    />
  </div>
)
}

export default Input;