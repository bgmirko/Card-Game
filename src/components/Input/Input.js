import React from 'react';

import classes from './Input.css';

const input = (props) => {

    let inputElement = null;
    const inputClasses = [classes.InputElement];

    if (props.invalid && props.shouldValidate && props.touched) {
        inputClasses.push(classes.Invalid);
    }

    switch( props.elementType ){
        case ('input'):
            inputElement = (    
            <div className={classes.Container}>
                 <input
                    className = {inputClasses.join(' ')}
                    {...props.elementConfig}
                    value = {props.value}
                    onChange = {props.changed}
                    onKeyUp = {props.keyUp}/>
                <p className={classes.Error}>{props.errorMsg}</p>
            </div>
            );
             break;
        default: 
            inputElement = <input
                className={inputClasses.join(' ')}
                {...props.elementConfig}
                value={props.value}
                onChange={props.changed} />;
    }

    return(
        <div className={classes.Input}>
            <label className={classes.Label}>{props.label}</label>
            {inputElement}
        </div>
    );

};


export default input;