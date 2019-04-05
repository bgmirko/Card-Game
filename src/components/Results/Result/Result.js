import React from 'react';

import classes from './Result.css';

const result = (props) => {

    return (
        <tr className={props.markResult ? classes.Last_Game : null} id={props.markResult ? 'focus' : null}>
            <td>{props.position}</td>
            <td>{props.userName}</td>
            <td>{props.time}</td>
            <td>{props.moves}</td>
        </tr>
    )

}

export default result;