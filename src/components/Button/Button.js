import React from 'react';

import classes from './Button.css'

const button = (props) => {

    let buttonClasses = classes.Button;

    if(props.children === "Continue"){
        buttonClasses = [classes.Reset, classes.Button].join(" ") 
    }

    if(props.classN === "Link"){
        buttonClasses = classes.Button_Switch;
    }

    return (
        <button 
            className={buttonClasses} 
            onClick={props.click}
            disabled={props.disabled}
            >{props.children}</button>
    )
}

export default button;