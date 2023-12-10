import React, { useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";

import "../styles/input.css";

const Input = (props) => {
  const changeHandler = (e) => {
    props.setDataHandler({ id: props.id, value: e.target.value });
  };

  return (
    <div className={`input-container ${props?.className}`}>
      <label className="default-lable">{props.lableText}</label>
      <InputText
        id={props.id}
        className={`${
          props.isValidValue ? "default-input" : "not-valid-input"
        } `}
        value={props.value}
        type={props.inputType}
        placeholder={props.placeholder}
        onChange={changeHandler}
      />
      {!props.isValidValue && (
        <div className="error-message">
          <Message
            severity="error"
            text={props.errorMessage || "Неверный формат данных"}
          />
        </div>
      )}
    </div>
  );
};

export default Input;
