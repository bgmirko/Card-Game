import React from 'react';

import classes from './Card.css';

import cardback from '../../assets/img/card-back.jpg';


const card = (props) => {

    let backClasses = [classes.Card__side, classes.Card__side__back, classes.Card__side__back_1].join(" ");
    let frontClasses = [classes.Card__side, classes.Card__side__front].join(" ");

    switch (props.status) {
        case ("locked"): {
            backClasses = [classes.Card__side, classes.Card__side__back, classes.Card__side__back_1, classes.locked].join(" ");
            frontClasses = [classes.Card__side, classes.Card__side__front].join(" ");
            break;
        }
        case ("open"):
            frontClasses = [classes.Card__side, classes.Card__side__back, classes.Card__side__back_1].join(" ");
            backClasses = [classes.Card__side, classes.Card__side__front].join(" ");
            break;
        case ("closed"):
            backClasses = [classes.Card__side, classes.Card__side__back, classes.Card__side__back_1].join(" ");
            frontClasses = [classes.Card__side, classes.Card__side__front].join(" ");
            break;
        default:
            backClasses = [classes.Card__side, classes.Card__side__back, classes.Card__side__back_1].join(" ");
            frontClasses = [classes.Card__side, classes.Card__side__front].join(" ");
    }

    return (
        <div className={classes.Card} onClick={props.click}>
            <div className={backClasses}>
                <img src={cardback} alt="" onDragStart={props.onDrag} />
            </div>
            <div className={frontClasses}>
                <img src={require(`../../assets/img/gradovi/${props.value}.jpg`)} alt="" onDragStart={props.onDrag} />
            </div>
        </div>
    )
}

export default card;