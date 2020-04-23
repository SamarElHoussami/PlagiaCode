import React from "react";
import styles from '../styles/registerStyle.module.css';

const Select = props => {
  return (
    <div className="form-group">
      <label htmlFor={props.name} className={styles.inputLabel}> {props.title} </label>
      <select
        id={props.name}
        name={props.name}
        value={props.value}
        onChange={props.handleChange}
        className={[styles.textInput, "form-control"].join(' ')}
        style={props.style}
      >
        <option value="" disabled>
          {props.placeholder}
        </option>
        {props.options.map(option => {
          return (
            <option key={option} value={option} label={option}>
              {option}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default Select;